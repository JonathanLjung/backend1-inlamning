async function deleteTodo(todoId) {
  try {
    const response = await fetch(`http://localhost:5050/todos/${todoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      console.log("Todo deleted successfully");
      fetchAndDisplayTodos();
    } else {
      throw new Error("Error deleting todo");
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function editTodo(todoId, updatedData) {
  try {
    const response = await fetch(`http://localhost:5050/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
      credentials: "include",
    });

    if (response.ok) {
      console.log("Todo updated successfully");
      fetchAndDisplayTodos();
    } else {
      throw new Error("Error updating todo");
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function toggleComplete(todoId, isComplete) {
  try {
    const response = await fetch(
      `http://localhost:5050/todos/${todoId}/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isComplete }),
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Todo updated successfully");
      fetchAndDisplayTodos();
    } else {
      throw new Error("Error updating todo");
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchAndDisplayTodos() {
  try {
    const response = await fetch("http://localhost:5050/todos", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const todos = await response.json();
      displayTodos(todos);
    } else {
      throw new Error("Error fetching todos");
    }
  } catch (error) {
    console.error(error.message);
  }
}

function displayTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  for (const todo of todos) {
    const todoItem = createTodoItem(todo);
    todoList.appendChild(todoItem);
  }
}

function createTodoItem(todo) {
  const todoItem = document.createElement("div");
  todoItem.className = "todoItem";

  const title = document.createElement("h3");
title.textContent = todo.title;
title.className = "title";

const description = document.createElement("p");
description.textContent = todo.description;
description.className = "description";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.className = "deleteButton";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  const completeButton = document.createElement("button");
  completeButton.textContent = todo.complete ? "Avmarkera klar" : "Markera klar";
  completeButton.className = "completeButton";
  completeButton.addEventListener("click", () =>
    toggleComplete(todo.id, !todo.complete)
  );

  const editButton = document.createElement("button");
  editButton.textContent = "Redigera";
  editButton.className = "editButton";
  editButton.addEventListener("click", () => {
    const updatedTitle = prompt("Ange ny titel:", todo.title);
    const updatedDescription = prompt("Ange ny beskrivning:", todo.description);

    if (updatedTitle && updatedDescription) {
      editTodo(todo.id, {
        title: updatedTitle,
        description: updatedDescription,
      });
    }
  });

  todoItem.appendChild(title);
  todoItem.appendChild(description);
  todoItem.appendChild(deleteButton);
  todoItem.appendChild(editButton);
  todoItem.appendChild(completeButton);

  return todoItem;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayTodos();

  const todoForm = document.getElementById("todoForm");

  if (todoForm) {
    todoForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;

      const response = await fetch("http://localhost:5050/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Todo added succesfully");
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";

        fetchAndDisplayTodos();
      } else {
        console.log("Användaren är inte inloggad");
        alert("Du måste vara inloggad för att publicera todos. Vänligen logga in");
      }
    });
  }
});
