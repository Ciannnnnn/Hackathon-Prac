const profileForm = document.getElementById("profileForm");
const sessionUser = JSON.parse(localStorage.getItem("currentUser") || "null");

if (!sessionUser) {
    window.location.href = "index.html";
    throw new Error("No user session");
}

const userId = Number(new URLSearchParams(window.location.search).get("id")) || sessionUser.id;

if (sessionUser.role !== "Administrator" && sessionUser.id !== userId) {
    window.location.href = "dashboard.html";
    throw new Error("Unauthorized profile access");
}

document.getElementById("userId").value = userId;

async function loadProfile() {
    const users = await getUsers();
    const user = users.find(item => item.id === userId);

    if (!user) {
        showToast("User profile could not be found");
        profileForm.querySelector("button[type='submit']").disabled = true;
        return;
    }

    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("role").value = user.role;
    document.getElementById("status").value = user.status;
    document.getElementById("profileAvatar").textContent =
        user.name.charAt(0).toUpperCase();
}

profileForm.addEventListener("submit", async event => {
    event.preventDefault();

    const response = await updateUser({
        id: userId,
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim()
    });

    if (!response.success) {
        showToast(response.message || "Unable to update profile");
        return;
    }

    document.getElementById("profileAvatar").textContent =
        response.user.name.charAt(0).toUpperCase();
    showToast("Profile updated successfully");
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

loadProfile();
