// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Load all data on page load
    loadBooks();
    loadMembers();
    loadIssues();
    updateDashboard();

    // Handle navigation active state
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});

function updateDashboard() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const issues = JSON.parse(localStorage.getItem('issues')) || [];

    document.getElementById('total-books').textContent = books.length;
    document.getElementById('total-members').textContent = members.length;
    document.getElementById('books-issued').textContent = issues.filter(i => i.status === 'issued').length;
    document.getElementById('books-overdue').textContent = issues.filter(i => {
        if (i.dueDate) {
            const dueDate = new Date(i.dueDate);
            return i.status === 'issued' && new Date() > dueDate;
        }
        return false;
    }).length;
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const tableBody = document.getElementById('book-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.status}</td>
                <td><button class="action-btn edit-btn" data-isbn="${book.isbn}">✎</button></td>
            `;
            tableBody.appendChild(row);
        });
        addEditListeners();
    }
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

function loadIssues() {
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const tableBody = document.getElementById('issue-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue.title}</td>
                <td>${issue.memberName}</td>
                <td>${issue.issueDate}</td>
                <td>${issue.dueDate}</td>
                <td>${issue.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function addEditListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isbn = btn.getAttribute('data-isbn');
            const id = btn.getAttribute('data-id');
            if (isbn) editBook(isbn);
            else if (id) editMember(id);
        });
    });
}

function editBook(isbn) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        const newTitle = prompt('Enter new title:', book.title);
        const newAuthor = prompt('Enter new author:', book.author);
        if (newTitle && newAuthor) {
            book.title = newTitle.trim();
            book.author = newAuthor.trim();
            saveBooks(books);
            loadBooks();
            updateDashboard();
        }
    }
}

function editMember(id) {
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const member = members.find(m => m.id === id);
    if (member) {
        const newName = prompt('Enter new name:', member.name);
        const newEmail = prompt('Enter new email:', member.email);
        if (newName && newEmail && isValidEmail(newEmail)) {
            member.name = newName.trim();
            member.email = newEmail.trim();
            saveMembers(members);
            loadMembers();
            updateDashboard();
        } else {
            alert('Invalid email format!');
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}