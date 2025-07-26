-- +goose Up
-- +goose StatementBegin
CREATE TABLE role_permissions (
 id SERIAL PRIMARY KEY,
 role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
 permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(role_id, permission_id)
);

-- Assign permissions to admin role (all permissions)
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Assign basic permissions to user role
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE name IN ('user:read');

-- Assign moderate permissions to moderator role
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions WHERE name IN ('user:read', 'user:write', 'role:read');

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE role_permissions;
-- +goose StatementEnd 