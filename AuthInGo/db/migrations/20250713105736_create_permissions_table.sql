-- +goose Up
-- +goose StatementBegin
CREATE TABLE permissions (
 id SERIAL PRIMARY KEY,
 name VARCHAR(255) NOT NULL UNIQUE,
 description TEXT,
 resource VARCHAR(255) NOT NULL,
 action VARCHAR(255) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES 
('user:read', 'Read user information', 'user', 'read'),
('user:write', 'Create and update users', 'user', 'write'),
('user:delete', 'Delete users', 'user', 'delete'),
('role:read', 'Read role information', 'role', 'read'),
('role:write', 'Create and update roles', 'role', 'write'),
('role:delete', 'Delete roles', 'role', 'delete'),
('permission:read', 'Read permission information', 'permission', 'read'),
('permission:write', 'Create and update permissions', 'permission', 'write'),
('permission:delete', 'Delete permissions', 'permission', 'delete');

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE permissions;
-- +goose StatementEnd 