// members.js
document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('member-add-form');

    loadMembers();

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('member-name').value.trim();
            const email = document.getElementById('member-email').value.trim();
            const id = 'M' + Date.now(); // Unique ID based on timestamp

            if (name && email && isValidEmail(email)) {
                const members = JSON.parse(localStorage.getItem('members')) || [];
                members.push({ name, email, id });
                saveMembers(members);
                addForm.reset();
                loadMembers();
                updateDashboard();
            } else {
                alert('Invalid email format or missing fields!');
            }
        });
    }
});

function saveMembers(members) {
    localStorage.setItem('members', JSON.stringify(members));
}

function loadMembers() {
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const tableBody = document.getElementById('member-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.id}</td>
                <td><button class="action-btn edit-btn" data-id="${member.id}">✎</button></td>
            `;
            tableBody.appendChild(row);
        });
        addEditListeners();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}