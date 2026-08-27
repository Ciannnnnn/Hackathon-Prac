const API_URL = "../server/api.php";

async function getUsers() {

    const response = await fetch(
        `${API_URL}?action=users`
    );

    return await response.json();
}

async function getStats() {

    const response = await fetch(
        `${API_URL}?action=stats`
    );

    return await response.json();
}

async function addUser(user) {

    const response = await fetch(
        `${API_URL}?action=add`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    return await response.json();
}

async function updateUser(user) {

    const response = await fetch(
        `${API_URL}?action=update`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    return await response.json();
}

async function deleteUser(id) {

    const response = await fetch(
        `${API_URL}?action=delete&id=${id}`,
        {
            method: "DELETE"
        }
    );

    return await response.json();
}