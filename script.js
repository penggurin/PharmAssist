// Global app state
let currentScreen = 'home';
let currentUser = {
    name: 'Maria Rodriguez',
    email: 'maria@example.com'
}; // Default user, since login will skip authentication
let isAuthenticated = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    showAuthScreen('login');
    initializeAuthForms();
    initializeNavigation();
    initializePrescriptionTabs();
    initializeChatFunctionality();
    requestNotificationPermission();
});

// Show auth screen (login/signup)
function showAuthScreen(screenType) {
    hideAllScreens();
    const authScreen = document.getElementById(screenType + '-screen');
    if (authScreen) {
        authScreen.classList.add('active');
        authScreen.style.display = '';
    }
    clearFormErrors();
    lucide.createIcons();
}

// Show main app (home)
function showMainApp() {
    // Hide all auth screens
    const authScreens = document.querySelectorAll('.auth-screen');
    authScreens.forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });

    // Show main app
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.classList.add('active');
        mainApp.style.display = '';
        updateUserGreeting();
        showScreen('home');
        lucide.createIcons();
    }
}

// Hide all screens
function hideAllScreens() {
    const authScreens = document.querySelectorAll('.auth-screen');
    const mainApp = document.getElementById('main-app');
    authScreens.forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    if (mainApp) {
        mainApp.classList.remove('active');
        mainApp.style.display = 'none';
    }
}

// Update user greeting (Demo user only)
function updateUserGreeting() {
    if (currentUser) {
        const userGreeting = document.getElementById('user-greeting');
        const dashboardGreeting = document.getElementById('dashboard-greeting');
        if (userGreeting) {
            userGreeting.textContent = `Hi ${currentUser.name.split(' ')[0]}!`;
        }
        if (dashboardGreeting) {
            dashboardGreeting.textContent = `Hi ${currentUser.name.split(' ')[0]}! 👋`;
        }
    }
}

// Logout function (Go back to login)
function logout() {
    currentUser = null;
    isAuthenticated = false;
    showAuthScreen('login');
}

// No-op form validation (just for UI feedback, not logic)
function showFormError(inputId, message) {}
function clearFormErrors() {}
function showFormSuccess(inputId) {}

// Initialize auth forms (Just page swap, no validation or db)
function initializeAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            isAuthenticated = true;
            currentUser = {
                name: 'Maria Rodriguez',
                email: 'maria@example.com'
            };
            showMainApp();
        });
    }
    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            isAuthenticated = true;
            const name = document.getElementById('signup-name').value.trim() || 'Maria Rodriguez';
            const email = document.getElementById('signup-email').value.trim() || 'maria@example.com';
            currentUser = { name, email };
            showMainApp();
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const screen = this.getAttribute('data-screen');
            showScreen(screen);
            updateActiveNavItem(this);
        });
    });
}
function showScreen(screenName) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.remove('screen-transition');
    });
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('screen-transition');
        currentScreen = screenName;
        lucide.createIcons();
    }
}
function updateActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

// Prescription tabs
function initializePrescriptionTabs() {
    const tabs = document.querySelectorAll('.prescription-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showPrescriptionTab(tabName);
            updateActiveTab(this);
        });
    });
}
function showPrescriptionTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(tabName + '-prescriptions');
    if (targetContent) {
        targetContent.classList.add('active');
    }
}
function updateActiveTab(activeTab) {
    const tabs = document.querySelectorAll('.prescription-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');
}

// Chat functionality
function initializeChatFunctionality() {
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        addMessageToChat(message, 'user');
        messageInput.value = '';
        setTimeout(() => {
            const responses = [
                "Thank you for your message. I'll help you with that.",
                "Let me check your prescription details.",
                "I recommend consulting with your doctor about this.",
                "Your medication should be taken as prescribed.",
                "Please don't hesitate to ask if you have more questions."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(randomResponse, 'pharmacist');
        }, 1000 + Math.random() * 2000);
    }
}
function sendQuickMessage(message) {
    addMessageToChat(message, 'user');
    setTimeout(() => {
        let response = '';
        if (message.includes('food')) {
            response = "Most medications can be taken with or without food, but I recommend checking your specific prescription label for instructions.";
        } else if (message.includes('side effects')) {
            response = "Common side effects may include dizziness, headache, or stomach upset. Contact your doctor if you experience severe side effects.";
        } else if (message.includes('refill')) {
            response = "I can help you with refills. Let me check your prescription status and available refills.";
        } else {
            response = "Thank you for your question. Let me provide you with the information you need.";
        }
        addMessageToChat(response, 'pharmacist');
    }, 1500);
}
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="flex justify-end">
                <div class="max-w-xs">
                    <div class="p-3 rounded-lg bg-gray-900 text-white">
                        <p class="text-sm">${message}</p>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 text-right">${currentTime}</p>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex justify-start">
                <div class="max-w-xs">
                    <div class="p-3 rounded-lg bg-gray-100">
                        <p class="text-sm">${message}</p>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">${currentTime}</p>
                </div>
            </div>
        `;
    }
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utility functions (Toast, etc.)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentNode.parentNode.remove()" class="ml-2 text-white/80 hover:text-white">×</button>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 5000);
}
function formatTime(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Medication reminder simulation (still works if you want)
function checkMedicationReminders() {
    if (!isAuthenticated) return;
    const now = new Date();
    const currentTime = formatTime(now);
    const medicationTimes = ['8:00 AM', '12:00 PM', '7:00 PM'];
    medicationTimes.forEach(time => {
        if (currentTime === time) {
            showMedicationReminder(time);
        }
    });
}
function showMedicationReminder(time) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('PharmAssist Reminder', {
            body: `Time to take your ${time} medication`,
            icon: '/favicon.ico'
        });
    } else {
        showToast(`Reminder: Time to take your ${time} medication`, 'info');
    }
}
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}
setInterval(checkMedicationReminders, 60000); // Check every minute

function initializePrescriptionDropdowns() {
  document.querySelectorAll('.prescription-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const id = toggle.getAttribute('data-id');
      const dropdown = document.getElementById('dropdown-' + id);
      toggle.classList.toggle('active');
      if (dropdown) {
        dropdown.classList.toggle('active');
        lucide.createIcons();
      }
    });
  });
}

// Call this in DOMContentLoaded:
document.addEventListener('DOMContentLoaded', function() {
  // ...other initializations...
  initializePrescriptionDropdowns();
});


// Dropdown logic for prescriptions
function initializePrescriptionDropdowns() {
    document.querySelectorAll('.more-info-toggle').forEach(button => {
        button.addEventListener('click', function () {
            const id = button.getAttribute('data-id');
            const dropdown = document.getElementById('dropdown-' + id);
            if (dropdown) {
                dropdown.classList.toggle('hidden');
                // Toggle chevron direction
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.toggle('rotate-180', !dropdown.classList.contains('hidden'));
                }
                lucide.createIcons();
            }
        });
    });
}

// Export functions for global access
window.showScreen = showScreen;
window.showAuthScreen = showAuthScreen;
window.logout = logout;
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;
