package backend

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"code.vegaprotocol.io/vega/libs/jsonrpc"
	"code.vegaprotocol.io/vega/paths"
	"code.vegaprotocol.io/vega/wallet/network"
	netstore "code.vegaprotocol.io/vega/wallet/network/store/v1"
	"code.vegaprotocol.io/vega/wallet/node"
	"code.vegaprotocol.io/vega/wallet/service"
	"code.vegaprotocol.io/vega/wallet/wallets"
)

type StartServiceRequest struct {
	Network string `json:"network"`
}

func (r StartServiceRequest) Check() error {
	if len(r.Network) == 0 {
		return errors.New("network is required")
	}

	return nil
}

func (h *Handler) StartService(req *StartServiceRequest) (bool, error) {
	h.log.Debug("Entering StartService")
	defer h.log.Debug("Leaving StartService")

	if h.service.IsRunning() {
		h.log.Error("The service is already running")
		return false, ErrServiceAlreadyRunning
	}

	if err := req.Check(); err != nil {
		return false, err
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return false, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return false, err
	}

	handler := wallets.NewHandler(wStore)

	netStore, err := netstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise network store: %v", err))
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	exists, err := netStore.NetworkExists(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't verify the network existence: %v", err))
		return false, fmt.Errorf("couldn't verify the network existence: %w", err)
	}
	if !exists {
		h.log.Error(fmt.Sprintf("Network %s does not exist", req.Network))
		return false, network.NewDoesNotExistError(req.Network)
	}

	cfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise network store: %v", err))
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	logLevel := cfg.LogLevel.String()
	log, err := buildLogger(logLevel, h.configLoader.LogFilePathForSvc())
	if err != nil {
		return false, err
	}
	defer syncLogger(log)

	svcStore, err := h.getServiceStore(config)
	if err != nil {
		return false, err
	}

	isInit, err := service.IsInitialised(svcStore)
	if err != nil {
		return false, fmt.Errorf("couldn't verify service initialisation state: %w", err)
	}

	if !isInit {
		if err = service.InitialiseService(svcStore, false); err != nil {
			return false, fmt.Errorf("couldn't initialise the service: %w", err)
		}
	}

	auth, err := service.NewAuth(log.Named("auth"), svcStore, cfg.TokenExpiry.Get())
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise authentication: %v", err))
		return false, fmt.Errorf("couldn't initialise authentication: %w", err)
	}

	forwarder, err := node.NewForwarder(log.Named("forwarder"), cfg.API.GRPC)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the node forwarder: %v", err))
		return false, fmt.Errorf("couldn't initialise the node forwarder: %w", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	loggingCancelFn := func() {
		log.Info("Triggering cancel function")
		cancel()
	}

	policy := service.NewExplicitConsentPolicy(ctx, h.service.ConsentRequestsChan, h.service.SentTransactionsChan)
	srv, err := service.NewService(log.Named("service"), cfg, jsonrpc.New(log.Named("json-rpc")), handler, auth, forwarder, policy)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service: %v", err))
		loggingCancelFn()
		return false, err
	}

	h.service.Set(
		fmt.Sprintf("%s:%v", cfg.Host, cfg.Port),
		func() {
			loggingCancelFn()
			if err := srv.Stop(); err != nil {
				h.log.Error(fmt.Sprintf("Couldn't stop the service: %v", err))
			}
		},
	)

	go func() {
		h.log.Info("Starting to listen to pending request channel")
		for {
			select {
			case <-ctx.Done():
				h.log.Info("Stop listening to channels")
				return
			case consentRequest := <-h.service.ConsentRequestsChan:
				h.emitNewConsentRequestEvent(consentRequest)
			case sentTransaction := <-h.service.SentTransactionsChan:
				h.emitTransactionSentEvent(sentTransaction)
			}
		}
	}()

	go func() {
		h.log.Info("Starting the service")
		if err := srv.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			h.log.Error(fmt.Sprintf("Error while starting HTTP server: %v", err))
			loggingCancelFn()
			h.service.Reset()
			h.log.Info("Service state has been reset")
		}
	}()

	return true, nil
}

type GetServiceStateResponse struct {
	URL     string `json:"url"`
	Running bool   `json:"running"`
}

func (h *Handler) GetServiceState() GetServiceStateResponse {
	h.log.Debug("Entering GetServiceState")
	defer h.log.Debug("Leaving GetServiceState")

	return GetServiceStateResponse{
		URL:     h.service.URL(),
		Running: h.service.IsRunning(),
	}
}

func (h *Handler) StopService() (bool, error) {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.service.IsRunning() {
		h.log.Error("No service running")
		return false, ErrServiceNotRunning
	}

	h.log.Info("Stopping the service")
	h.service.Shutdown()
	h.service.Reset()
	h.log.Info("Service stopped")

	return true, nil
}
