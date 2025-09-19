// issue-return.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('issue-return-form');

    loadIssues();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const isbn = document.getElementById('issue-isbn').value.trim();
            const memberId = document.getElementById('issue-member-id').value.trim();
            const action = document.getElementById('issue-action').value;

            const books = JSON.parse(localStorage.getItem('books')) || [];
            const members = JSON.parse(localStorage.getItem('members')) || [];
            const issues = JSON.parse(localStorage.getItem('issues')) || [];

            const book = books.find(b => b.isbn === isbn);
            const member = members.find(m => m.id === memberId);

            if (book && member) {
                if (action === 'issue' && book.status === 'available') {
                    const issueDate = new Date().toLocaleDateString();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 14); // 14-day loan period
                    book.status = 'issued';
                    issues.push({
                        title: book.title,
                        memberName: member.name,
                        memberId: member.id,
                        issueDate,
                        dueDate: dueDate.toLocaleDateString(),
                        status: 'issued'
                    });
                } else if (action === 'return' && book.status === 'issued') {
                    book.status = 'available';
                    const issue = issues.find(i => i.title === book.title && i.memberId === memberId && i.status === 'issued');
                    if (issue) {
                        issue.status = 'returned';
                        const issueDate = new Date(issue.issueDate);
                        const dueDate = new Date(issue.dueDate);
                        if (new Date() > dueDate) {
                            issue.status = 'overdue';
                        }
                    }
                } else {
                    alert('Invalid action or book status!');
                    return;
                }

                saveBooks(books);
                saveIssues(issues);
                form.reset();
                loadIssues();
                updateDashboard();
            } else {
                alert('Book or Member not found!');
            }
        });
    }
});

function saveIssues(issues) {
    localStorage.setItem('issues', JSON.stringify(issues));
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