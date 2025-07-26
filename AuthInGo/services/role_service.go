package services

import (
	repositories "AuthInGo/db/repositories"
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type RoleService struct {
	roleRepo       *repositories.RoleRepository
	permissionRepo *repositories.PermissionRepository
}

func NewRoleService(db *sql.DB) *RoleService {
	return &RoleService{
		roleRepo:       repositories.NewRoleRepository(db),
		permissionRepo: repositories.NewPermissionRepository(db),
	}
}

func (s *RoleService) GetRoleById(id int64) (*models.Role, error) {
	return s.roleRepo.GetRoleById(id)
}

func (s *RoleService) GetRoleByName(name string) (*models.Role, error) {
	return s.roleRepo.GetRoleByName(name)
}

func (s *RoleService) GetAllRoles() ([]models.Role, error) {
	return s.roleRepo.GetAllRoles()
}

func (s *RoleService) CreateRole(role *models.Role) error {
	return s.roleRepo.CreateRole(role)
}

func (s *RoleService) UpdateRole(role *models.Role) error {
	return s.roleRepo.UpdateRole(role)
}

func (s *RoleService) DeleteRole(id int64) error {
	return s.roleRepo.DeleteRole(id)
}

func (s *RoleService) GetRolePermissions(roleId int64) ([]models.Permission, error) {
	return s.permissionRepo.GetPermissionsByRoleId(roleId)
}

func (s *RoleService) AssignPermissionToRole(roleId, permissionId int64) error {
	// This would need to be implemented in the repository
	// For now, we'll return an error indicating it's not implemented
	return fmt.Errorf("assign permission to role not implemented yet")
}

func (s *RoleService) RemovePermissionFromRole(roleId, permissionId int64) error {
	// This would need to be implemented in the repository
	// For now, we'll return an error indicating it's not implemented
	return fmt.Errorf("remove permission from role not implemented yet")
}
