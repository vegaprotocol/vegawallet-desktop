package main

import (
	_ "embed"

	"code.vegaprotocol.io/vegawallet-desktop/backend"

	"github.com/wailsapp/wails"
)

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {
	handler := &backend.Handler{}
	app := wails.CreateApp(&wails.AppConfig{
		Resizable: true,
		MinWidth:  512,
		MinHeight: 384,
		Title:     "Vegawallet",
		JS:        js,
		CSS:       css,
		Colour:    "#ffffff",
	})
	app.Bind(handler)
	_ = app.Run()
}
