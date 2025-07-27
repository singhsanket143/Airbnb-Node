package router

import (
	"AuthInGo/controllers"
	"AuthInGo/middlewares"

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
	// Role CRUD operations
	r.Get("/roles/{id}", rr.roleController.GetRoleById)
	r.Get("/roles", rr.roleController.GetAllRoles)
	r.With(middlewares.CreateRoleRequestValidator).Post("/roles", rr.roleController.CreateRole)
	r.With(middlewares.UpdateRoleRequestValidator).Put("/roles/{id}", rr.roleController.UpdateRole)
	r.Delete("/roles/{id}", rr.roleController.DeleteRole)

	// Role permissions operations
	r.Get("/roles/{id}/permissions", rr.roleController.GetRolePermissions)
	r.With(middlewares.AssignPermissionRequestValidator).Post("/roles/{id}/permissions", rr.roleController.AssignPermissionToRole)
	r.With(middlewares.RemovePermissionRequestValidator).Delete("/roles/{id}/permissions", rr.roleController.RemovePermissionFromRole)
	r.Get("/role-permissions", rr.roleController.GetAllRolePermissions)
	r.With(middlewares.JWTAuthMiddleware, middlewares.RequireAllRoles("admin")).Post("/roles/{userId}/assign/{roleId}", rr.roleController.AssignRoleToUser)
}
