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
