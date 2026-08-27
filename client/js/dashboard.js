async function loadDashboard() {

    const stats = await getStats();

    document.getElementById("totalUsers").textContent =
        stats.total;

    document.getElementById("activeUsers").textContent =
        stats.active;

    document.getElementById("inactiveUsers").textContent =
        stats.inactive;

    document.getElementById("adminUsers").textContent =
        stats.admins;

    const users = await getUsers();

    const recent = users.slice(-5).reverse();

    const container =
        document.getElementById("recentUsers");

    container.innerHTML = "";

    recent.forEach(user => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td>
                <span class="status ${user.status.toLowerCase()}">
                    ${escapeHtml(user.status)}
                </span>
            </td>
        `;

        container.appendChild(row);
    });
}

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}

loadDashboard();