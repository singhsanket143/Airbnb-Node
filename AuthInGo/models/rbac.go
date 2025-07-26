package models

type Role struct {
	Id          int64
	Name        string
	Description string
	CreatedAt   string
	UpdatedAt   string
}

type Permission struct {
	Id          int64
	Name        string
	Description string
	Resource    string
	Action      string
	CreatedAt   string
	UpdatedAt   string
}

type RolePermission struct {
	Id           int64
	RoleId       int64
	PermissionId int64
	CreatedAt    string
	UpdatedAt    string
}
