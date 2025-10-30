// Get all incidents from localStorage
function getIncidents() {
    const incidents = localStorage.getItem('incidents');
    return incidents ? JSON.parse(incidents) : [];
}

// Save incidents to localStorage
function saveIncidents(incidents) {
    localStorage.setItem('incidents', JSON.stringify(incidents));
}

// Generate unique ID
function generateId() {
    return 'INC-' + Date.now().toString(36).toUpperCase();
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time
function formatTime(timeString) {
    return new Date('1970-01-01T' + timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
