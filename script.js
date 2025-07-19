// Global app state
let currentScreen = 'home';
let currentUser = {
    name: 'Maria',
    email: 'maria@example.com'
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePrescriptionTabs();
    initializeChatFunctionality();
    showScreen('home');
});

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
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.remove('screen-transition');
    });
    
    // Show selected screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('screen-transition');
        currentScreen = screenName;
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if (nav.getAttribute('data-screen') === screenName) {
            nav.classList.add('active');
        }
    });
}

function updateActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

// Prescription tabs functionality
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
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected tab content
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
        
        // Simulate pharmacist response
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
    
    // Simulate pharmacist response for quick questions
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

// Medication tracking functionality
function markMedicationTaken(medicationName, time) {
    // Find the medication element and update its status
    const medicationElements = document.querySelectorAll('.medication-item');
    medicationElements.forEach(element => {
        if (element.dataset.medication === medicationName && element.dataset.time === time) {
            const statusIndicator = element.querySelector('.status-indicator');
            const button = element.querySelector('button');
            
            if (statusIndicator && button) {
                statusIndicator.classList.remove('bg-gray-300');
                statusIndicator.classList.add('bg-green-500');
                button.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    });
    
    // Update overall adherence stats
    updateAdherenceStats();
}

function updateAdherenceStats() {
    // This would normally calculate real adherence based on taken medications
    // For demo purposes, we'll just show static improvements
    const weeklyStats = document.querySelector('.weekly-adherence');
    const monthlyStats = document.querySelector('.monthly-adherence');
    
    if (weeklyStats) {
        const currentValue = parseInt(weeklyStats.textContent);
        weeklyStats.textContent = Math.min(currentValue + 1, 100) + '%';
    }
}

// Pharmacy finder functionality
function searchPharmacies() {
    const searchInput = document.querySelector('#pharmacy-search');
    if (searchInput) {
        const query = searchInput.value.toLowerCase();
        const pharmacyCards = document.querySelectorAll('.pharmacy-card');
        
        pharmacyCards.forEach(card => {
            const pharmacyName = card.querySelector('h3').textContent.toLowerCase();
            const pharmacyAddress = card.querySelector('.pharmacy-address').textContent.toLowerCase();
            
            if (pharmacyName.includes(query) || pharmacyAddress.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Profile settings functionality
function toggleNotification(settingName) {
    const toggle = document.querySelector(`#${settingName}-toggle`);
    if (toggle) {
        // Toggle the switch state
        toggle.checked = !toggle.checked;
        
        // Save to localStorage (in real app, this would sync with backend)
        const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
        settings[settingName] = toggle.checked;
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        
        // Show feedback
        showToast(`${settingName.replace(/([A-Z])/g, ' $1')} ${toggle.checked ? 'enabled' : 'disabled'}`);
    }
}

// Utility functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-gray-900 text-white'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.transition = 'transform 0.3s ease-in-out';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
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

// Medication reminder simulation
function checkMedicationReminders() {
    const now = new Date();
    const currentTime = formatTime(now);
    
    // Check if it's time for any medications
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

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Initialize medication reminders
setInterval(checkMedicationReminders, 60000); // Check every minute

// Initialize app features
document.addEventListener('DOMContentLoaded', function() {
    requestNotificationPermission();
    
    // Load saved notification settings
    const savedSettings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    Object.keys(savedSettings).forEach(setting => {
        const toggle = document.querySelector(`#${setting}-toggle`);
        if (toggle) {
            toggle.checked = savedSettings[setting];
        }
    });
});

// Export functions for global access
window.showScreen = showScreen;
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;
window.markMedicationTaken = markMedicationTaken;
window.searchPharmacies = searchPharmacies;
window.toggleNotification = toggleNotification;