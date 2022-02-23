package backend

import (
	"errors"
	"fmt"
	"net/http"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet/network"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	"code.vegaprotocol.io/vegawallet/proxy"
	"github.com/skratchdot/open-golang/open"
)

func (h *Handler) StartConsole(req *StartServiceRequest) (bool, error) {
	h.log.Debug("Entering StartConsole")
	defer h.log.Debug("Leaving StartConsole")

	if h.console.IsRunning() {
		h.log.Error("The console is already running")
		return false, ErrConsoleAlreadyRunning
	}

	if err := req.Check(); err != nil {
		return false, err
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return false, err
	}

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
		return false, network.NewNetworkDoesNotExistError(req.Network)
	}

	cfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise network store: %v", err))
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	logLevel := cfg.Level.String()
	log, err := buildLogger(logLevel)
	if err != nil {
		return false, err
	}
	defer syncLogger(log)

	cs := proxy.NewProxy(
		cfg.Console.LocalPort,
		cfg.Console.URL,
		cfg.API.GRPC.Hosts[0],
	)

	go func() {
		h.log.Info("Starting the console")
		if err := cs.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			h.log.Error(fmt.Sprintf("Error while starting the console proxy: %v", err))
			h.console.Reset()
			h.log.Info("Console proxy state has been reset")
		}
	}()

	h.console.url = cs.GetBrowserURL()
	h.console.shutdownFunc = func() {
		if err := cs.Stop(); err != nil {
			h.log.Error(fmt.Sprintf("Couldn't stop the console proxy: %v", err))
		}
	}

	h.log.Info(fmt.Sprintf("Opening the console at %s", h.console.url))

	if err = open.Run(cs.GetBrowserURL()); err != nil {
		h.log.Error(fmt.Sprintf("Unable to open the console in the default browser: %v", err))
		return false, fmt.Errorf("unable to open the console in the default browser: %w", err)
	}

	return true, nil
}

func (h *Handler) GetConsoleState() GetServiceStateResponse {
	h.log.Debug("Entering GetConsoleState")
	defer h.log.Debug("Leaving GetConsoleState")

	return GetServiceStateResponse{
		URL:     h.console.url,
		Running: h.console.IsRunning(),
	}
}

func (h *Handler) StopConsole() (bool, error) {
	h.log.Debug("Entering StopConsole")
	defer h.log.Debug("Leaving StopConsole")

	if !h.console.IsRunning() {
		h.log.Error("No console proxy running")
		return false, ErrConsoleNotRunning
	}

	h.log.Info("Shutting down the console proxy")
	h.console.Shutdown()
	h.console.Reset()

	return true, nil
}

func (h *Handler) StartTokenDApp(req *StartServiceRequest) (bool, error) {
	h.log.Debug("Entering StartTokenDApp")
	defer h.log.Debug("Leaving StartTokenDApp")

	if h.tokenDApp.IsRunning() {
		h.log.Error("The token dApp proxy is already running")
		return false, ErrTokenDAppAlreadyRunning
	}

	if err := req.Check(); err != nil {
		return false, err
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return false, err
	}

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
		return false, network.NewNetworkDoesNotExistError(req.Network)
	}

	cfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise network store: %v", err))
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	logLevel := cfg.Level.String()
	log, err := buildLogger(logLevel)
	if err != nil {
		return false, err
	}
	defer syncLogger(log)

	tokenDApp := proxy.NewProxy(
		cfg.TokenDApp.LocalPort,
		cfg.TokenDApp.URL,
		cfg.API.GRPC.Hosts[0],
	)

	go func() {
		h.log.Info("Starting the token dApp")
		if err := tokenDApp.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			h.log.Error(fmt.Sprintf("Error while starting the token dApp proxy: %v", err))
			h.tokenDApp.Reset()
			h.log.Info("Token dApp proxy state has been reset")
		}
	}()

	h.tokenDApp.url = tokenDApp.GetBrowserURL()
	h.tokenDApp.shutdownFunc = func() {
		if err := tokenDApp.Stop(); err != nil {
			h.log.Error(fmt.Sprintf("Couldn't stop the token dApp proxy: %v", err))
		}
	}

	h.log.Info(fmt.Sprintf("Opening the token dApp at %s", h.tokenDApp.url))

	if err = open.Run(tokenDApp.GetBrowserURL()); err != nil {
		h.log.Error(fmt.Sprintf("Unable to open the token dApp in the default browser: %v", err))
		return false, fmt.Errorf("unable to open the token dApp in the default browser: %w", err)
	}

	return true, nil
}

func (h *Handler) GetTokenDAppState() GetServiceStateResponse {
	h.log.Debug("Entering GetTokenDAppState")
	defer h.log.Debug("Leaving GetTokenDAppState")

	return GetServiceStateResponse{
		URL:     h.tokenDApp.url,
		Running: h.tokenDApp.IsRunning(),
	}
}

func (h *Handler) StopTokenDApp() (bool, error) {
	h.log.Debug("Entering StopTokenDApp")
	defer h.log.Debug("Leaving StopTokenDApp")

	if !h.tokenDApp.IsRunning() {
		h.log.Error("No token dApp proxy running")
		return false, ErrTokenDAppNotRunning
	}

	h.log.Info("Shutting down the token dApp proxy")
	h.tokenDApp.Shutdown()
	h.tokenDApp.Reset()

	return true, nil
}
