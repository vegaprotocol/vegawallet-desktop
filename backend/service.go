package backend

import (
	"encoding/json"
	"errors"
	"fmt"

	"code.vegaprotocol.io/go-wallet/fsutil"
	"code.vegaprotocol.io/go-wallet/service"
	store "code.vegaprotocol.io/go-wallet/service/store/v1"

	"github.com/wailsapp/wails"
)

var (
	ErrFailedToInitialiseService     = errors.New("failed to initialise the service")
	ErrFailedToRetrieveServiceConfig = errors.New("failed to retrieve the service configuration")
	ErrFailedToSaveServiceConfig     = errors.New("failed to save the service configuration")

	rootPath = fsutil.DefaultVegaDir()
)

type Service struct {
	runtime *wails.Runtime
	log     *wails.CustomLogger
	store   *store.Store
}

func (b *Service) WailsInit(runtime *wails.Runtime) error {
	b.log = runtime.Log.New("Service")
	b.log.Debug("Entering WailsInit")
	defer b.log.Debug("Leaving WailsInit")

	b.runtime = runtime

	s, err := store.NewStore(rootPath)
	if err != nil {
		b.log.Errorf("couldn't create the service store: %v", err)
		return ErrFailedToInitialiseService
	}

	err = s.Initialise()
	if err != nil {
		b.log.Errorf("couldn't initialise the service store: %v", err)
		return ErrFailedToInitialiseService
	}

	b.store = s

	return nil
}

func (b *Service) GetConfig() (*service.Config, error) {
	b.log.Debug("Entering GetConfig")
	defer b.log.Debug("Leaving GetConfig")

	config, err := b.store.GetConfig()
	if err != nil {
		b.log.Error(fmt.Sprintf("couldn't retrieve the service configuration: %v", err))
		return nil, ErrFailedToRetrieveServiceConfig
	}

	return config, nil
}

func (b *Service) SaveConfig(jsonConfig string) (bool, error) {
	config := &service.Config{}
	err := json.Unmarshal([]byte(jsonConfig), config)
	if err != nil {
		b.log.Errorf(fmt.Sprintf("couldn't unmarshall JSON config: %v", err))
		return false, ErrFailedToSaveServiceConfig
	}

	err = b.store.SaveConfig(config, true)
	if err != nil {
		b.log.Errorf(fmt.Sprintf("couldn't save the service configuration: %v", err))
		return false, ErrFailedToSaveServiceConfig
	}

	return true, nil
}
