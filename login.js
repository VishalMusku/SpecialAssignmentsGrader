// Hardcoded user credentials (for demonstration only)
const users = [
    { username: "admin", password: "password123" },
    { username: "v", password: "v" }
];

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('loggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password');
            }
        });
    } else {
        console.error('Login form not found');
    }
});
