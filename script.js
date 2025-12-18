const CREATE_TASK_API = "https://8zy3h6gbq1.execute-api.eu-north-1.amazonaws.com/create";
const GET_TASKS_API = "https://oz89nr59p4.execute-api.eu-north-1.amazonaws.com/tasks";
const UPDATE_TASK_API = "https://28cc7ck2l0.execute-api.eu-north-1.amazonaws.com//task";

function getAuthCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

const authCode = getAuthCodeFromUrl();

if (authCode) {
  console.log("Auth code:", authCode);

  // Treat user as logged in
  document.getElementById("login-box").style.display = "none";
  document.getElementById("task-box").style.display = "block";
}

function login() {
  // For now just simulate login
  document.getElementById("login-box").style.display = "none";
  document.getElementById("task-box").style.display = "block";
}

async function createTask() {
  const taskName = document.getElementById("taskName").value;
  const desc = document.getElementById("desc").value;

  const response = await fetch("https://8zy3h6gbq1.execute-api.eu-north-1.amazonaws.com/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "user123",
      task_name: taskName,
      description: desc
    })
  });

  const data = await response.json();
  document.getElementById("msg").innerText = data.message;
}

async function getTasks() {
  const response = await fetch("https://oz89nr59p4.execute-api.eu-north-1.amazonaws.com/tasks");
  const data = await response.json();

  const container = document.getElementById("tasks-container");
  container.innerHTML = "";

  data.tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
  <div class="task-title">${task.task_name || "Untitled Task"}</div>
  <div class="task-desc">${task.description || "No description"}</div>

  <div class="task-footer">
    <span>${new Date(task.created_at).toLocaleString()}</span>
    <span class="status ${task.status === "Completed" ? "done" : ""}">
      ${task.status || "Pending"}
    </span>
  </div>

  ${
    task.status !== "Completed"
      ? `<button class="complete-btn" onclick="markTaskCompleted('${task.task_id}')">
           ✔ Mark Completed
         </button>`
      : ""
  }
`;

    container.appendChild(card);
  });
}

async function markTaskCompleted(taskId) {
  try {
    const response = await fetch(`${UPDATE_TASK_API}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "Completed"
      })
    });

    const data = await response.json();
    console.log("Updated:", data);

    // Refresh task list after update
    getTasks();
  } catch (err) {
    console.error("Error updating task:", err);
  }
}

const cognitoDomain = "https://eu-north-1bwykvi5v7.auth.eu-north-1.amazoncognito.com";
const clientId = "i2n0500tu74s8cb0sms6cekjd";
const redirectUri = "http://localhost:5500/frontend/index.html";

function login() {
  const loginUrl =
    `${cognitoDomain}/login?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=openid+email+profile`;

  window.location.href = loginUrl;
}
