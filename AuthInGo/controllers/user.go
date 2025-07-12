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

func (uc *UserController) RegisterUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("RegisterUser called in UserController")
	uc.UserService.CreateUser()
	w.Write([]byte("User registration endpoint"))
}
