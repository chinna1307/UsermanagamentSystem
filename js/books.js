// books.js
document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('book-add-form');
    const searchForm = document.getElementById('book-search-form');

    loadBooks();

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('book-title').value.trim();
            const author = document.getElementById('book-author').value.trim();
            const isbn = document.getElementById('book-isbn').value.trim();

            if (title && author && isbn && isValidISBN(isbn)) {
                const books = JSON.parse(localStorage.getItem('books')) || [];
                if (!books.some(book => book.isbn === isbn)) {
                    books.push({ title, author, isbn, status: 'available' });
                    saveBooks(books);
                    addForm.reset();
                    loadBooks();
                    updateDashboard();
                } else {
                    alert('Book with this ISBN already exists!');
                }
            } else {
                alert('Invalid ISBN format or missing fields!');
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('book-search').value.toLowerCase();
            const books = JSON.parse(localStorage.getItem('books')) || [];
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
            );
            const tableBody = document.getElementById('book-table-body');
            tableBody.innerHTML = '';
            filteredBooks.forEach(book => {
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
        });
    }
});

function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
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

function isValidISBN(isbn) {
    // Basic ISBN-10 or ISBN-13 validation (simplified)
    isbn = isbn.replace(/-/g, '');
    return (isbn.length === 10 || isbn.length === 13) && /^\d+$/.test(isbn);
}