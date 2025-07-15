package services

import (
	db "AuthInGo/db/repositories"
	"AuthInGo/utils"
	"fmt"
)

type UserService interface {
	GetUserById() error
	CreateUser() error
	LoginUser() error
}

type UserServiceImpl struct {
	userRepository db.UserRepository
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		userRepository: _userRepository,
	}
}

func (u *UserServiceImpl) GetUserById() error {
	fmt.Println("Fetching user in UserService")
	u.userRepository.GetByID()
	return nil
}

func (u *UserServiceImpl) CreateUser() error {
	fmt.Println("Creating user in UserService")
	password := "example_password"
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return err
	}
	u.userRepository.Create(
		"username_example_1",
		"user1@example.com",
		hashedPassword,
	)
	return nil
}

func (u *UserServiceImpl) LoginUser() error {
	// Pre-requisite: This function will be given email and password as parameter, which we can hardcode for now

	// Step 1. Make a repository call to get the user by email

	// Step 2. If user exists, or not. If not exists, return error

	// Step 3. If user exists, check the password using utils.CheckPasswordHash

	// Step 4. If password matches, print a JWT token, else return error saying password does not match

	return nil
}
