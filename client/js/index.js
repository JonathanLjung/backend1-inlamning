document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const response = await fetch("http://localhost:5050/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        });
  
        if (response.ok) {
          window.location.href = "http://localhost:5500/client/html/dashboard.html";
        } else if (response.status === 400) {
          const { error } = await response.json();
          alert(error);
        } else {
          alert("Fel användarnamn eller lösenord");
        }
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const response = await fetch("http://localhost:5050/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        });
    
        if (response.ok) {
          alert("Registrerad!");
        } else if (response.status === 400) {
          const { error } = await response.json();
          alert(error);
        } else if (response.status === 409) {
          const { error } = await response.json();
          alert(error);
        } else {
          alert("Något gick fel, försök igen senare.");
        }
      });
    }
  });