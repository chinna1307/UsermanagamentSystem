// reports.js
document.addEventListener('DOMContentLoaded', () => {
    updateReports();
});

function updateReports() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const issues = JSON.parse(localStorage.getItem('issues')) || [];

    const newBooks = books.length;
    const newMembers = members.length;
    const finesCollected = issues.filter(i => i.status === 'overdue').length * 5; // Example fine of $5 per overdue

    document.getElementById('new-books').textContent = newBooks;
    document.getElementById('new-members').textContent = newMembers;
    document.getElementById('fines-collected').textContent = `$${finesCollected.toFixed(2)}`;
}