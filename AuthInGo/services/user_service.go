package services

import (
	env "AuthInGo/config/env"
	db "AuthInGo/db/repositories"
	"AuthInGo/models"
	"AuthInGo/utils"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type UserService interface {
	GetUserById(id int64) (*models.User, error)
	GetAllUsers() ([]*models.User, error)
	CreateUser(userDTO *models.CreateUserDTO) error
	LoginUser(username string, password string) (string, error)
	DeleteUserById(id int64) error
}

type UserServiceImpl struct {
	userRepository db.UserRepository
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		userRepository: _userRepository,
	}
}

// * COMPLETED
func (u *UserServiceImpl) GetUserById(id int64) (*models.User, error) {
	fmt.Println("Fetching user in UserService")
	user, err := u.userRepository.GetByID(id)
	return user, err
}

func (u *UserServiceImpl) GetAllUsers() ([]*models.User, error) {
	fmt.Println("Fetching all users in UserService")
	users, err := u.userRepository.GetAll()
	return users, err
}

// * COMPLETED
func (u *UserServiceImpl) CreateUser(userDTO *models.CreateUserDTO) error {
	fmt.Println("Creating user in UserService")
	hashedPassword, err := utils.HashPassword(userDTO.Password)
	if err != nil {
		return err
	}
	err = u.userRepository.Create(
		userDTO.Username,
		userDTO.Email,
		hashedPassword,
	)
	return err
}

// * COMPLETED
func (u *UserServiceImpl) LoginUser(email string, password string) (string, error) {

	// Step 1. Make a repository call to get the user by email
	user, err := u.userRepository.GetByEmail(email)

	if err != nil {
		fmt.Println("Error fetching user by email:", err)
		return "", err
	}

	// Step 2. If user exists, or not. If not exists, return error
	if user == nil {
		fmt.Println("No user found with the given email")
		return "", fmt.Errorf("no user found with email: %s", email)
	}

	// Step 3. If user exists, check the password using utils.CheckPasswordHash
	isPasswordValid := utils.CheckPasswordHash(password, user.Password)

	if !isPasswordValid {
		fmt.Println("Password does not match")
		return "", nil
	}

	// Step 4. If password matches, print a JWT token, else return error saying password does not match
	payload := jwt.MapClaims{
		"email": user.Email,
		"id":    user.Id,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	tokenString, err := token.SignedString([]byte(env.GetString("JWT_SECRET", "TOKEN")))

	if err != nil {
		fmt.Println("Error signing token:", err)
		return "", err
	}

	fmt.Println("JWT Token:", tokenString)

	return tokenString, nil
}

func (u *UserServiceImpl) DeleteUserById(id int64) error {
	fmt.Println("Deleting user in UserService")
	err := u.userRepository.DeleteByID(id)
	return err
}