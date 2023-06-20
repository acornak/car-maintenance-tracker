package writer

import (
	"encoding/json"
	"net/http"
)

type JsonWriter struct{}

func (jw *JsonWriter) WriteJson(w http.ResponseWriter, status int, data interface{}, wrap string) error {
	if wrap != "" {
		wrapper := make(map[string]interface{})
		wrapper[wrap] = data
		data = wrapper
	}

	js, err := json.Marshal(data)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func (jw *JsonWriter) ErrorJson(w http.ResponseWriter, err error, status ...int) {
	statusCode := http.StatusBadRequest
	if len(status) > 0 {
		statusCode = status[0]
	}

	type jsonError struct {
		Message string `json:"message"`
	}

	theErr := jsonError{
		Message: err.Error(),
	}

	jw.WriteJson(w, statusCode, theErr, "error")
}
