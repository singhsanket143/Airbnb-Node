package db

import (
	"AuthInGo/models"
	"database/sql"
)

type RolePermissionRepository interface {
	GetRolePermissionById(id int64) (*models.RolePermission, error)
	GetRolePermissionByRoleId(roleId int64) ([]*models.RolePermission, error)
	AddPermissionToRole(roleId int64, permissionId int64) (*models.RolePermission, error)
	RemovePermissionFromRole(roleId int64, permissionId int64) error
	GetAllRolePermissions() ([]*models.RolePermission, error)
}

type RolePermissionRepositoryImpl struct {
	db *sql.DB
}

func NewRolePermissionRepository(_db *sql.DB) RolePermissionRepository {
	return &RolePermissionRepositoryImpl{
		db: _db,
	}
}

func (rp *RolePermissionRepositoryImpl) GetRolePermissionById(id int64) (*models.RolePermission, error) {
	query := "SELECT id, role_id, permission_id, created_at, updated_at FROM role_permissions WHERE id = ?"
	row := rp.db.QueryRow(query, id)

	rolePermission := &models.RolePermission{}
	if err := row.Scan(&rolePermission.Id, &rolePermission.RoleId, &rolePermission.PermissionId, &rolePermission.CreatedAt, &rolePermission.UpdatedAt); err != nil {
		return nil, err
	}
	return rolePermission, nil
}

func (rp *RolePermissionRepositoryImpl) GetRolePermissionByRoleId(roleId int64) ([]*models.RolePermission, error) {
	query := "SELECT id, role_id, permission_id, created_at, updated_at FROM role_permissions WHERE role_id = ?"
	rows, err := rp.db.Query(query, roleId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rolePermissions []*models.RolePermission
	for rows.Next() {
		rolePermission := &models.RolePermission{}
		if err := rows.Scan(&rolePermission.Id, &rolePermission.RoleId, &rolePermission.PermissionId, &rolePermission.CreatedAt, &rolePermission.UpdatedAt); err != nil {
			return nil, err
		}
		rolePermissions = append(rolePermissions, rolePermission)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return rolePermissions, nil
}

func (rp *RolePermissionRepositoryImpl) AddPermissionToRole(roleId int64, permissionId int64) (*models.RolePermission, error) {
	query := "INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())"
	result, err := rp.db.Exec(query, roleId, permissionId)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &models.RolePermission{
		Id:           id,
		RoleId:       roleId,
		PermissionId: permissionId,
		CreatedAt:    "NOW()",
		UpdatedAt:    "NOW()",
	}, nil
}

func (rp *RolePermissionRepositoryImpl) RemovePermissionFromRole(roleId int64, permissionId int64) error {
	query := "DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?"
	result, err := rp.db.Exec(query, roleId, permissionId)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (rp *RolePermissionRepositoryImpl) GetAllRolePermissions() ([]*models.RolePermission, error) {
	query := "SELECT id, role_id, permission_id, created_at, updated_at FROM role_permissions"
	rows, err := rp.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rolePermissions []*models.RolePermission
	for rows.Next() {
		rolePermission := &models.RolePermission{}
		if err := rows.Scan(&rolePermission.Id, &rolePermission.RoleId, &rolePermission.PermissionId, &rolePermission.CreatedAt, &rolePermission.UpdatedAt); err != nil {
			return nil, err
		}
		rolePermissions = append(rolePermissions, rolePermission)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return rolePermissions, nil
}
