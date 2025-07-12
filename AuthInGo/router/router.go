package router

import (
	"AuthInGo/controllers"

	"github.com/go-chi/chi/v5"
)

type Router interface {
	Register(r chi.Router)
}

func SetupRouter(UserRouter Router) *chi.Mux {

	chiRouter := chi.NewRouter()

	chiRouter.Get("/ping", controllers.PingHandler)

	UserRouter.Register(chiRouter)

	return chiRouter

}
