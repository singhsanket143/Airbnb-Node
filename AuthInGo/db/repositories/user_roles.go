package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
	"strings"
)

type UserRoleRepository interface {
	GetUserRoles(userId int64) ([]*models.Role, error)
	AssignRoleToUser(userId int64, roleId int64) error
	RemoveRoleFromUser(userId int64, roleId int64) error
	GetUserPermissions(userId int64) ([]*models.Permission, error)
	HasPermission(userId int64, permissionName string) (bool, error)
	HasRole(userId int64, roleName string) (bool, error)
	HasAllRoles(userId int64, roleNames []string) (bool, error)
	HasAnyRole(userId int64, roleNames []string) (bool, error)
}

type UserRoleRepositoryImpl struct {
	db *sql.DB
}

func NewUserRoleRepository(_db *sql.DB) UserRoleRepository {
	return &UserRoleRepositoryImpl{
		db: _db,
	}
}

func (u *UserRoleRepositoryImpl) GetUserRoles(userId int64) ([]*models.Role, error) {
	query := `
		SELECT r.id, r.name, r.description, r.created_at, r.updated_at
		FROM user_roles ur
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE ur.user_id = ?`
	rows, err := u.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []*models.Role
	for rows.Next() {
		role := &models.Role{}
		if err := rows.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return roles, nil
}

func (u *UserRoleRepositoryImpl) AssignRoleToUser(userId int64, roleId int64) error {
	query := "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)"
	_, err := u.db.Exec(query, userId, roleId)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserRoleRepositoryImpl) RemoveRoleFromUser(userId int64, roleId int64) error {
	query := "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?"
	_, err := u.db.Exec(query, userId, roleId)
	if err != nil {
		return err
	}
	return nil
}

func (u *UserRoleRepositoryImpl) GetUserPermissions(userId int64) ([]*models.Permission, error) {
	query := `
		SELECT p.id, p.name, p.description, p.resource, p.action, p.created_at, p.updated_at
		FROM user_roles ur
		INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
		INNER JOIN permissions p ON rp.permission_id = p.id
		WHERE ur.user_id = ?`
	rows, err := u.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []*models.Permission
	for rows.Next() {
		permission := &models.Permission{}
		if err := rows.Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt); err != nil {
			return nil, err
		}
		permissions = append(permissions, permission)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return permissions, nil
}

func (u *UserRoleRepositoryImpl) HasPermission(userId int64, permissionName string) (bool, error) {
	query := `
		SELECT COUNT(*) > 0
		FROM user_roles ur
		INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
		INNER JOIN permissions p ON rp.permission_id = p.id
		WHERE ur.user_id = ? AND p.name = ?`
	var exists bool
	err := u.db.QueryRow(query, userId, permissionName).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (u *UserRoleRepositoryImpl) HasRole(userId int64, roleName string) (bool, error) {
	query := `
		SELECT COUNT(*) > 0
		FROM user_roles ur
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE ur.user_id = ? AND r.name = ?`
	var exists bool
	err := u.db.QueryRow(query, userId, roleName).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (u *UserRoleRepositoryImpl) HasAllRoles(userId int64, roleNames []string) (bool, error) {

	if len(roleNames) == 0 {
		return true, nil // If no roles are specified, return true
	}

	query := `
		SELECT COUNT(*) = ?
		FROM user_roles ur
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE ur.user_id = ? AND r.name IN (?)
		GROUP BY ur.user_id`

	roleNamesStr := strings.Join(roleNames, ",")

	row := u.db.QueryRow(query, len(roleNames), userId, roleNamesStr)

	var hasAllRoles bool
	if err := row.Scan(&hasAllRoles); err != nil {
		if err == sql.ErrNoRows {
			return false, nil // No roles found for the user
		}
		return false, err // Return any other error
	}

	return hasAllRoles, nil
}

func (u *UserRoleRepositoryImpl) HasAnyRole(userId int64, roleNames []string) (bool, error) {

	if len(roleNames) == 0 {
		return true, nil // If no roles are specified, return true
	}
	placeholders := strings.Repeat("?,", len(roleNames))
	placeholders = placeholders[:len(placeholders)-1]
	query := fmt.Sprintf("SELECT COUNT(*) > 0 FROM user_roles ur INNER JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ? AND r.name IN (%s)", placeholders)

	// Create args slice with userId first, then all roleNames
	args := make([]interface{}, 0, 1+len(roleNames))
	args = append(args, userId)
	for _, roleName := range roleNames {
		args = append(args, roleName)
	}

	row := u.db.QueryRow(query, args...)

	var hasAnyRole bool
	if err := row.Scan(&hasAnyRole); err != nil {
		if err == sql.ErrNoRows {
			return false, nil // No roles found for the user
		}
		return false, err // Return any other error
	}

	fmt.Println("hasAnyRole", hasAnyRole)

	return hasAnyRole, nil
}
