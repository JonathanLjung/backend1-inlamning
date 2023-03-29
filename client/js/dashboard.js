async function deleteTodo(todoId) {
  try {
    const response = await fetch(`http://localhost:5050/todos/${todoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      console.log("Todo deleted successfully");
      alert('Todo deleted successfully')
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
    } else if (response.status === 400) {
      const { error } = await response.json();
      alert(`Validation error: ${error}`);
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
        body: JSON.stringify({ isComplete: isComplete }),
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
    let response;
    try {
      response = await fetch("http://localhost:5050/todos", {
        method: "GET",
        credentials: "include",
      });
    } catch (e) {
      console.error(e.message);
    }
    if (error.message === "Error fetching todos" && response?.status === 401) {
      alert("You need to be logged in to get todos, please login");
    }
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
  completeButton.textContent = todo.complete
    ? "Uncheck done"
    : "Check as done";
  completeButton.className = "completeButton";
  completeButton.addEventListener("click", () =>
    toggleComplete(todo.id, !todo.complete)
  );

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "editButton";
  editButton.addEventListener("click", () => {
    const updatedTitle = prompt("Assign new title:", todo.title);
    const updatedDescription = prompt("Assign new description:", todo.description);

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
      } else if (response.status === 400) {
        const { error } = await response.json();
        alert(error);
      } else {
        console.log("User is not logged in");
        alert(
          "You must be logged in to post todos. Please login"
        );
      }
    });
  }
});
