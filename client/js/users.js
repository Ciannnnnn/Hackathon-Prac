let users = [];

const modal =
    document.getElementById("userModal");

const form =
    document.getElementById("userForm");

const table =
    document.getElementById("usersTable");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

document
    .getElementById("addUserButton")
    .addEventListener("click", () => {

        openModal();

    });

document
    .getElementById("closeModal")
    .addEventListener("click", () => {

        closeModal();

    });

document
    .getElementById("cancelButton")
    .addEventListener("click", () => {

        closeModal();

    });

form.addEventListener("submit", async event => {

    event.preventDefault();

    const id =
        document.getElementById("userId").value;

    const user = {

        id: id ? Number(id) : undefined,

        name:
            document.getElementById("name").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        role:
            document.getElementById("role").value,

        status:
            document.getElementById("status").value
    };

    if (id) {

        await updateUser(user);

        showToast("User updated successfully");

    } else {

        await addUser(user);

        showToast("User added successfully");

    }

    closeModal();

    await loadUsers();

});

searchInput.addEventListener(
    "input",
    renderUsers
);

statusFilter.addEventListener(
    "change",
    renderUsers
);

async function loadUsers() {

    users = await getUsers();

    renderUsers();

}

function renderUsers() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const status =
        statusFilter.value;

    const filteredUsers =
        users.filter(user => {

            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(search) ||

                user.email
                    .toLowerCase()
                    .includes(search) ||

                user.role
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                status === "all" ||
                user.status === status;

            return matchesSearch &&
                   matchesStatus;

        });

    table.innerHTML = "";

    if (filteredUsers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No users found
                </td>
            </tr>
        `;

        return;
    }

    filteredUsers.forEach(user => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${user.id}
            </td>

            <td>
                <div class="user-name">
                    <div class="small-avatar">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>

                    ${escapeHtml(user.name)}
                </div>
            </td>

            <td>
                ${escapeHtml(user.email)}
            </td>

            <td>
                ${escapeHtml(user.role)}
            </td>

            <td>

                <span class="status ${user.status.toLowerCase()}">

                    ${escapeHtml(user.status)}

                </span>

            </td>

            <td>

                <button
                    class="action edit-action"
                    onclick="editUser(${user.id})"
                >
                    Edit
                </button>

                <button
                    class="action delete-action"
                    onclick="removeUser(${user.id})"
                >
                    Delete
                </button>

            </td>
        `;

        table.appendChild(row);

    });

}

function openModal(user = null) {

    modal.classList.add("show");

    if (user) {

        document.getElementById("modalTitle")
            .textContent = "Edit User";

        document.getElementById("userId")
            .value = user.id;

        document.getElementById("name")
            .value = user.name;

        document.getElementById("email")
            .value = user.email;

        document.getElementById("role")
            .value = user.role;

        document.getElementById("status")
            .value = user.status;

    } else {

        document.getElementById("modalTitle")
            .textContent = "Add User";

        form.reset();

        document.getElementById("userId")
            .value = "";

    }

}

function closeModal() {

    modal.classList.remove("show");

    form.reset();

    document.getElementById("userId")
        .value = "";

}

window.editUser = function(id) {

    const user =
        users.find(user => user.id === id);

    if (user) {

        openModal(user);

    }

};

window.removeUser = async function(id) {

    const user =
        users.find(user => user.id === id);

    if (!user) {
        return;
    }

    const confirmed =
        confirm(
            `Delete ${user.name}?`
        );

    if (!confirmed) {
        return;
    }

    await deleteUser(id);

    showToast("User deleted successfully");

    await loadUsers();

};

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}

loadUsers();