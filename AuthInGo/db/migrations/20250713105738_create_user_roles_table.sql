-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_roles (
 id SERIAL PRIMARY KEY,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(user_id, role_id)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE user_roles;
-- +goose StatementEnd 