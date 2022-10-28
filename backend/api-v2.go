package backend

import (
	"errors"
	"fmt"
	"strings"

	"code.vegaprotocol.io/vega/libs/jsonrpc"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
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

func (h *Handler) SubmitWalletAPIRequest(request *jsonrpc.Request) (*jsonrpc.Response, error) {
	h.log.Debug("Entering SubmitWalletAPIRequest", zap.String("method", request.Method))
	defer h.log.Debug("Leaving SubmitWalletAPIRequest", zap.String("method", request.Method))

	if err := h.ensureAppIsInitialised(); err != nil {
		return nil, err
	}

	return h.walletAPI.DispatchRequest(h.ctx, request), nil
}

func (h *Handler) RespondToInteraction(interaction interactor.Interaction) error {
	h.log.Debug("Entering RespondToInteraction")
	defer h.log.Debug("Leaving RespondToInteraction")

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

	h.currentService.responseChan <- interaction

	return nil
}

func (h *Handler) emitReceivedInteraction(log *zap.Logger, interaction interactor.Interaction) {
	log.Debug("Received a new interaction",
		zap.String("interaction", string(interaction.Name)),
		zap.String("trace-id", interaction.TraceID),
	)

	if shouldEmitOSNotification(interaction.Name) {
		message := strings.ToLower(strings.ReplaceAll(string(interaction.Name), "_", " "))
		if err := notification.Notify(app.Name, message); err != nil {
			log.Warn("Could not send the OS notification", zap.Error(err))
		}
	}

	runtime.EventsEmit(h.ctx, NewInteractionEvent, interaction)
}

func shouldEmitOSNotification(interactionName interactor.InteractionName) bool {
	return !(interactionName == interactor.LogName ||
		interactionName == interactor.InteractionSessionBeganName ||
		interactionName == interactor.InteractionSessionEndedName)
}
