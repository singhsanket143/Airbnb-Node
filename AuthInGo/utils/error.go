package utils

import "fmt"

type StatusError struct {
	errorCode   int
	errorMsg    string
	originalErr error // wraps the original error if needed
}

func (e *StatusError) Error() string {
	if e.originalErr != nil {
		return fmt.Sprintf("%s: %s", e.errorMsg, e.originalErr.Error())
	}
	return e.errorMsg
}
func (e *StatusError) ErrorCode() int {
	return e.errorCode
}
func (e *StatusError) OriginalErr() error {
	return e.originalErr
}

// constructor for StatusError
func NewStatusError(code int, message string, originalErr error) *StatusError {
	return &StatusError{
		errorCode:   code,
		errorMsg:    message,
		originalErr: originalErr,
	}
}

// ExtractStatusError extracts the StatusError from an error if it is of type StatusError
func ExtractStatusError(err error) (*StatusError, bool) {
	e, extracted := err.(*StatusError)
	return e, extracted
}
