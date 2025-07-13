package main

import (
	"AuthInGo/app"
	config "AuthInGo/config/env"
)

func main() {

	config.Load()

	cfg := app.NewConfig() // Set the server to listen on port 8080
	app := app.NewApplication(cfg)

	app.Run()
}
