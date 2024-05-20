package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// structure for a todo item - title, description
type todo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// array of todo's as a todo list - in-memory
var todoList []todo

func main() {
	// Initialize to-do list
	todoList = []todo{
		{"Buy groceries", "Please ar"},
		{"Finish report", "please dog"},
	}
	// Register http endpoint at /todo
	http.HandleFunc("/todo", ToDoListHandler)
	// Start the server and listen on port 8080
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	// Setup CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Read http request method
	switch r.Method {
	// If "GET" request, get the current todo list
	case http.MethodGet:
		GetToDoList(w)
		// If "POST" request, add new todo to list
	case http.MethodPost:
		AddToDoItem(w, r)
		// Otherwise respond stating that method is not allowed.
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "Method %s not allowed", r.Method)
	}
}

func GetToDoList(w http.ResponseWriter) {
	// Encode to-do list as JSON and write to response
	jsonBytes, err := json.Marshal(todoList)
	// If there is an error when marshalling, write it to response
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error marshalling to-do list: %v", err)
		return
	}
	// Write response
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func AddToDoItem(w http.ResponseWriter, r *http.Request) {
	// Decode new item from JSON request body
	var newItem todo
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&newItem)
	// If there is an error when decoding, write it to response
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error decoding new to-do item: %v", err)
		return
	}
	if (newItem.Description == "" || newItem.Title == "") {
		w.WriteHeader(http.StatusBadRequest)
	}
	// Add new item to the list
	todoList = append(todoList, newItem)
	// Respond with success message
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "To-do item added successfully")
}
