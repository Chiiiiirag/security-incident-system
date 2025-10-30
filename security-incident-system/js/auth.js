// Check if user is logged in
const protectedPages = ['dashboard.html', 'report-incident.html', 'incidents.html'];
const currentPage = window.location.pathname.split('/').pop();

if (protectedPages.includes(currentPage)) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    } else {
        const username = localStorage.getItem('username');
        const userNameElements = document.querySelectorAll('#userName');
        userNameElements.forEach(el => el.textContent = username);
    }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials! Use admin/admin123');
        }
    });
}

// Logout Handler
const logoutBtns = document.querySelectorAll('#logoutBtn');
logoutBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
});
