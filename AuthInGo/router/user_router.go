package router

import (
	"AuthInGo/controllers"
	"AuthInGo/middlewares"

	"github.com/go-chi/chi/v5"
)

type UserRouter struct {
	userController *controllers.UserController
}

func NewUserRouter(_userController *controllers.UserController) Router {
	return &UserRouter{
		userController: _userController,
	}
}

func (ur *UserRouter) Register(r chi.Router) {
	// Public routes
	r.With(middlewares.UserCreateRequestValidator).Post("/signup", ur.userController.CreateUser)
	r.With(middlewares.UserLoginRequestValidator).Post("/login", ur.userController.LoginUser)
	
	// Protected routes - require authentication
	r.With(middlewares.JWTAuthMiddleware).Get("/profile", ur.userController.GetUserById)
	
	// Admin-only routes - require admin role
	r.With(middlewares.JWTAuthMiddleware, middlewares.RequireRole("admin")).Group(func(r chi.Router) {
		// Add admin-specific user management endpoints here
		// Example: r.Get("/users", ur.userController.GetAllUsers)
	})
	
	// Moderator routes - require moderator role
	r.With(middlewares.JWTAuthMiddleware, middlewares.RequireRole("moderator")).Group(func(r chi.Router) {
		// Add moderator-specific endpoints here
		// Example: r.Get("/users", ur.userController.GetAllUsers)
	})
}
