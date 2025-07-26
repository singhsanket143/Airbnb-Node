package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type PermissionRepository struct {
	db *sql.DB
}

func NewPermissionRepository(db *sql.DB) *PermissionRepository {
	return &PermissionRepository{db: db}
}

func (p *PermissionRepository) GetPermissionById(id int64) (*models.Permission, error) {
	query := `SELECT id, name, description, resource, action, created_at, updated_at FROM permissions WHERE id = $1`
	permission := &models.Permission{}
	err := p.db.QueryRow(query, id).Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return permission, nil
}

func (p *PermissionRepository) GetPermissionByName(name string) (*models.Permission, error) {
	query := `SELECT id, name, description, resource, action, created_at, updated_at FROM permissions WHERE name = $1`
	permission := &models.Permission{}
	err := p.db.QueryRow(query, name).Scan(&permission.Id, &permission.Name, &permission.Description, &permission.Resource, &permission.Action, &permission.CreatedAt, &permission.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return permission, nil
}

func (p *PermissionRepository) GetPermissionsByRoleId(roleId int64) ([]models.Permission, error) {
	query := `
		SELECT p.id, p.name, p.description, p.resource, p.action, p.created_at, p.updated_at 
		FROM permissions p 
		JOIN role_permissions rp ON p.id = rp.permission_id 
		WHERE rp.role_id = $1
	`
	rows, err := p.db.Query(query, roleId)
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

func (p *PermissionRepository) GetAllPermissions() ([]models.Permission, error) {
	query := `SELECT id, name, description, resource, action, created_at, updated_at FROM permissions ORDER BY id`
	rows, err := p.db.Query(query)
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

func (p *PermissionRepository) CreatePermission(permission *models.Permission) error {
	query := `INSERT INTO permissions (name, description, resource, action) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at`
	return p.db.QueryRow(query, permission.Name, permission.Description, permission.Resource, permission.Action).Scan(&permission.Id, &permission.CreatedAt, &permission.UpdatedAt)
}

func (p *PermissionRepository) UpdatePermission(permission *models.Permission) error {
	query := `UPDATE permissions SET name = $1, description = $2, resource = $3, action = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING updated_at`
	return p.db.QueryRow(query, permission.Name, permission.Description, permission.Resource, permission.Action, permission.Id).Scan(&permission.UpdatedAt)
}

func (p *PermissionRepository) DeletePermission(id int64) error {
	query := `DELETE FROM permissions WHERE id = $1`
	result, err := p.db.Exec(query, id)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("permission with id %d not found", id)
	}
	return nil
}
