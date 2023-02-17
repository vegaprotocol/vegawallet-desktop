package backend

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"code.vegaprotocol.io/vega/libs/jsonrpc"
	vgrand "code.vegaprotocol.io/vega/libs/rand"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	v2 "code.vegaprotocol.io/vega/wallet/service/v2"
	"code.vegaprotocol.io/vega/wallet/service/v2/connections"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"code.vegaprotocol.io/vegawallet-desktop/os/notification"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const NewInteractionEvent = "new_interaction"

var (
	ErrTraceIDIsRequired = errors.New("a trace ID is required for an interaction")
	ErrNameIsRequired    = errors.New("a name is required for an interaction")
)

func (h *Handler) APIV2GenerateAPIToken(params connections.GenerateAPITokenParams) (connections.Token, error) {
	handler := connections.NewGenerateAPITokenHandler(h.walletStore, h.tokenStore, v2.NewStdTime())
	return handler.Handle(h.ctx, params)
}

func (h *Handler) APIV2DeleteAPIToken(token string) error {
	return connections.DeleteAPIToken(h.tokenStore, token)
}

func (h *Handler) APIV2ListAPITokens() (connections.ListAPITokensResult, error) {
	return connections.ListAPITokens(h.tokenStore)
}

func (h *Handler) APIV2DescribeAPIToken(token string) (connections.TokenDescription, error) {
	return connections.DescribeAPIToken(h.tokenStore, token)
}

func (h *Handler) SubmitWalletAPIRequest(request jsonrpc.Request) (*jsonrpc.Response, error) {
	if err := h.ensureBackendStarted(); err != nil {
		return nil, err
	}

	h.log.Debug("Entering SubmitWalletAPIRequest", zap.String("method", request.Method))
	defer h.log.Debug("Leaving SubmitWalletAPIRequest", zap.String("method", request.Method))

	if err := h.ensureAppIsInitialised(); err != nil {
		return nil, err
	}

	traceID := vgrand.RandomStr(64)
	ctx := context.WithValue(h.ctx, jsonrpc.TraceIDKey, traceID)

	return h.walletAdminAPI.DispatchRequest(ctx, request), nil
}

func (h *Handler) RespondToInteraction(interaction interactor.Interaction) error {
	if err := h.ensureBackendStarted(); err != nil {
		return err
	}

	h.log.Debug("Entering RespondToInteraction")
	defer h.log.Debug("Leaving RespondToInteraction")

	if err := h.ensureAppIsInitialised(); err != nil {
		return err
	}

	if interaction.TraceID == "" {
		return ErrTraceIDIsRequired
	}

	if interaction.Name == "" {
		return ErrNameIsRequired
	}

	h.log.Debug(fmt.Sprintf("Received a response %q with trace ID %q", interaction.Name, interaction.TraceID))

	if h.ctx.Err() != nil {
		h.log.Error("The application context has been canceled, could not respond to the interaction")
		return ErrContextCanceled
	}

	h.runningServiceManager.responseChan <- interaction

	return nil
}

func (h *Handler) emitReceivedInteraction(log *zap.Logger, interaction interactor.Interaction) {
	log.Debug("Received a new interaction",
		zap.String("interaction", string(interaction.Name)),
		zap.String("trace-id", interaction.TraceID),
	)

	if shouldEmitOSNotification(interaction.Name) {
		message := strings.ToLower(strings.ReplaceAll(string(interaction.Name), "_", " "))
		message = strings.ToUpper(message[:1]) + message[1:]
		if err := notification.Notify(app.Name, message); err != nil {
			log.Warn("Could not send the OS notification", zap.Error(err))
		}
	}

	if shouldBringAppToFront(interaction.Name) {
		runtime.WindowShow(h.ctx)
	}

	runtime.EventsEmit(h.ctx, NewInteractionEvent, interaction)
}

func shouldBringAppToFront(interactionName interactor.InteractionName) bool {
	return interactionName == interactor.RequestPassphraseName ||
		interactionName == interactor.RequestTransactionReviewForSigningName ||
		interactionName == interactor.RequestTransactionReviewForSendingName ||
		interactionName == interactor.RequestPermissionsReviewName ||
		interactionName == interactor.RequestWalletConnectionReviewName ||
		interactionName == interactor.RequestWalletSelectionName
}

func shouldEmitOSNotification(interactionName interactor.InteractionName) bool {
	return !(interactionName == interactor.LogName ||
		interactionName == interactor.InteractionSessionBeganName ||
		interactionName == interactor.InteractionSessionEndedName)
}
