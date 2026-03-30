// Configuration
const API_URL = 'https://script.google.com/macros/d/https://script.google.com/macros/s/AKfycbyKXmXwVSGRVLC0K6zkciz765nL4SDRC1H0x3egmhUZK0zL5DAuwMT57kp1iYB5bOKnXg/exec
/userweb'; // Replace with your deployment URL
const TEMP_ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// State Management
let currentUser = null;
let allData = {
    users: [],
    leads: [],
    invoices: [],
    approvals: []
};

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const sidebar = document.querySelector('.sidebar');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkLoginStatus();
    showToggleButton();
});

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    logoutBtn.addEventListener('click', handleLogout);

    // Mobile sidebar toggle
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Profile
    document.getElementById('editProfileBtn').addEventListener('click', showEditProfile);
    document.getElementById('cancelEditBtn').addEventListener('click', hideEditProfile);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('generateIDBtn').addEventListener('click', generateIDCard);

    // Photo upload
    const photoInput = document.getElementById('editPhoto');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }

    // Leads
    document.getElementById('addLeadBtn').addEventListener('click', showAddLeadForm);
    document.getElementById('cancelLeadBtn').addEventListener('click', hideAddLeadForm);
    document.getElementById('leadForm').addEventListener('submit', handleAddLead);

    // Financial
    document.getElementById('sendInvoiceBtn').addEventListener('click', showInvoiceModal);

    // Admin Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleAdminTabChange);
    });

    // Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Invoice Modal
    document.getElementById('invoiceForm').addEventListener('submit', handleSendInvoice);

    // Admin Functions
    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        alert('Employee management will be implemented');
    });
}

// ==================== MOBILE SIDEBAR ====================
function showToggleButton() {
    if (toggleSidebarBtn) {
        if (window.innerWidth <= 768) {
            toggleSidebarBtn.style.display = 'block';
        }
    }
}

window.addEventListener('resize', () => {
    if (toggleSidebarBtn) {
        if (window.innerWidth <= 768) {
            toggleSidebarBtn.style.display = 'block';
        } else {
            toggleSidebarBtn.style.display = 'none';
            sidebar.classList.remove('active');
        }
    }
});

// Close sidebar when link is clicked on mobile
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// ==================== PHOTO UPLOAD ====================
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Photo size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            currentUser.photoBase64 = event.target.result;
            document.getElementById('profilePhotoImg').src = event.target.result;
            console.log('Photo uploaded successfully');
        };
        reader.readAsDataURL(file);
    }
}

// ==================== AUTHENTICATION ====================
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Temporary admin login
    if (username === TEMP_ADMIN_CREDENTIALS.username && 
        password === TEMP_ADMIN_CREDENTIALS.password) {
        
        currentUser = {
            id: 'ADMIN001',
            username: 'admin',
            name: 'Administrator',
            email: 'admin@rajindra.com',
            role: 'admin',
            department: 'Admin',
            phone: ''
        };
        
        showDashboard();
        return;
    }

    // Try to fetch user from Google Sheets
    try {
        const response = await fetch(API_URL + '?action=login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            errorDiv.classList.remove('show');
            showDashboard();
        } else {
            errorDiv.textContent = 'Invalid credentials';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Connection error. Please check your setup.';
        errorDiv.classList.add('show');
    }

    document.getElementById('loginForm').reset();
}

function handleLogout() {
    currentUser = null;
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.remove('active');
    loginForm.reset();
    document.getElementById('username').focus();
}

function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
}

// ==================== DASHBOARD ====================
function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.add('active');

    // Save user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update UI
    document.getElementById('userGreeting').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('dashboardWelcome').textContent = 
        `You are logged in as ${currentUser.role === 'admin' ? 'Administrator' : 'Employee'}`;

    // Show admin link if admin
    if (currentUser.role === 'admin') {
        document.getElementById('adminLink').style.display = 'block';
    }

    loadDashboardData();
}

async function loadDashboardData() {
    try {
        // Try to fetch from Google Sheets
        const response = await fetch(API_URL + '?action=getData', {
            method: 'GET'
        });
        
        if (response.ok) {
            const result = await response.json();
            allData = result.data || allData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    // Always load mock data for demo
    loadMockData();
    updateDashboardUI();
}

function loadMockData() {
    // Mock user data
    if (currentUser.role !== 'admin') {
        allData.leads = [
            {
                id: 'LEAD001',
                name: 'Acme Corporation',
                email: 'contact@acme.com',
                phone: '9876543210',
                service: 'Taxation',
                charges: 5000,
                status: 'pending',
                assignedTo: currentUser.id
            },
            {
                id: 'LEAD002',
                name: 'Tech Solutions',
                email: 'info@techsol.com',
                phone: '9123456789',
                service: 'Financial Services',
                charges: 8000,
                status: 'successful',
                assignedTo: currentUser.id
            }
        ];

        allData.invoices = [
            {
                id: 'INV001',
                leadId: 'LEAD002',
                amount: 8000,
                status: 'pending',
                date: new Date().toLocaleDateString()
            }
        ];
    }
}

function updateDashboardUI() {
    if (currentUser.role === 'admin') {
        loadAdminDashboard();
    } else {
        loadEmployeeDashboard();
    }
}

function loadEmployeeDashboard() {
    // Update Profile
    document.getElementById('profileName').textContent = currentUser.name;
    
    // Show profile photo if available
    if (currentUser.photoBase64) {
        document.getElementById('profilePhotoImg').src = currentUser.photoBase64;
    }
    
    document.getElementById('profileDetails').innerHTML = `
        <p><strong>Email:</strong> ${currentUser.email}</p>
        <p><strong>Phone:</strong> ${currentUser.phone || 'N/A'}</p>
        <p><strong>Department:</strong> ${currentUser.department}</p>
        <p><strong>Employee ID:</strong> ${currentUser.id}</p>
    `;

    // Update Leads
    displayLeads();

    // Update Financial
    updateFinancialDashboard();
}

function loadAdminDashboard() {
    // Show approval list
    displayApprovals();
    
    // Show employee list (mock)
    displayEmployees();
    
    // Show admin financial dashboard
    updateAdminFinancial();
}

// ==================== NAVIGATION ====================
function handleNavigation(e) {
    e.preventDefault();

    const panelName = this.getAttribute('data-panel');

    // Remove active from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active to clicked link
    this.classList.add('active');

    // Show panel
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const panelElement = document.getElementById(panelName);
    if (panelElement) {
        panelElement.classList.add('active');
    }

    // Handle admin panel visibility
    if (panelName === 'admin') {
        if (currentUser.role !== 'admin') {
            alert('Access denied');
            this.classList.remove('active');
            return;
        }
    }
}

// ==================== PROFILE ====================
function showEditProfile() {
    document.getElementById('editProfileForm').style.display = 'block';
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editDepartment').value = currentUser.department;
}

function hideEditProfile() {
    document.getElementById('editProfileForm').style.display = 'none';
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const updatedUser = {
        ...currentUser,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        department: document.getElementById('editDepartment').value
    };

    try {
        // Update in Google Sheets
        const response = await fetch(API_URL + '?action=updateProfile', {
            method: 'POST',
            body: JSON.stringify(updatedUser)
        });

        const result = await response.json();

        if (result.success) {
            currentUser = updatedUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            hideEditProfile();
            loadEmployeeDashboard();
            alert('Profile updated successfully!');
        } else {
            alert('Update failed. Please try again.');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        // Still update locally
        currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        hideEditProfile();
        loadEmployeeDashboard();
        alert('Profile updated locally!');
    }
}

function generateIDCard() {
    const modal = document.getElementById('idCardModal');
    document.getElementById('idName').textContent = currentUser.name;
    document.getElementById('idNumber').textContent = currentUser.id;
    document.getElementById('idDept').textContent = currentUser.department;
    document.getElementById('idEmail').textContent = currentUser.email;
    
    // Use uploaded photo or placeholder
    if (currentUser.photoBase64) {
        document.getElementById('idPhoto').src = currentUser.photoBase64;
    }
    
    modal.style.display = 'flex';
}

// ==================== LEADS ====================
function showAddLeadForm() {
    document.getElementById('addLeadForm').style.display = 'block';
}

function hideAddLeadForm() {
    document.getElementById('addLeadForm').style.display = 'none';
    document.getElementById('leadForm').reset();
}

async function handleAddLead(e) {
    e.preventDefault();

    const leadData = {
        id: 'LEAD' + Date.now(),
        name: document.getElementById('leadClientName').value,
        email: document.getElementById('leadEmail').value,
        phone: document.getElementById('leadPhone').value,
        service: document.getElementById('leadService').value,
        charges: parseFloat(document.getElementById('leadCharges').value),
        status: 'pending',
        assignedTo: currentUser.id,
        date: new Date().toISOString()
    };

    try {
        const response = await fetch(API_URL + '?action=addLead', {
            method: 'POST',
            body: JSON.stringify(leadData)
        });

        const result = await response.json();

        if (result.success) {
            allData.leads.push(leadData);
            displayLeads();
            hideAddLeadForm();
            alert('Lead added successfully! ✅');
        } else {
            alert('Failed to add lead');
        }
    } catch (error) {
        console.error('Add lead error:', error);
        // Still add locally
        allData.leads.push(leadData);
        displayLeads();
        hideAddLeadForm();
        alert('Lead added locally!');
    }
}

function displayLeads() {
    const leadsContainer = document.getElementById('leadsList');
    leadsContainer.innerHTML = '';

    const userLeads = allData.leads.filter(l => l.assignedTo === currentUser.id);

    if (userLeads.length === 0) {
        leadsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 20px;">No leads yet. Add your first lead!</p>';
        return;
    }

    userLeads.forEach(lead => {
        const leadCard = document.createElement('div');
        leadCard.className = 'lead-card';
        leadCard.innerHTML = `
            <h4>${lead.name}</h4>
            <span class="lead-status ${lead.status}">${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
            <div class="lead-info">
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Phone:</strong> ${lead.phone}</p>
                <p><strong>Service:</strong> ${lead.service}</p>
                <p><strong>Charges:</strong> ₹${lead.charges.toLocaleString()}</p>
            </div>
            <div class="lead-actions">
                <select class="lead-status-select" data-lead-id="${lead.id}">
                    <option value="pending" ${lead.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="successful" ${lead.status === 'successful' ? 'selected' : ''}>Successful</option>
                    <option value="denied" ${lead.status === 'denied' ? 'selected' : ''}>Denied</option>
                </select>
                <button type="button" onclick="updateLeadStatus('${lead.id}')">Update</button>
            </div>
        `;
        leadsContainer.appendChild(leadCard);
    });
}

async function updateLeadStatus(leadId) {
    const select = document.querySelector(`[data-lead-id="${leadId}"]`);
    const newStatus = select.value;

    try {
        const response = await fetch(API_URL + '?action=updateLeadStatus', {
            method: 'POST',
            body: JSON.stringify({ leadId, status: newStatus })
        });

        if (response.ok) {
            const lead = allData.leads.find(l => l.id === leadId);
            if (lead) {
                lead.status = newStatus;
                displayLeads();
                alert('Lead status updated! ✅');
            }
        }
    } catch (error) {
        console.error('Update lead error:', error);
        // Still update locally
        const lead = allData.leads.find(l => l.id === leadId);
        if (lead) {
            lead.status = newStatus;
            displayLeads();
            alert('Lead status updated locally!');
        }
    }
}

// ==================== FINANCIAL ====================
function showInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    modal.style.display = 'flex';

    // Populate lead select
    const select = document.getElementById('invoiceLeadSelect');
    select.innerHTML = '<option value="">Select a lead</option>';
    
    const userLeads = allData.leads.filter(l => l.assignedTo === currentUser.id);
    userLeads.forEach(lead => {
        const option = document.createElement('option');
        option.value = lead.id;
        option.textContent = `${lead.name} - ₹${lead.charges}`;
        select.appendChild(option);
    });
}

async function handleSendInvoice(e) {
    e.preventDefault();

    const invoiceData = {
        id: 'INV' + Date.now(),
        leadId: document.getElementById('invoiceLeadSelect').value,
        amount: parseFloat(document.getElementById('invoiceAmount').value),
        description: document.getElementById('invoiceDescription').value,
        date: new Date().toISOString(),
        status: 'sent'
    };

    try {
        const response = await fetch(API_URL + '?action=sendInvoice', {
            method: 'POST',
            body: JSON.stringify(invoiceData)
        });

        const result = await response.json();

        if (result.success) {
            allData.invoices.push(invoiceData);
            updateFinancialDashboard();
            closeModal();
            alert('Invoice sent successfully! ✅');
        } else {
            alert('Failed to send invoice');
        }
    } catch (error) {
        console.error('Send invoice error:', error);
        // Still add locally
        allData.invoices.push(invoiceData);
        updateFinancialDashboard();
        closeModal();
        alert('Invoice created locally!');
    }
}

function updateFinancialDashboard() {
    const userLeads = allData.leads.filter(l => l.assignedTo === currentUser.id);
    
    let totalIncome = 0;
    let totalPending = 0;
    let totalCompleted = 0;

    userLeads.forEach(lead => {
        totalIncome += lead.charges;
        if (lead.status === 'pending') {
            totalPending += lead.charges;
        } else if (lead.status === 'successful') {
            totalCompleted += lead.charges;
        }
    });

    document.getElementById('totalIncome').textContent = '₹' + totalIncome.toLocaleString();
    document.getElementById('totalPending').textContent = '₹' + totalPending.toLocaleString();
    document.getElementById('totalCompleted').textContent = '₹' + totalCompleted.toLocaleString();

    // Display invoices
    const invoicesList = document.getElementById('invoicesList');
    invoicesList.innerHTML = '';

    const userInvoices = allData.invoices.filter(i => {
        const lead = allData.leads.find(l => l.id === i.leadId);
        return lead && lead.assignedTo === currentUser.id;
    });

    if (userInvoices.length === 0) {
        invoicesList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">No invoices yet.</p>';
        return;
    }

    userInvoices.forEach(invoice => {
        const invoiceItem = document.createElement('div');
        invoiceItem.className = 'invoice-item';
        invoiceItem.innerHTML = `
            <h4>Invoice #${invoice.id}</h4>
            <div class="invoice-amount">₹${invoice.amount.toLocaleString()}</div>
            <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
            <p>Status: <span class="lead-status pending">${invoice.status}</span></p>
        `;
        invoicesList.appendChild(invoiceItem);
    });
}

// ==================== ADMIN PANEL ====================
function handleAdminTabChange(e) {
    e.preventDefault();

    const tabName = this.getAttribute('data-tab');

    // Remove active from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active to clicked tab
    this.classList.add('active');

    // Show tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const contentElement = document.getElementById(tabName);
    if (contentElement) {
        contentElement.classList.add('active');
    }
}

function displayApprovals() {
    const approvalsList = document.getElementById('approvalsList');
    approvalsList.innerHTML = '';

    // Mock approval data
    const mockApprovals = [
        {
            id: 'APP001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '9876543210',
            department: 'Taxation'
        }
    ];

    if (mockApprovals.length === 0) {
        approvalsList.innerHTML = '<p>No pending approvals</p>';
        return;
    }

    mockApprovals.forEach(approval => {
        const approvalCard = document.createElement('div');
        approvalCard.className = 'approval-card';
        approvalCard.innerHTML = `
            <h4>${approval.firstName} ${approval.lastName}</h4>
            <div class="approval-info">
                <p><strong>Email:</strong> ${approval.email}</p>
                <p><strong>Phone:</strong> ${approval.phone}</p>
                <p><strong>Department:</strong> ${approval.department}</p>
            </div>
            <div class="approval-actions">
                <button class="approve-btn" onclick="approveUser('${approval.id}')">Approve</button>
                <button class="reject-btn" onclick="rejectUser('${approval.id}')">Reject</button>
            </div>
        `;
        approvalsList.appendChild(approvalCard);
    });
}

async function approveUser(approvalId) {
    try {
        const response = await fetch(API_URL + '?action=approveUser', {
            method: 'POST',
            body: JSON.stringify({ approvalId })
        });

        if (response.ok) {
            alert('User approved successfully!');
            displayApprovals();
        }
    } catch (error) {
        console.error('Approval error:', error);
        alert('User approved locally!');
        displayApprovals();
    }
}

async function rejectUser(approvalId) {
    try {
        const response = await fetch(API_URL + '?action=rejectUser', {
            method: 'POST',
            body: JSON.stringify({ approvalId })
        });

        if (response.ok) {
            alert('User rejected');
            displayApprovals();
        }
    } catch (error) {
        console.error('Rejection error:', error);
        alert('User rejected locally!');
        displayApprovals();
    }
}

function displayEmployees() {
    const employeesList = document.getElementById('employeesList');
    employeesList.innerHTML = '';

    // Mock employee data
    const mockEmployees = [
        {
            id: 'EMP001',
            name: 'Raj Kumar',
            email: 'raj@rajindra.com',
            phone: '9123456789',
            department: 'Workforce'
        },
        {
            id: 'EMP002',
            name: 'Priya Singh',
            email: 'priya@rajindra.com',
            phone: '9876543210',
            department: 'Taxation'
        }
    ];

    mockEmployees.forEach(emp => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card';
        employeeCard.innerHTML = `
            <h4>${emp.name}</h4>
            <div class="employee-info">
                <p><strong>ID:</strong> ${emp.id}</p>
                <p><strong>Email:</strong> ${emp.email}</p>
                <p><strong>Phone:</strong> ${emp.phone}</p>
                <p><strong>Department:</strong> ${emp.department}</p>
            </div>
            <button class="btn-primary" onclick="viewEmployeeDetails('${emp.id}')">View Details</button>
        `;
        employeesList.appendChild(employeeCard);
    });
}

function updateAdminFinancial() {
    let totalRevenue = 0;
    let totalPayout = 0;

    allData.leads.forEach(lead => {
        if (lead.status === 'successful') {
            totalRevenue += lead.charges;
            totalPayout += lead.charges * 0.8; // 80% to employee
        }
    });

    document.getElementById('adminTotalRevenue').textContent = '₹' + totalRevenue.toLocaleString();
    document.getElementById('adminTotalPayout').textContent = '₹' + totalPayout.toLocaleString();
    document.getElementById('adminNetProfit').textContent = 
        '₹' + (totalRevenue - totalPayout).toLocaleString();
}

// ==================== MODALS ====================
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// ==================== UTILITY FUNCTIONS ====================
function viewEmployeeDetails(empId) {
    alert(`Employee details for ${empId} will be shown here`);
}

// Export for external use
window.updateLeadStatus = updateLeadStatus;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.viewEmployeeDetails = viewEmployeeDetails;
