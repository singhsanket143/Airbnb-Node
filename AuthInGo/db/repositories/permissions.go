package db

import (
	"AuthInGo/models"
	"database/sql"
)

type PermissionRepository interface {
	GetPermissionById(id int64) (*models.Permission, error)
	GetPermissionByName(name string) (*models.Permission, error)
	GetAllPermissions() ([]*models.Permission, error)
	CreatePermission(name string, description string, resource string, action string) (*models.Permission, error)
	DeletePermissionById(id int64) error
	UpdatePermission(id int64, name string, description string, resource string, action string) (*models.Permission, error)
}

type PermissionRepositoryImpl struct {
	db *sql.DB
}

func NewPermissionRepository(_db *sql.DB) PermissionRepository {
	return &PermissionRepositoryImpl{
		db: _db,
	}
}

func (p *PermissionRepositoryImpl) GetPermissionById(id int64) (*models.Permission, error) {
	query := "SELECT id, name, description, resource, action, created_at, updated_at FROM permissions WHERE id = ?"
	row := p.db.QueryRow(query, id)

	permission := &models.Permission{}
	if err := row.Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt); err != nil {
		return nil, err
	}
	return permission, nil
}

func (p *PermissionRepositoryImpl) GetPermissionByName(name string) (*models.Permission, error) {
	query := "SELECT id, name, description, resource, action, created_at, updated_at FROM permissions WHERE name = ?"
	row := p.db.QueryRow(query, name)

	permission := &models.Permission{}
	if err := row.Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt); err != nil {
		return nil, err
	}
	return permission, nil
}

func (p *PermissionRepositoryImpl) GetAllPermissions() ([]*models.Permission, error) {
	query := "SELECT id, name, description, resource, action, created_at, updated_at FROM permissions"
	rows, err := p.db.Query(query)
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

func (p *PermissionRepositoryImpl) CreatePermission(name string, description string, resource string, action string) (*models.Permission, error) {
	query := "INSERT INTO permissions (name, description, resource, action, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())"
	result, err := p.db.Exec(query, name, description, resource, action)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &models.Permission{
		Id:          id,
		Name:        name,
		Description: description,
		Resource:    resource,
		Action:      action,
		CreatedAt:   "NOW()",
		UpdatedAt:   "NOW()",
	}, nil
}

func (p *PermissionRepositoryImpl) DeletePermissionById(id int64) error {
	query := "DELETE FROM permissions WHERE id = ?"
	result, err := p.db.Exec(query, id)
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
func (p *PermissionRepositoryImpl) UpdatePermission(id int64, name string, description string, resource string, action string) (*models.Permission, error) {
	query := "UPDATE permissions SET name = ?, description = ?, resource = ?, action = ?, updated_at = NOW() WHERE id = ?"
	_, err := p.db.Exec(query, name, description, resource, action, id)
	if err != nil {
		return nil, err
	}

	return &models.Permission{
		Id:          id,
		Name:        name,
		Description: description,
		Resource:    resource,
		Action:      action,
		CreatedAt:   "", // Will be set by the database
		UpdatedAt:   "", // Will be set by the database
	}, nil
}
