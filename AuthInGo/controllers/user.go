package controllers

import (
	"AuthInGo/models"
	"AuthInGo/services"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
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
	var id string = chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}
	intId, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	user, err := uc.UserService.GetUserById(int64(intId))
	if err != nil {
		http.Error(w, "Error fetching user", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "User not found"})
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data":    user,
		"success": true,
	})
}

func (uc *UserController) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	user, err := uc.UserService.GetAllUsers()
	if err != nil {
		http.Error(w, "Error fetching users", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "User not found"})
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data":    user,
		"success": true,
	})
}

func (uc *UserController) CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CreateUser called in UserController")
	var user models.CreateUserDTO
	json.NewDecoder(r.Body).Decode(&user)
	err := uc.UserService.CreateUser(&user)
	if err != nil {
		fmt.Println("Error creating user:", err)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": err == nil,
	})
}

func (uc *UserController) LoginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("LoginUser called in UserController")
	email, pass, ok := r.BasicAuth()
	if !ok {
		http.Error(w, "email (username) & password both should be provided", http.StatusUnauthorized)
		return
	}
	token, err := uc.UserService.LoginUser(email, pass)
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
	})
}

func (uc *UserController) DeleteUserById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("DeleteUserById called in UserController")
	var id string = chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}
	intId, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	err = uc.UserService.DeleteUserById(int64(intId))
	if err != nil {
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
