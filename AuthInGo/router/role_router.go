package router

import (
	"AuthInGo/controllers"

	"github.com/go-chi/chi/v5"
)

type RoleRouter struct {
	roleController *controllers.RoleController
}

func NewRoleRouter(_roleController *controllers.RoleController) Router {
	return &RoleRouter{
		roleController: _roleController,
	}
}

func (rr *RoleRouter) Register(r chi.Router) {
	r.Get("/roles/{id}", rr.roleController.GetRoleById)
	r.Get("/roles", rr.roleController.GetAllRoles)
}
