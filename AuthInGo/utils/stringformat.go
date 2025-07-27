package utils

import (
	"fmt"
	"strings"
)

func FormatRoles(roles []string) string {
	var output []string
	for _, role := range roles {
		output = append(output, fmt.Sprintf("\"%s\"", role))
	}
	return strings.Join(output, ",")
}
