package app

import (
	dbConfig "ReviewService/config/db"
	config "ReviewService/config/env"
	"ReviewService/controllers"
	repo "ReviewService/db/repositories"
	"ReviewService/router"
	"ReviewService/services"
	"fmt"
	"net/http"
	"time"
)

// Config holds the configuration for the server.
type Config struct {
	Addr string // PORT
}

type Application struct {
	Config Config
}

// Constructor for Config
func NewConfig() Config {

	port := config.GetString("PORT", ":8081")

	return Config{
		Addr: port,
	}
}

// Constructor for Application
func NewApplication(cfg Config) *Application {
	return &Application{
		Config: cfg,
	}
}

func (app *Application) Run() error {

	db, err := dbConfig.SetupDB()

	if err != nil {
		fmt.Println("Error setting up database:", err)
		return err
	}

	rr := repo.NewReviewRepository(db)
	rs := services.NewReviewService(rr)
	rc := controllers.NewReviewController(rs)
	rRouter := router.NewReviewRouter(rc)

	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      router.SetupRouter(rRouter),
		ReadTimeout:  10 * time.Second, // Set read timeout to 10 seconds
		WriteTimeout: 10 * time.Second, // Set write timeout to 10 seconds
	}

	fmt.Println("Starting Review Service on", app.Config.Addr)

	return server.ListenAndServe()
}
