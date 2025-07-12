package db

type Storage struct { // facilitates dependency injection for repository
	UserRepository UserRepository
}

func NewStorage() *Storage {
	return &Storage{
		UserRepository: &UserRepositoryImpl{},
	}
}
