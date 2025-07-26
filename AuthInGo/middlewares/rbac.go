package middlewares

import (
	repositories "AuthInGo/db/repositories"
	"database/sql"
	"net/http"
	"strconv"
)

// RequireRole middleware checks if the user has a specific role
func RequireRole(roleName string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIDStr := r.Context().Value("userID").(string)
			userID, err := strconv.ParseInt(userIDStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			// Get database connection from context
			dbConn := r.Context().Value("db").(*sql.DB)
			userRoleRepo := repositories.NewUserRoleRepository(dbConn)

			hasRole, err := userRoleRepo.HasRole(userID, roleName)
			if err != nil {
				http.Error(w, "Error checking user role", http.StatusInternalServerError)
				return
			}

			if !hasRole {
				http.Error(w, "Insufficient permissions", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// RequirePermission middleware checks if the user has a specific permission
func RequirePermission(resource, action string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIDStr := r.Context().Value("userID").(string)
			userID, err := strconv.ParseInt(userIDStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			// Get database connection from context
			dbConn := r.Context().Value("db").(*sql.DB)
			userRoleRepo := repositories.NewUserRoleRepository(dbConn)

			hasPermission, err := userRoleRepo.HasPermission(userID, resource, action)
			if err != nil {
				http.Error(w, "Error checking user permissions", http.StatusInternalServerError)
				return
			}

			if !hasPermission {
				http.Error(w, "Insufficient permissions", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// RequireAnyRole middleware checks if the user has any of the specified roles
func RequireAnyRole(roleNames ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIDStr := r.Context().Value("userID").(string)
			userID, err := strconv.ParseInt(userIDStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			// Get database connection from context
			dbConn := r.Context().Value("db").(*sql.DB)
			userRoleRepo := repositories.NewUserRoleRepository(dbConn)

			hasAnyRole := false
			for _, roleName := range roleNames {
				hasRole, err := userRoleRepo.HasRole(userID, roleName)
				if err != nil {
					http.Error(w, "Error checking user roles", http.StatusInternalServerError)
					return
				}
				if hasRole {
					hasAnyRole = true
					break
				}
			}

			if !hasAnyRole {
				http.Error(w, "Insufficient permissions", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// RequireAllRoles middleware checks if the user has all of the specified roles
func RequireAllRoles(roleNames ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIDStr := r.Context().Value("userID").(string)
			userID, err := strconv.ParseInt(userIDStr, 10, 64)
			if err != nil {
				http.Error(w, "Invalid user ID", http.StatusUnauthorized)
				return
			}

			// Get database connection from context
			dbConn := r.Context().Value("db").(*sql.DB)
			userRoleRepo := repositories.NewUserRoleRepository(dbConn)

			for _, roleName := range roleNames {
				hasRole, err := userRoleRepo.HasRole(userID, roleName)
				if err != nil {
					http.Error(w, "Error checking user roles", http.StatusInternalServerError)
					return
				}
				if !hasRole {
					http.Error(w, "Insufficient permissions", http.StatusForbidden)
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
