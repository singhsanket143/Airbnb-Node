package router

import (
	"AuthInGo/controllers"
	"AuthInGo/middlewares"
	"database/sql"

	"github.com/go-chi/chi/v5"
)

type RoleRouter struct {
	roleController *controllers.RoleController
}

func NewRoleRouter(db *sql.DB) Router {
	return &RoleRouter{
		roleController: controllers.NewRoleController(db),
	}
}

func (rr *RoleRouter) Register(r chi.Router) {
	// Role management routes - require admin role
	r.With(middlewares.JWTAuthMiddleware, middlewares.RequireRole("admin")).Group(func(r chi.Router) {
		r.Get("/roles", rr.roleController.GetAllRoles)
		r.Get("/roles/{id}", rr.roleController.GetRoleById)
		r.Post("/roles", rr.roleController.CreateRole)
		r.Put("/roles/{id}", rr.roleController.UpdateRole)
		r.Delete("/roles/{id}", rr.roleController.DeleteRole)
		r.Get("/roles/{id}/permissions", rr.roleController.GetRolePermissions)
	})
}
