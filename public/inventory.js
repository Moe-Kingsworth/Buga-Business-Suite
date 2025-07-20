// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuTexts = document.querySelectorAll('.menu-text');
const sidebarLogoText = document.getElementById('sidebarLogoText');
const toggleIconOpen = document.getElementById('toggleIconOpen');
const toggleIconClosed = document.getElementById('toggleIconClosed');
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');
const logoutButton = document.getElementById('logoutButton');

// Modal Elements
const newOrderModal = document.getElementById('newOrderModal');
const addMenuItemModal = document.getElementById('addMenuItemModal');
const newReservationModal = document.getElementById('newReservationModal');

const openNewOrderModalButton = document.getElementById('openNewOrderModal');
const openAddMenuItemModalButton = document.getElementById('openAddMenuItemModal');
const openNewReservationModalButton = document.getElementById('openNewReservationModal');

const closeNewOrderModalButton = document.getElementById('closeNewOrderModal');
const closeAddMenuItemModalButton = document.getElementById('closeAddMenuItemModal');
const closeNewReservationModalButton = document.getElementById('closeNewReservationModal');

const cancelNewOrderButton = document.getElementById('cancelNewOrder');
const cancelAddMenuItemButton = document.getElementById('cancelAddMenuItem');
const cancelNewReservationButton = document.getElementById('cancelNewReservation');

const newOrderForm = document.getElementById('newOrderForm');
const addMenuItemForm = document.getElementById('addMenuItemForm');
const newReservationForm = document.getElementById('newReservationForm');


// Sidebar Constants
const EXPANDED_WIDTH_CLASS = 'w-64';
const COLLAPSED_WIDTH_CLASS = 'w-20';
const MAIN_CONTENT_MARGIN_EXPANDED_CLASS = 'lg:ml-64';
const MAIN_CONTENT_MARGIN_COLLAPSED_CLASS = 'lg:ml-20';
const SIDEBAR_MOBILE_HIDDEN_CLASS = '-translate-x-full';
const SIDEBAR_MOBILE_VISIBLE_CLASS = 'translate-x-0';

let isSidebarExpanded = localStorage.getItem('sidebarState') !== 'collapsed';

function applySidebarState(expanded, isMobile = false) {
    if (expanded) {
        sidebar.classList.remove(COLLAPSED_WIDTH_CLASS);
        sidebar.classList.add(EXPANDED_WIDTH_CLASS);
        if (!isMobile) {
            mainContent.classList.remove(MAIN_CONTENT_MARGIN_COLLAPSED_CLASS);
            mainContent.classList.add(MAIN_CONTENT_MARGIN_EXPANDED_CLASS);
        }
        menuTexts.forEach(text => {
            text.classList.remove('hidden');
            if (text.parentElement.id === 'sidebarToggle') text.textContent = "Collapse";
        });
        if (sidebarLogoText) sidebarLogoText.classList.remove('hidden');
        if (toggleIconOpen) toggleIconOpen.classList.remove('hidden');
        if (toggleIconClosed) toggleIconClosed.classList.add('hidden');
    } else {
        sidebar.classList.remove(EXPANDED_WIDTH_CLASS);
        sidebar.classList.add(COLLAPSED_WIDTH_CLASS);
        if (!isMobile) {
            mainContent.classList.remove(MAIN_CONTENT_MARGIN_EXPANDED_CLASS);
            mainContent.classList.add(MAIN_CONTENT_MARGIN_COLLAPSED_CLASS);
        }
        menuTexts.forEach(text => {
            text.classList.add('hidden');
            if (text.parentElement.id === 'sidebarToggle') {
                text.classList.remove('hidden'); text.textContent = "";
            }
        });
        if (sidebarLogoText) sidebarLogoText.classList.add('hidden');
        if (toggleIconOpen) toggleIconOpen.classList.add('hidden');
        if (toggleIconClosed) toggleIconClosed.classList.remove('hidden');
    }
    lucide.createIcons();
}

function toggleDesktopSidebar() {
    isSidebarExpanded = !isSidebarExpanded;
    applySidebarState(isSidebarExpanded);
    localStorage.setItem('sidebarState', isSidebarExpanded ? 'expanded' : 'collapsed');
}

function openMobileSidebar() {
    sidebar.classList.remove(SIDEBAR_MOBILE_HIDDEN_CLASS);
    sidebar.classList.add(SIDEBAR_MOBILE_VISIBLE_CLASS);
    sidebarOverlay.classList.remove('hidden');
    applySidebarState(true, true);
}

function closeMobileSidebar() {
    sidebar.classList.remove(SIDEBAR_MOBILE_VISIBLE_CLASS);
    sidebar.classList.add(SIDEBAR_MOBILE_HIDDEN_CLASS);
    sidebarOverlay.classList.add('hidden');
}

let isProfileDropdownOpen = false;
function toggleProfileDropdown() {
    isProfileDropdownOpen = !isProfileDropdownOpen;
    if (isProfileDropdownOpen) {
        profileDropdown.classList.remove('opacity-0', 'scale-95', '-translate-y-2', 'pointer-events-none');
        profileDropdown.classList.add('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
    } else {
        profileDropdown.classList.add('opacity-0', 'scale-95', '-translate-y-2', 'pointer-events-none');
        profileDropdown.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
    }
}

// --- Modal Control Functions ---
function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('hidden');
    // Timeout to allow display:flex to apply before starting transition
    setTimeout(() => {
        modalElement.classList.remove('opacity-0');
        modalElement.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
        modalElement.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
        lucide.createIcons(); // Re-render icons if any are in the modal
    }, 10);
}

function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.add('opacity-0');
    modalElement.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
    modalElement.querySelector('.modal-content').classList.remove('scale-100', 'opacity-100');
    // Wait for transition to finish before hiding
    setTimeout(() => {
        modalElement.classList.add('hidden');
    }, 300); // Match transition duration
}

// --- Event Listeners ---
if (sidebarToggle) sidebarToggle.addEventListener('click', (e) => { e.preventDefault(); toggleDesktopSidebar(); });
if (mobileMenuButton) mobileMenuButton.addEventListener('click', (e) => { e.preventDefault(); openMobileSidebar(); });
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);
if (profileButton) profileButton.addEventListener('click', (e) => { e.stopPropagation(); toggleProfileDropdown(); });

if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Logout clicked');
        alert('Logout functionality to be implemented.');
        isProfileDropdownOpen = false;
        profileDropdown.classList.add('opacity-0', 'scale-95', '-translate-y-2', 'pointer-events-none');
        profileDropdown.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
    });
}

document.addEventListener('click', (e) => {
    if (isProfileDropdownOpen && !profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
        toggleProfileDropdown();
    }
});

// Modal Event Listeners
if (openNewOrderModalButton) openNewOrderModalButton.addEventListener('click', () => openModal(newOrderModal));
if (openAddMenuItemModalButton) openAddMenuItemModalButton.addEventListener('click', () => openModal(addMenuItemModal));
if (openNewReservationModalButton) openNewReservationModalButton.addEventListener('click', () => openModal(newReservationModal));

if (closeNewOrderModalButton) closeNewOrderModalButton.addEventListener('click', () => closeModal(newOrderModal));
if (closeAddMenuItemModalButton) closeAddMenuItemModalButton.addEventListener('click', () => closeModal(addMenuItemModal));
if (closeNewReservationModalButton) closeNewReservationModalButton.addEventListener('click', () => closeModal(newReservationModal));

if (cancelNewOrderButton) cancelNewOrderButton.addEventListener('click', () => closeModal(newOrderModal));
if (cancelAddMenuItemButton) cancelAddMenuItemButton.addEventListener('click', () => closeModal(addMenuItemModal));
if (cancelNewReservationButton) cancelNewReservationButton.addEventListener('click', () => closeModal(newReservationModal));

// Modal Form Submissions (Placeholder)
if (newOrderForm) newOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('New Order Form Submitted:', Object.fromEntries(new FormData(e.target)));
    // Add actual save logic here
    closeModal(newOrderModal);
    e.target.reset(); // Reset form fields
});
if (addMenuItemForm) addMenuItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Add Menu Item Form Submitted:', Object.fromEntries(new FormData(e.target)));
    closeModal(addMenuItemModal);
    e.target.reset();
});
if (newReservationForm) newReservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('New Reservation Form Submitted:', Object.fromEntries(new FormData(e.target)));
    closeModal(newReservationModal);
    e.target.reset();
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!newOrderModal.classList.contains('hidden')) closeModal(newOrderModal);
        if (!addMenuItemModal.classList.contains('hidden')) closeModal(addMenuItemModal);
        if (!newReservationModal.classList.contains('hidden')) closeModal(newReservationModal);
    }
});


function initializeLayout() {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
        sidebar.classList.add(SIDEBAR_MOBILE_HIDDEN_CLASS);
        sidebar.classList.remove(SIDEBAR_MOBILE_VISIBLE_CLASS);
        mainContent.classList.remove(MAIN_CONTENT_MARGIN_EXPANDED_CLASS, MAIN_CONTENT_MARGIN_COLLAPSED_CLASS);
        mainContent.classList.add('ml-0');
        applySidebarState(true, true);
        sidebar.classList.add(SIDEBAR_MOBILE_HIDDEN_CLASS);
        if (sidebarToggle) sidebarToggle.classList.add('hidden');
    } else {
        sidebar.classList.remove(SIDEBAR_MOBILE_HIDDEN_CLASS, SIDEBAR_MOBILE_VISIBLE_CLASS);
        applySidebarState(isSidebarExpanded, false);
        if (sidebarToggle) sidebarToggle.classList.remove('hidden');
    }
    lucide.createIcons();
}

window.addEventListener('resize', initializeLayout);
document.addEventListener('DOMContentLoaded', () => {
    initializeLayout();

    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [1250, 1980, 3100, 4800, 2400, 3200, 4650],
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1, borderRadius: 6, barThickness: 'flex', maxBarThickness: 30
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    const popularDishesCtx = document.getElementById('popularDishesChart')?.getContext('2d');
    if (popularDishesCtx) {
        new Chart(popularDishesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Margherita Pizza', 'Caesar Salad', 'Pasta Carbonara', 'Steak Frites', 'Tiramisu', 'Other'],
                datasets: [{
                    label: 'Orders', data: [120, 95, 88, 70, 65, 40],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(245, 158, 11, 0.7)',
                        'rgba(16, 185, 129, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(107, 114, 128, 0.7)'
                    ],
                    borderColor: [
                        'rgba(239, 68, 68, 1)', 'rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)', 'rgba(139, 92, 246, 1)', 'rgba(107, 114, 128, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { padding: 15, font: { size: 10 } } } }
            }
        });
    }
});