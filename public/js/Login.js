const login = async () => {
  const form = document.querySelector("#loginForm");
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const messageDiv = document.querySelector("#message");
  const currentUserDiv = document.querySelector("#currentUser");

  if (username === "" || password === "") {
    messageDiv.innerHTML = "Please enter Username and Password";
    setTimeout(() => {
      messageDiv.innerHTML = "";
    }, 5000);
    return;
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.data.token) {
      messageDiv.innerHTML = "✅ Login successful";

      if (!document.querySelector("#logoutBtn")) {
        const logoutBtn = document.createElement("button");
        logoutBtn.id = "logoutBtn";
        logoutBtn.textContent = "Logout";
        logoutBtn.onclick = logout;
        document.querySelector("body").prepend(logoutBtn);
      }

      currentUserDiv.innerHTML = `Logged in as ${username}: ${data.data.user.role}`;
      localStorage.setItem("token", data.data.token);
      form.reset();

      setTimeout(() => {
        messageDiv.innerHTML = "";
      }, 5000);
    } else {
      messageDiv.innerHTML = "❌ Invalid username or password";
      setTimeout(() => {
        messageDiv.innerHTML = "";
      }, 5000);
    }
  } catch (error) {
    messageDiv.innerHTML = `❌ ${error}`;
    setTimeout(() => {
      messageDiv.innerHTML = "";
    }, 5000);
  }
};

const register = async () => {
  const username = document.querySelector("#newUsername").value;
  const password = document.querySelector("#newPassword").value;
  const email = document.querySelector("#newEmail").value;
  const registerMsg = document.querySelector("#registerMessage");

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email })
    });
    const data = await res.json();

    if (res.ok) {
      registerMsg.innerHTML = "✅ User created successfully!";
    } else {
      registerMsg.innerHTML = "❌ " + data.message;
    }
  } catch (err) {
    registerMsg.innerHTML = "❌ Error: " + err.message;
  }
};
