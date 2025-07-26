# Role-Based Access Control (RBAC) Implementation

This document describes the RBAC implementation in the AuthInGo service.

## Overview

The RBAC system provides fine-grained access control based on roles and permissions. Users are assigned roles, and roles are assigned permissions. This creates a flexible and scalable authorization system.

## Database Schema

### Tables

1. **roles** - Defines available roles
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR(255) UNIQUE)
   - `description` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **permissions** - Defines available permissions
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR(255) UNIQUE)
   - `description` (TEXT)
   - `resource` (VARCHAR(255)) - The resource being accessed
   - `action` (VARCHAR(255)) - The action being performed
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **role_permissions** - Junction table linking roles to permissions
   - `id` (SERIAL PRIMARY KEY)
   - `role_id` (INTEGER REFERENCES roles(id))
   - `permission_id` (INTEGER REFERENCES permissions(id))
   - `created_at` (TIMESTAMP)

4. **user_roles** - Junction table linking users to roles
   - `id` (SERIAL PRIMARY KEY)
   - `user_id` (INTEGER REFERENCES users(id))
   - `role_id` (INTEGER REFERENCES roles(id))
   - `created_at` (TIMESTAMP)

## Default Roles and Permissions

### Roles
- **admin** (ID: 1) - Administrator with full access
- **user** (ID: 2) - Regular user with limited access
- **moderator** (ID: 3) - Moderator with moderate access

### Permissions
- `user:read` - Read user information
- `user:write` - Create and update users
- `user:delete` - Delete users
- `role:read` - Read role information
- `role:write` - Create and update roles
- `role:delete` - Delete roles
- `permission:read` - Read permission information
- `permission:write` - Create and update permissions
- `permission:delete` - Delete permissions

### Default Role-Permission Assignments
- **admin**: All permissions
- **user**: `user:read` only
- **moderator**: `user:read`, `user:write`, `role:read`

## API Endpoints

### Role Management (Admin only)
- `GET /roles` - Get all roles
- `GET /roles/{id}` - Get role by ID
- `POST /roles` - Create new role
- `PUT /roles/{id}` - Update role
- `DELETE /roles/{id}` - Delete role
- `GET /roles/{id}/permissions` - Get permissions for a role

### User Endpoints
- `GET /profile` - Get user profile (authenticated users)
- `POST /signup` - Create new user (automatically assigned "user" role)
- `POST /login` - User login

## Middleware

### Authentication Middleware
- `JWTAuthMiddleware` - Validates JWT tokens and extracts user information

### Authorization Middleware
- `RequireRole(roleName)` - Requires a specific role
- `RequirePermission(resource, action)` - Requires a specific permission
- `RequireAnyRole(roleNames...)` - Requires any of the specified roles
- `RequireAllRoles(roleNames...)` - Requires all of the specified roles

## Usage Examples

### Protecting Routes with Roles
```go
// Require admin role
r.With(middlewares.JWTAuthMiddleware, middlewares.RequireRole("admin")).Group(func(r chi.Router) {
    r.Get("/admin/users", adminController.GetAllUsers)
})

// Require any of multiple roles
r.With(middlewares.JWTAuthMiddleware, middlewares.RequireAnyRole("admin", "moderator")).Group(func(r chi.Router) {
    r.Get("/moderate", moderatorController.GetModerationPanel)
})
```

### Protecting Routes with Permissions
```go
// Require specific permission
r.With(middlewares.JWTAuthMiddleware, middlewares.RequirePermission("user", "delete")).Group(func(r chi.Router) {
    r.Delete("/users/{id}", userController.DeleteUser)
})
```

## Utilities

### RBACUtils
The `RBACUtils` struct provides helper functions for RBAC operations:

```go
rbacUtils := utils.NewRBACUtils(db)

// Check if user has role
hasRole, err := rbacUtils.HasRole("123", "admin")

// Check if user has permission
hasPermission, err := rbacUtils.HasPermission("123", "user", "delete")

// Get user roles
roles, err := rbacUtils.GetUserRoles("123")

// Get user permissions
permissions, err := rbacUtils.GetUserPermissions("123")

// Assign role to user
err := rbacUtils.AssignRoleToUser("123", 1) // Assign admin role

// Remove role from user
err := rbacUtils.RemoveRoleFromUser("123", 1) // Remove admin role
```

## User Registration

When a new user is created via the signup endpoint, they are automatically assigned the "user" role (ID: 2). This provides basic access while maintaining security.

## Security Considerations

1. **Role Hierarchy**: The system supports role hierarchies through permission assignments
2. **Least Privilege**: Users start with minimal permissions and are granted additional access as needed
3. **Audit Trail**: All role and permission changes are logged with timestamps
4. **JWT Integration**: RBAC checks are performed after JWT authentication
5. **Database Constraints**: Foreign key constraints ensure data integrity

## Migration

To set up the RBAC system, run the database migrations in order:

1. `20250713105735_create_roles_table.sql`
2. `20250713105736_create_permissions_table.sql`
3. `20250713105737_create_role_permissions_table.sql`
4. `20250713105738_create_user_roles_table.sql`

## Testing

Test the RBAC system by:

1. Creating users with different roles
2. Testing protected endpoints with different user roles
3. Verifying permission-based access control
4. Testing role assignment and removal

## Future Enhancements

1. **Dynamic Role Assignment**: Allow users to request role changes
2. **Permission Groups**: Group related permissions for easier management
3. **Temporary Permissions**: Time-limited permission grants
4. **Audit Logging**: Detailed logging of all authorization decisions
5. **Role Inheritance**: Support for role hierarchies and inheritance 