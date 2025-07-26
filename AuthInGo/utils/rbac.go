package utils

import (
	repositories "AuthInGo/db/repositories"
	"AuthInGo/models"
	"database/sql"
	"strconv"
)

// RBACUtils provides utility functions for role-based access control
type RBACUtils struct {
	userRoleRepo *repositories.UserRoleRepository
}

// NewRBACUtils creates a new RBACUtils instance
func NewRBACUtils(db *sql.DB) *RBACUtils {
	return &RBACUtils{
		userRoleRepo: repositories.NewUserRoleRepository(db),
	}
}

// HasRole checks if a user has a specific role
func (r *RBACUtils) HasRole(userID string, roleName string) (bool, error) {
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
	if err != nil {
		return false, err
	}
	return r.userRoleRepo.HasRole(userIDInt, roleName)
}

// HasPermission checks if a user has a specific permission
func (r *RBACUtils) HasPermission(userID string, resource, action string) (bool, error) {
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
	if err != nil {
		return false, err
	}
	return r.userRoleRepo.HasPermission(userIDInt, resource, action)
}

// GetUserRoles returns all roles for a user
func (r *RBACUtils) GetUserRoles(userID string) ([]models.Role, error) {
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
	if err != nil {
		return nil, err
	}
	return r.userRoleRepo.GetUserRoles(userIDInt)
}

// GetUserPermissions returns all permissions for a user
func (r *RBACUtils) GetUserPermissions(userID string) ([]models.Permission, error) {
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
	if err != nil {
		return nil, err
	}
	return r.userRoleRepo.GetUserPermissions(userIDInt)
}

// AssignRoleToUser assigns a role to a user
func (r *RBACUtils) AssignRoleToUser(userID string, roleID int64) error {
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
	if err != nil {
		return err
	}
	return r.userRoleRepo.AssignRoleToUser(userIDInt, roleID)
}

// RemoveRoleFromUser removes a role from a user
func (r *RBACUtils) RemoveRoleFromUser(userID string, roleID int64) error {
	userIDInt, err := strconv.ParseInt(userID, 10, 64)
	if err != nil {
		return err
	}
	return r.userRoleRepo.RemoveRoleFromUser(userIDInt, roleID)
}
