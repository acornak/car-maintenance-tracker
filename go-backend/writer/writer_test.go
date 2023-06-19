package writer

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWriteJson(t *testing.T) {
	data := map[string]string{"message": "ok"}
	_, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	jw := &JsonWriter{}

	err = jw.WriteJson(rr, http.StatusOK, data, "")

	assert.NoError(t, err)
	assert.Equal(t, rr.Code, http.StatusOK)
	assert.Equal(t, rr.Body.String(), `{"message":"ok"}`)
}

func TestErrorJson(t *testing.T) {
	_, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	jw := &JsonWriter{}

	jw.ErrorJson(rr, http.ErrBodyNotAllowed)

	assert.NoError(t, err)
	assert.Equal(t, rr.Code, http.StatusBadRequest)
	assert.Equal(t, rr.Body.String(), `{"error":{"message":"http: request method or response status code does not allow body"}}`)
}
