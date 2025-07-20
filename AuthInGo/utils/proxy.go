package utils

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

func ProxyToService(targetBaseUrl string, pathPrefix string) http.HandlerFunc {

	target, err := url.Parse(targetBaseUrl)

	if err != nil {
		fmt.Println("Error parsing target URL:", err)
		return nil
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	originalDirector := proxy.Director

	proxy.Director = func(r *http.Request) {
		originalDirector(r)

		originalPath := r.URL.Path

		strippedPath := strings.TrimPrefix(originalPath, pathPrefix)

		r.URL.Host = target.Host
		r.URL.Path = target.Path + strippedPath

		r.Host = target.Host

		if userId, ok := r.Context().Value("userID").(string); ok {
			r.Header.Set("X-User-ID", userId)
		}

	}

	return proxy.ServeHTTP

}
