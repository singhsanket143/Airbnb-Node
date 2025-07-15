package controllers

import (
	"AuthInGo/services"
	"fmt"
	"net/http"
)

type UserController struct {
	UserService services.UserService
}

func NewUserController(_userService services.UserService) *UserController {
	return &UserController{
		UserService: _userService,
	}
}

func (uc *UserController) GetUserById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GetUserById called in UserController")
	uc.UserService.GetUserById()
	w.Write([]byte("User fetching endpoint done"))
}

func (uc *UserController) CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CreateUser called in UserController")
	uc.UserService.CreateUser()
	w.Write([]byte("User creation endpoint done"))
}

func (uc *UserController) LoginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("LoginUser called in UserController")
	uc.UserService.LoginUser()
	w.Write([]byte("User login endpoint done"))
}
