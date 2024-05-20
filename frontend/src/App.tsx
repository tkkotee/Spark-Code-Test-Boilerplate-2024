import React, { FormEvent, useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  // State variable to trigger reload of todos
  const [reload, setReload] = useState(false);
  // Current todo title
  const [title, setTitle] = useState("");
  // Current todo description
  const [description, setDescription] = useState("");
  // Handle input change
  function handleTitleChange(e: any) {
    setTitle(e.target.value);
  }
  function handleDescriptionChange(e: any) {
    setDescription(e.target.value);
  }

  // fetch todo upon app initialisation and subsequent reload requests
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/todo');
        if (todos.status !== 200) {
          throw new Error("Error getting todos");
        }
        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, [reload]);

  // Add todo to database
  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    // Prevent default submission behaviour
    event.preventDefault();
    try {
      // Post request to server
      const response = await fetch('http://localhost:8080/todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: title, description: description})
        });
      if (response.status === 400) {
        alert("Error: Either title or description is empty")
      }
      if (response.status !== 200) {
        throw new Error("Error adding todo")
      }
      // Make request to reload the todo list and reset form fields
      setReload(reload => !reload);
      setTitle("");
      setDescription("");
    } catch (e) {
      console.log(e);
    } 
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={addTodo}>
        <input placeholder="Title" name="title" autoFocus={true} value={title} onChange={handleTitleChange}/>
        <input placeholder="Description" name="description" value={description} onChange={handleDescriptionChange}/>
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
