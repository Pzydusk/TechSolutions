const apiBase = "https://localhost:7045";

async function apiFetch(path, options = {}) {
    const token = sessionStorage.getItem("jwt");

    options.headers = options.headers || {};
    if (options.body && !options.headers["Content-Type"]) {
        options.headers["Content-Type"] = "application/json";
    }
    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(apiBase + path, options);

    if (res.status === 401) {
        window.location.href = "/Account/Login";
        return null;
    }

    return res;
}