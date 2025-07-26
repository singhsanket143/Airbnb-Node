package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type RoleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

func (r *RoleRepository) GetRoleById(id int64) (*models.Role, error) {
	query := `SELECT id, name, description, created_at, updated_at FROM roles WHERE id = $1`
	role := &models.Role{}
	err := r.db.QueryRow(query, id).Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func (r *RoleRepository) GetRoleByName(name string) (*models.Role, error) {
	query := `SELECT id, name, description, created_at, updated_at FROM roles WHERE name = $1`
	role := &models.Role{}
	err := r.db.QueryRow(query, name).Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func (r *RoleRepository) GetAllRoles() ([]models.Role, error) {
	query := `SELECT id, name, description, created_at, updated_at FROM roles ORDER BY id`
	rows, err := r.db.Query(query)
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

func (r *RoleRepository) CreateRole(role *models.Role) error {
	query := `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query, role.Name, role.Description).Scan(&role.Id, &role.CreatedAt, &role.UpdatedAt)
}

func (r *RoleRepository) UpdateRole(role *models.Role) error {
	query := `UPDATE roles SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING updated_at`
	return r.db.QueryRow(query, role.Name, role.Description, role.Id).Scan(&role.UpdatedAt)
}

func (r *RoleRepository) DeleteRole(id int64) error {
	query := `DELETE FROM roles WHERE id = $1`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("role with id %d not found", id)
	}
	return nil
}
