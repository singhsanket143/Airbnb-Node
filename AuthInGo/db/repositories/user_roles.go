package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type UserRoleRepository struct {
	db *sql.DB
}

func NewUserRoleRepository(db *sql.DB) *UserRoleRepository {
	return &UserRoleRepository{db: db}
}

func (ur *UserRoleRepository) GetUserRoles(userId int64) ([]models.Role, error) {
	query := `
		SELECT r.id, r.name, r.description, r.created_at, r.updated_at 
		FROM roles r 
		JOIN user_roles ur ON r.id = ur.role_id 
		WHERE ur.user_id = $1
	`
	rows, err := ur.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []models.Role
	for rows.Next() {
		var role models.Role
		err := rows.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
		if err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}
	return roles, nil
}

func (ur *UserRoleRepository) AssignRoleToUser(userId, roleId int64) error {
	query := `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT (user_id, role_id) DO NOTHING`
	_, err := ur.db.Exec(query, userId, roleId)
	return err
}

func (ur *UserRoleRepository) RemoveRoleFromUser(userId, roleId int64) error {
	query := `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`
	result, err := ur.db.Exec(query, userId, roleId)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("user role assignment not found for user %d and role %d", userId, roleId)
	}
	return nil
}

func (ur *UserRoleRepository) GetUserPermissions(userId int64) ([]models.Permission, error) {
	query := `
		SELECT DISTINCT p.id, p.name, p.description, p.resource, p.action, p.created_at, p.updated_at 
		FROM permissions p 
		JOIN role_permissions rp ON p.id = rp.permission_id 
		JOIN user_roles ur ON rp.role_id = ur.role_id 
		WHERE ur.user_id = $1
	`
	rows, err := ur.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []models.Permission
	for rows.Next() {
		var permission models.Permission
		err := rows.Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt)
		if err != nil {
			return nil, err
		}
		permissions = append(permissions, permission)
	}
	return permissions, nil
}

func (ur *UserRoleRepository) HasPermission(userId int64, resource, action string) (bool, error) {
	query := `
		SELECT COUNT(*) 
		FROM permissions p 
		JOIN role_permissions rp ON p.id = rp.permission_id 
		JOIN user_roles ur ON rp.role_id = ur.role_id 
		WHERE ur.user_id = $1 AND p.resource = $2 AND p.action = $3
	`
	var count int
	err := ur.db.QueryRow(query, userId, resource, action).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (ur *UserRoleRepository) HasRole(userId int64, roleName string) (bool, error) {
	query := `
		SELECT COUNT(*) 
		FROM roles r 
		JOIN user_roles ur ON r.id = ur.role_id 
		WHERE ur.user_id = $1 AND r.name = $2
	`
	var count int
	err := ur.db.QueryRow(query, userId, roleName).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
