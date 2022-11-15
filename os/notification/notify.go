//go:build !darwin && cgo

package notification

import (
	"code.vegaprotocol.io/vegawallet-desktop/app"

	"github.com/gen2brain/beeep"
)

func Notify(title, message string) error {
	return beeep.Notify(app.Name, message, "")
}
