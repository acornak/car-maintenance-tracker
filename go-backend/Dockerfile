# Dockerfile

# Start from the latest golang base image
FROM golang:latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
COPY ./cmd/api/.envrc ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Run tests
RUN go test -race ./...

# Build the Go app
RUN CGO_ENABLED=0 go build -o main ./cmd/api/

CMD ["./main"]
