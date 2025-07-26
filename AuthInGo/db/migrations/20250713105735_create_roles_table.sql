-- +goose Up
-- +goose StatementBegin
CREATE TABLE roles (
 id SERIAL PRIMARY KEY,
 name VARCHAR(255) NOT NULL UNIQUE,
 description TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrator with full access'),
('user', 'Regular user with limited access'),
('moderator', 'Moderator with moderate access');

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE roles;
-- +goose StatementEnd 