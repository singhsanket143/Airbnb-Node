package router

import (
	"AuthInGo/controllers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Router interface {
	Register(r chi.Router)
}

func SetupRouter(UserRouter Router) *chi.Mux {

	chiRouter := chi.NewRouter()

	// chiRouter.Use(middlewares.RequestLogger) // Middleware for logging requests
	chiRouter.Use(middleware.Logger) // Built-in Chi middleware for logging requests

	// chiRouter.Use(middlewares.RateLimitMiddleware)

	chiRouter.Get("/ping", controllers.PingHandler)

	UserRouter.Register(chiRouter)

	return chiRouter

}
