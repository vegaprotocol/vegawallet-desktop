package backend

import (
	"code.vegaprotocol.io/vegawallet/version"
)

func (s *Handler) GetVersion() *version.GetVersionResponse {
	s.log.Debug("Entering GetVersion")
	defer s.log.Debug("Leaving GetVersion")

	return version.GetVersionInfo()
}
