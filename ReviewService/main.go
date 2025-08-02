package main

import (
	"ReviewService/app"
	config "ReviewService/config/env"
)

func main() {

	config.Load()

	cfg := app.NewConfig() // Set the server to listen on port 8081
	app := app.NewApplication(cfg)

	app.Run()
}
