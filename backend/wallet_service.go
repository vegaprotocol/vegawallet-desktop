package backend

import (
	"encoding/json"
	"fmt"

	"code.vegaprotocol.io/go-wallet/service"
)

func (s *Handler) GetServiceConfig() (*service.Config, error) {
	s.log.Debug("Entering GetServiceConfig")
	defer s.log.Debug("Leaving GetServiceConfig")

	c, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := s.getServiceStore(c)
	if err != nil {
		return nil, err
	}

	svcConfig, err := st.GetConfig()
	if err != nil {
		s.log.Error(fmt.Sprintf("Couldn't retrieve the service configuration: %v", err))
		return nil, fmt.Errorf("couldn't retrieve the service configuration: %w", err)
	}

	return svcConfig, nil
}

func (s *Handler) SaveServiceConfig(jsonConfig string) (bool, error) {
	s.log.Debug("Entering SaveServiceConfig")
	defer s.log.Debug("Leaving SaveServiceConfig")

	c, err := s.loadAppConfig()
	if err != nil {
		return false, err
	}

	st, err := s.getServiceStore(c)
	if err != nil {
		return false, err
	}

	svcConfig := &service.Config{}
	err = json.Unmarshal([]byte(jsonConfig), svcConfig)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall JSON config: %v", err)
		return false, fmt.Errorf("couldn't unmarshal configuration: %w", err)
	}

	err = st.SaveConfig(svcConfig)
	if err != nil {
		s.log.Errorf("Couldn't save the service configuration: %v", err)
		return false, fmt.Errorf("couldn't save the service configuration: %w", err)
	}

	return true, nil
}
