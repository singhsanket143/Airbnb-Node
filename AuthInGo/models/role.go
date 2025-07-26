package models

type Role struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type Permission struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Resource    string `json:"resource"`
	Action      string `json:"action"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type RolePermission struct {
	Id           int64 `json:"id"`
	RoleId       int64 `json:"role_id"`
	PermissionId int64 `json:"permission_id"`
}

type UserRole struct {
	Id     int64 `json:"id"`
	UserId int64 `json:"user_id"`
	RoleId int64 `json:"role_id"`
}
