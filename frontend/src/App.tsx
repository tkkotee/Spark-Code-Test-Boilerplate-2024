import React, { useEffect, useState } from 'react';
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
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, [reload]);

  // Add todo to database and then reload todoList from server.
  const addTodo = async (event: any) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:8080/todo`, {
        title: title,
        description: description
      });
      setReload(reload => !reload);
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
        <button type="submit" disabled={title==="" || description===""}>Add Todo</button>
      </form>
    </div>
  );
}

export default App;
