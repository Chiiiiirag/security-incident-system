let incidents = getIncidents();
let currentFilter = 'all';

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        updateDashboardStats();
        loadRecentIncidents();
    } else if (currentPage === 'report-incident.html') {
        setupReportForm();
    } else if (currentPage === 'incidents.html') {
        setupIncidentsPage();
    }
});

// Dashboard Functions
function updateDashboardStats() {
    document.getElementById('totalIncidents').textContent = incidents.length;
    document.getElementById('pendingIncidents').textContent = 
        incidents.filter(i => i.status === 'pending').length;
    document.getElementById('reviewIncidents').textContent = 
        incidents.filter(i => i.status === 'under-review').length;
    document.getElementById('resolvedIncidents').textContent = 
        incidents.filter(i => i.status === 'resolved').length;
    
    // Severity counts
    document.getElementById('criticalCount').textContent = 
        incidents.filter(i => i.severity === 'critical').length;
    document.getElementById('highCount').textContent = 
        incidents.filter(i => i.severity === 'high').length;
    document.getElementById('mediumCount').textContent = 
        incidents.filter(i => i.severity === 'medium').length;
    document.getElementById('lowCount').textContent = 
        incidents.filter(i => i.severity === 'low').length;
}

function loadRecentIncidents() {
    const recentList = document.getElementById('recentIncidentsList');
    const recentIncidents = incidents.slice(-5).reverse(); // Last 5 incidents
    
    if (recentIncidents.length === 0) {
        recentList.innerHTML = '<p style="text-align:center; color:#999;">No incidents reported yet</p>';
        return;
    }
    
    recentList.innerHTML = recentIncidents.map(incident => `
        <div class="incident-card">
            <div class="incident-header">
                <div>
                    <span class="incident-title">${incident.id} - ${incident.type}</span>
                    <p class="incident-details"><i class="fas fa-map-marker-alt"></i> ${incident.location}</p>
                </div>
                <div class="incident-badges">
                    <span class="badge ${incident.severity}">${incident.severity}</span>
                    <span class="badge ${incident.status}">${incident.status}</span>
                </div>
            </div>
            <div class="incident-footer">
                <span class="incident-meta">
                    <i class="far fa-calendar"></i> ${formatDate(incident.date)} at ${formatTime(incident.time)}
                </span>
                <div class="incident-actions">
                    <button class="btn-view" onclick="viewIncident('${incident.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Report Form Functions
function setupReportForm() {
    const form = document.getElementById('incidentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const incident = {
            id: generateId(),
            type: document.getElementById('incidentType').value,
            severity: document.getElementById('severity').value,
            date: document.getElementById('incidentDate').value,
            time: document.getElementById('incidentTime').value,
            location: document.getElementById('location').value,
            reporterName: document.getElementById('reporterName').value,
            contactNumber: document.getElementById('contactNumber').value,
            description: document.getElementById('description').value,
            actionTaken: document.getElementById('actionTaken').value || 'None',
            status: 'pending',
            reportedAt: new Date().toISOString()
        };
        
        incidents.push(incident);
        saveIncidents(incidents);
        
        alert(`Incident ${incident.id} reported successfully!`);
        form.reset();
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
}

// Incidents Page Functions
function setupIncidentsPage() {
    renderAllIncidents();
    setupFilters();
    setupSearch();
}

function renderAllIncidents(searchTerm = '') {
    const tableSection = document.getElementById('incidentsTable');
    
    let filteredIncidents = incidents;
    
    // Apply status filter
    if (currentFilter !== 'all') {
        filteredIncidents = filteredIncidents.filter(i => i.status === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredIncidents = filteredIncidents.filter(i => 
            i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredIncidents.length === 0) {
        tableSection.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">No incidents found</p>';
        return;
    }
    
    tableSection.innerHTML = filteredIncidents.reverse().map(incident => `
        <div class="incident-card">
            <div class="incident-header">
                <div>
                    <span class="incident-title">${incident.id} - ${incident.type}</span>
                    <p class="incident-details"><i class="fas fa-map-marker-alt"></i> ${incident.location}</p>
                    <p class="incident-details">${incident.description.substring(0, 100)}...</p>
                </div>
                <div class="incident-badges">
                    <span class="badge ${incident.severity}">${incident.severity}</span>
                    <span class="badge ${incident.status}">${incident.status}</span>
                </div>
            </div>
            <div class="incident-footer">
                <span class="incident-meta">
                    Reported by: ${incident.reporterName} | 
                    ${formatDate(incident.date)} at ${formatTime(incident.time)}
                </span>
                <div class="incident-actions">
                    <button class="btn-view" onclick="viewIncident('${incident.id}')">View</button>
                    <button class="btn-update" onclick="updateStatus('${incident.id}')">Update</button>
                    <button class="btn-delete" onclick="deleteIncident('${incident.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderAllIncidents();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchIncident');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            renderAllIncidents(e.target.value);
        });
    }
}

// Action Functions
function viewIncident(id) {
    const incident = incidents.find(i => i.id === id);
    if (incident) {
        alert(`
Incident Details:
━━━━━━━━━━━━━━━━━━━━
ID: ${incident.id}
Type: ${incident.type}
Severity: ${incident.severity}
Status: ${incident.status}

Location: ${incident.location}
Date: ${formatDate(incident.date)}
Time: ${formatTime(incident.time)}

Reporter: ${incident.reporterName}
Contact: ${incident.contactNumber}

Description:
${incident.description}

Action Taken:
${incident.actionTaken}
        `);
    }
}

function updateStatus(id) {
    const incident = incidents.find(i => i.id === id);
    if (incident) {
        const newStatus = prompt(`Current Status: ${incident.status}\n\nEnter new status:\n- pending\n- under-review\n- resolved`);
        
        if (newStatus && ['pending', 'under-review', 'resolved'].includes(newStatus)) {
            incident.status = newStatus;
            saveIncidents(incidents);
            
            if (window.location.pathname.includes('dashboard.html')) {
                updateDashboardStats();
                loadRecentIncidents();
            } else {
                renderAllIncidents();
            }
            
            alert('Status updated successfully!');
        } else if (newStatus !== null) {
            alert('Invalid status!');
        }
    }
}

function deleteIncident(id) {
    if (confirm('Are you sure you want to delete this incident?')) {
        incidents = incidents.filter(i => i.id !== id);
        saveIncidents(incidents);
        
        if (window.location.pathname.includes('dashboard.html')) {
            updateDashboardStats();
            loadRecentIncidents();
        } else {
            renderAllIncidents();
        }
        
        alert('Incident deleted successfully!');
    }
}
