window.App = (() => {
    const API_BASE = "https://localhost:7045";
    const TOKEN_KEY = "token";

    function token() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function authHeaders() {
        const t = token();
        return t ? { "Authorization": `Bearer ${t}` } : {};
    }

    function showMsg(id, text, isError = false) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = text;
        el.style.color = isError ? "red" : "green";
    }

    async function postJson(url, body, extraHeaders = {}) {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...extraHeaders
            },
            body: JSON.stringify(body)
        });
        return res;
    }

    // -------------------------
    // Login Page
    // -------------------------
    function initLoginPage() {
        const registerForm = document.getElementById("registerForm");
        const loginForm = document.getElementById("loginForm");

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            showMsg("msg", "");

            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;

            const res = await postJson(`${API_BASE}/api/auth/register`, { email, password });

            if (res.ok) {
                showMsg("msg", "Registered. Now login.");
            } else {
                const txt = await res.text();
                showMsg("msg", txt || "Register failed", true);
            }
        });

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            showMsg("msg", "");

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            const res = await postJson(`${API_BASE}/api/auth/login`, { email, password });

            if (res.ok) {
                const data = await res.json(); // { token: "..." }
                localStorage.setItem(TOKEN_KEY, data.token);
                window.location.href = "/index.html";
            } else {
                const txt = await res.text();
                showMsg("msg", txt || "Login failed", true);
            }
        });
    }

    // -------------------------
    // Customers Page Helpers
    // -------------------------
    function getCustomerId(c) {
        return c.id ?? c.customerId;
    }

    async function loadCustomers() {
        const res = await fetch(`${API_BASE}/api/customers`, {
            headers: { ...authHeaders() }
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login.html";
            return;
        }

        if (!res.ok) {
            const txt = await res.text();
            showMsg("msg", txt || "Failed to load customers", true);
            return;
        }

        const customers = await res.json();
        const rows = document.getElementById("rows");
        rows.innerHTML = "";

        customers.forEach(c => {
            const tr = document.createElement("tr");
            const id = getCustomerId(c);

            tr.innerHTML = `
        <td>${c.firstName}</td>
        <td>${c.lastName}</td>
        <td>${c.email}</td>
        <td>${c.phone ?? ""}</td>
        <td>${new Date(c.dateLastUpdated).toLocaleString()}</td>
        <td>
          <button class="edit" data-id="${id}">Edit</button>
          <button class="del" data-id="${id}">Delete</button>
        </td>
      `;

            rows.appendChild(tr);
        });

        document.querySelectorAll(".del").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await deleteCustomer(id);
            });
        });

        document.querySelectorAll(".edit").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await startEdit(id);
            });
        });
    }

    async function createCustomer(payload) {
        const res = await fetch(`${API_BASE}/api/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login.html";
            return false;
        }

        if (res.ok) {
            showMsg("msg", "Customer added.");
            return true;
        }

        const txt = await res.text();
        showMsg("msg", txt || "Create failed", true);
        return false;
    }

    async function updateCustomer(id, payload) {
        const res = await fetch(`${API_BASE}/api/customers/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login.html";
            return { ok: false };
        }

        if (res.status === 409) {
            const txt = await res.text();
            showMsg("msg", txt || "Concurrency conflict. Reload and try again.", true);
            return { ok: false };
        }

        if (!res.ok) {
            const txt = await res.text();
            showMsg("msg", txt || "Update failed", true);
            return { ok: false };
        }

        showMsg("msg", "Customer updated.");
        return { ok: true };
    }

    async function deleteCustomer(id) {
        const res = await fetch(`${API_BASE}/api/customers/${id}`, {
            method: "DELETE",
            headers: { ...authHeaders() }
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login.html";
            return;
        }

        if (res.ok) {
            showMsg("msg", "Deleted.");
            await loadCustomers();
            return;
        }

        const txt = await res.text();
        showMsg("msg", txt || "Delete failed", true);
    }

    // -------------------------
    // Edit Mode + Concurrency
    // -------------------------
    async function startEdit(id) {
        showMsg("msg", "");

        const res = await fetch(`${API_BASE}/api/customers/${id}`, {
            headers: { ...authHeaders() }
        });

        if (res.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login.html";
            return;
        }

        if (!res.ok) {
            const txt = await res.text();
            showMsg("msg", txt || "Failed to load customer", true);
            return;
        }

        const c = await res.json();

        document.getElementById("editId").value = getCustomerId(c);

        // RowVersion arrives as byte[] => JSON array of numbers. Store as JSON string.
        document.getElementById("editRowVersion").value = JSON.stringify(c.rowVersion ?? []);

        document.getElementById("firstName").value = c.firstName ?? "";
        document.getElementById("lastName").value = c.lastName ?? "";
        document.getElementById("email").value = c.email ?? "";
        document.getElementById("phone").value = c.phone ?? "";

        document.getElementById("formTitle").textContent = "Edit Customer";
        document.getElementById("saveBtn").textContent = "Save";
        document.getElementById("cancelBtn").style.display = "inline-block";
    }

    function cancelEdit() {
        document.getElementById("editId").value = "";
        document.getElementById("editRowVersion").value = "";
        document.getElementById("customerForm").reset();

        document.getElementById("formTitle").textContent = "Add Customer";
        document.getElementById("saveBtn").textContent = "Add";
        document.getElementById("cancelBtn").style.display = "none";
    }

    // -------------------------
    // Customers Page Init
    // -------------------------
    function initCustomersPage() {
        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/login.html";
        });

        document.getElementById("cancelBtn").addEventListener("click", cancelEdit);

        document.getElementById("customerForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            showMsg("msg", "");

            const editId = document.getElementById("editId").value.trim();
            const rowVersionJson = document.getElementById("editRowVersion").value;

            const basePayload = {
                firstName: document.getElementById("firstName").value.trim(),
                lastName: document.getElementById("lastName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim() || null
            };

            if (editId) {
                const rowVersion = rowVersionJson ? JSON.parse(rowVersionJson) : [];

                const payload = {
                    ...basePayload,
                    rowVersion
                };

                const result = await updateCustomer(editId, payload);
                if (result.ok) {
                    cancelEdit();
                    await loadCustomers();
                }
            } else {
                const ok = await createCustomer(basePayload);
                if (ok) {
                    e.target.reset();
                    await loadCustomers();
                }
            }
        });

        loadCustomers();
    }

    return { initLoginPage, initCustomersPage };
})();