package main

import (
	"testing"
)

func TestIsPasswordValid(t *testing.T) {
	cases := []struct {
		password string
		valid    bool
	}{
		{"password", false},
		{"Password1", false},
		{"Password", false},
		{"Password1!", true},
		{"password1!", false},
		{"PASSWORD1!", false},
		{"Passw1!", false},
	}

	for _, c := range cases {
		if output := isPasswordValid(c.password); output != c.valid {
			t.Errorf("isPasswordValid(%q) == %v, expected %v", c.password, output, c.valid)
		}
	}
}

func TestValidateConfig(t *testing.T) {
	tests := []struct {
		name  string
		cfg   config
		valid bool
	}{
		{
			name: "ValidConfig",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					user:     "user",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: true,
		},
		{
			name: "MissingPort",
			cfg: config{
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					user:     "user",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingAllowedOrigin",
			cfg: config{
				port: "8080",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					user:     "user",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingDbConnHost",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					port:     "5432",
					user:     "user",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingDbConnPort",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					user:     "user",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingDbConnUser",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingDbConnPassword",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:    "localhost",
					port:    "5432",
					user:    "user",
					dbname:  "database",
					sslmode: "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingDbConnDbname",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					user:     "user",
					password: "password",
					sslmode:  "disable",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingDbConnSslmode",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					user:     "user",
					password: "password",
					dbname:   "database",
				},
				jwtSigningKey: []byte("secret"),
			},
			valid: false,
		},
		{
			name: "MissingJwtKey",
			cfg: config{
				port:          "8080",
				allowedOrigin: "http://example.com",
				dbConn: dbConfig{
					host:     "localhost",
					port:     "5432",
					user:     "user",
					password: "password",
					dbname:   "database",
					sslmode:  "disable",
				},
			},
			valid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validateConfig(&tt.cfg)
			if tt.valid && err != nil {
				t.Errorf("Expected valid configuration, but got error: %v", err)
			}
			if !tt.valid && err == nil {
				t.Errorf("Expected invalid configuration, but got no error")
			}
		})
	}
}
