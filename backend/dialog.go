package backend

import (
	"fmt"

	"github.com/adrg/xdg"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (h *Handler) ChooseFolder() (string, error) {
	folderPath, err := wailsRuntime.OpenDirectoryDialog(h.ctx, wailsRuntime.OpenDialogOptions{
		DefaultDirectory:           xdg.Home,
		Title:                      "Select a folder",
		ShowHiddenFiles:            true,
		CanCreateDirectories:       true,
		ResolvesAliases:            true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		return "", fmt.Errorf("could not open the file browser: %w", err)
	}
	return folderPath, nil
}
