const profileForm = document.getElementById("profileForm");
const requestedUserId = new URLSearchParams(window.location.search).get("id");
const userId = Number(requestedUserId);
const hasValidUserId =
    requestedUserId !== null &&
    requestedUserId.trim() !== "" &&
    Number.isInteger(userId) &&
    userId > 0;

document.getElementById("userId").value = hasValidUserId ? userId : "";

async function loadProfile() {
    if (!hasValidUserId) {
        showProfileError("Choose a valid user profile to update");
        return;
    }

    const users = await getUsers();
    const user = users.find(item => item.id === userId);

    if (!user) {
        showProfileError("User profile could not be found");
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

    if (!hasValidUserId) {
        showProfileError("Choose a valid user profile to update");
        return;
    }

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

function showProfileError(message) {
    profileForm.querySelector("button[type='submit']").disabled = true;
    showToast(message);
}

loadProfile();
