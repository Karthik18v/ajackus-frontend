let employeeList = JSON.parse(localStorage.getItem("employeeList")) || [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    department: "HR",
    role: "Manager",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Jones",
    email: "bob@example.com",
    department: "Engineering",
    role: "Developer",
  },
];

let currentDisplayCount = 10;

function saveToLocalStorage() {
  localStorage.setItem("employeeList", JSON.stringify(employeeList));
}

function renderEmployees(data = employeeList) {
  const container = document.getElementById("employeeList");
  if (!container) return;

  container.innerHTML = "";
  const limitedList = data.slice(0, currentDisplayCount);
  limitedList.forEach((emp) => {
    const div = document.createElement("div");
    div.className = "employee-card";
    div.innerHTML = `
      <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
      <p>${emp.email}</p>
      <p>${emp.department} - ${emp.role}</p>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function editEmployee(id) {
  const emp = employeeList.find((e) => e.id === id);
  if (emp) {
    localStorage.setItem("editEmployee", JSON.stringify(emp));
    window.location.href = "form.html";
  }
}

function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;
  employeeList = employeeList.filter((e) => e.id !== id);
  saveToLocalStorage();
  renderEmployees(employeeList);
}

document.addEventListener("DOMContentLoaded", () => {
  const isDashboard = document.getElementById("employeeList");

  if (isDashboard) {
    renderEmployees();

    document.getElementById("searchInput").addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase();
      const filtered = employeeList.filter(
        (e) =>
          e.firstName.toLowerCase().includes(val) ||
          e.lastName.toLowerCase().includes(val) ||
          e.email.toLowerCase().includes(val)
      );
      renderEmployees(filtered);
    });

    document.getElementById("sortSelect").addEventListener("change", (e) => {
      const key = e.target.value;
      employeeList.sort((a, b) =>
        a[key].toLowerCase().localeCompare(b[key].toLowerCase())
      );
      saveToLocalStorage();
      renderEmployees(employeeList);
    });

    document
      .getElementById("showNumberOfEmployees")
      .addEventListener("change", (e) => {
        currentDisplayCount = parseInt(e.target.value);
        renderEmployees();
      });

    document
      .getElementById("addEmployeeButton")
      .addEventListener("click", () => {
        localStorage.removeItem("editEmployee");
        window.location.href = "form.html";
      });
  }

  const form = document.getElementById("employeeForm");
  if (form) {
    const editData = localStorage.getItem("editEmployee");
    if (editData) {
      const emp = JSON.parse(editData);
      document.getElementById("formTitle").innerText = "Edit Employee";
      document.getElementById("submitBtn").innerText = "Update";
      document.getElementById("empId").value = emp.id;
      document.getElementById("firstName").value = emp.firstName;
      document.getElementById("lastName").value = emp.lastName;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("role").value = emp.role;
      localStorage.removeItem("editEmployee");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("empId").value;
      const newEmp = {
        id: id ? parseInt(id) : Date.now(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value,
        role: document.getElementById("role").value,
      };

      if (id) {
        const idx = employeeList.findIndex((e) => e.id == id);
        if (idx !== -1) employeeList[idx] = newEmp;
      } else {
        employeeList.push(newEmp);
      }

      saveToLocalStorage();
      alert("Employee saved successfully!");
      window.location.href = "dashboard.html";
    });
  }
});
