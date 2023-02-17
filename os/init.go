package os

import "code.vegaprotocol.io/vegawallet-desktop/os/notification"

// Init is responsible for setting up the application integration with
// OS-specific capabilities.
func Init() error {
	return notification.Init()
}
