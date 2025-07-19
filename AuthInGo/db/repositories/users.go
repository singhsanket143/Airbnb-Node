package db

import (
	"AuthInGo/models"
	"AuthInGo/utils"
	"database/sql"
	"fmt"
	"net/http"
)

type UserRepository interface {
	GetByID() (*models.User, error)
	Create(username string, email string, hashedPassword string) error
	GetByEmail(email string) (*models.User, error)
	GetAll() ([]*models.User, error)
	DeleteByID(id int64) error
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}

func (u *UserRepositoryImpl) GetAll() ([]*models.User, error) {
	return nil, nil
}

func (u *UserRepositoryImpl) DeleteByID(id int64) error {
	return nil
}

func (u *UserRepositoryImpl) GetByEmail(email string) (*models.User, error) {
	query := "SELECT id, email, password FROM users WHERE email = ?"

	row := u.db.QueryRow(query, email)

	user := &models.User{}

	err := row.Scan(&user.Id, &user.Email, &user.Password) // hashed password

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given email")
			return nil, utils.NewStatusError(http.StatusBadRequest, fmt.Sprintf("User with provided email do not exist"), err)
		} else {
			fmt.Println("Error scanning user:", err)
			return nil, utils.NewStatusError(http.StatusInternalServerError, "Internal Server Error while scanning DB Fetched Record", err)
		}
	}

	return user, nil
}

func (u *UserRepositoryImpl) Create(username string, email string, hashedPassword string) error {
	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"

	result, err := u.db.Exec(query, username, email, hashedPassword)

	if err != nil {
		fmt.Println("Error inserting user:", err)
		return err
	}

	rowsAffected, rowErr := result.RowsAffected()

	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}

	if rowsAffected == 0 {
		fmt.Println("No rows were affected, user not created")
		return nil
	}

	fmt.Println("User created successfully, rows affected:", rowsAffected)

	return nil
}

func (u *UserRepositoryImpl) GetByID() (*models.User, error) {
	fmt.Println("Getching user in UserRepository")

	// Step 1: Prepare the query
	query := "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?"

	// Step 2: Execute the query
	row := u.db.QueryRow(query, 1)

	// Step 3: Process the result
	user := &models.User{}

	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given ID")
			return nil, err
		} else {
			fmt.Println("Error scanning user:", err)
			return nil, err
		}
	}

	// Step 4: Print the user details
	fmt.Println("User fetched successfully:", user)

	return user, nil
}
