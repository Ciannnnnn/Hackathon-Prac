const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.getElementById("sidebar");

function getCurrentUser() {

    try {
        return JSON.parse(
            localStorage.getItem("currentUser") || "null"
        );
    } catch (error) {
        return null;
    }

}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem("currentUser");
}

function updateProfileSidebar() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    document.querySelectorAll(".profile-link").forEach(link => {

        const nameElement = link.querySelector("strong");
        const avatarElement = link.querySelector(".avatar");

        if (nameElement) {
            nameElement.textContent = currentUser.name;
        }

        if (avatarElement) {
            avatarElement.textContent = currentUser.name.charAt(0).toUpperCase();
        }

        link.setAttribute("href", "update.html");
    });

    const usersNavLink = document.querySelector('.nav-link[href="users.html"]');
    if (usersNavLink && currentUser.role !== "Administrator") {
        usersNavLink.style.display = "none";
    }

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", event => {
            event.preventDefault();
            clearCurrentUser();
            window.location.href = "index.html";
        });
    }

}

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle("open");

        }
    );

}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    const currentUser = getCurrentUser();

    if (currentUser) {
        window.location.href = "dashboard.html";
    }

    loginForm.addEventListener("submit", async event => {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const errorBox = document.getElementById("loginError");

        const response = await loginUser({ email, password });

        if (!response.success) {
            errorBox.textContent = response.message || "Login failed";
            return;
        }

        setCurrentUser(response.user);
        window.location.href = "dashboard.html";

    });

}

const currentPage = window.location.pathname.split("/").pop();

if (["dashboard.html", "users.html", "update.html"].includes(currentPage)) {

    const sessionUser = getCurrentUser();

    if (!sessionUser) {
        window.location.href = "index.html";
        return;
    }

    if (currentPage === "users.html" && sessionUser.role !== "Administrator") {
        window.location.href = "dashboard.html";
        return;
    }

    if (currentPage === "update.html" && sessionUser.role !== "Administrator" && sessionUser.id !== Number(new URLSearchParams(window.location.search).get("id") || sessionUser.id)) {
        window.location.href = "dashboard.html";
        return;
    }

    updateProfileSidebar();

}

if (document.getElementById("logoutButton")) {
    document.getElementById("logoutButton").addEventListener("click", event => {
        event.preventDefault();
        clearCurrentUser();
        window.location.href = "index.html";
    });
}