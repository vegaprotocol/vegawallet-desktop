package main

import (
	_ "embed"

	"desktop-wallet/backend"

	"github.com/wailsapp/wails"
)

//go:embed frontend/build/static/js/main.js
var js string

//go:embed frontend/build/static/css/main.css
var css string

func main() {
	svc := &backend.Service{}
	app := wails.CreateApp(&wails.AppConfig{
		Resizable: true,
		MinWidth:  512,
		MinHeight: 384,
		Title:     "Vega Protocol's Wallet",
		JS:        js,
		CSS:       css,
		Colour:    "#ffffff",
	})
	app.Bind(svc)
	_ = app.Run()
}
