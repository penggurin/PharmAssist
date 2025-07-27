  // Global app state
  let currentScreen = 'home';
  let currentUser = null;
  let isAuthenticated = false;
  
  // User database simulation (in real app, this would be backend)
  let userDatabase = [
      {
          id: 1,
          name: 'Maria Rodriguez',
          email: 'maria@example.com',
          password: 'password123' // In real app, this would be hashed
      }
  ];
  
  // Initialize the app
  document.addEventListener('DOMContentLoaded', function() {
      checkAuthStatus();
      initializeAuthForms();
      initializeNavigation();
      initializePrescriptionTabs();
      initializeChatFunctionality();
  });
  
  // Authentication Functions
  function checkAuthStatus() {
      const savedUser = localStorage.getItem('currentUser');
      const authToken = localStorage.getItem('authToken');
      
      if (savedUser && authToken) {
          currentUser = JSON.parse(savedUser);
          isAuthenticated = true;
          showMainApp();
      } else {
          showAuthScreen('login');
      }
  }
  
  function showAuthScreen(screenType) {
      // Hide all screens
      hideAllScreens();
      
      // Show auth screen
      const authScreen = document.getElementById(screenType + '-screen');
      if (authScreen) {
          authScreen.classList.add('active');
      }
      
      // Clear any form errors
      clearFormErrors();
  }
  
  function showMainApp() {
      // Hide all auth screens
      const authScreens = document.querySelectorAll('.auth-screen');
      authScreens.forEach(screen => screen.classList.remove('active'));
      
      // Show main app
      const mainApp = document.getElementById('main-app');
      if (mainApp) {
          mainApp.classList.add('active');
          updateUserGreeting();
          showScreen('home');
      }
  }
  
  function hideAllScreens() {
      const authScreens = document.querySelectorAll('.auth-screen');
      const mainApp = document.getElementById('main-app');
      
      authScreens.forEach(screen => screen.classList.remove('active'));
      if (mainApp) {
          mainApp.classList.remove('active');
      }
  }
  
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
  
  // Demo login function
  function demoLogin() {
      const demoUser = userDatabase[0]; // Maria
      currentUser = demoUser;
      isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('authToken', 'demo_token_' + Date.now());
      
      showToast('Welcome back, ' + demoUser.name.split(' ')[0] + '!', 'success');
      showMainApp();
  }
  
  // Logout function
function logout() {
    currentUser = null;
    isAuthenticated = false;
    
    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('notificationSettings');
    
    showToast('You have been signed out successfully', 'info');
    showAuthScreen('login');
}
  
  // Form Validation Functions
  function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
  
  function validatePassword(password) {
      return password.length >= 6;
  }
  
  function getPasswordStrength(password) {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      
      if (strength < 3) return 'weak';
      if (strength < 4) return 'medium';
      return 'strong';
  }
  
  function showFormError(inputId, message) {
      const input = document.getElementById(inputId);
      if (input) {
          input.classList.add('form-error');
          
          // Remove existing error message
          const existingError = input.parentNode.querySelector('.error-message');
          if (existingError) {
              existingError.remove();
          }
          
          // Add new error message
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message show';
          errorDiv.textContent = message;
          input.parentNode.appendChild(errorDiv);
      }
  }
  
  function clearFormErrors() {
      const errorInputs = document.querySelectorAll('.form-error');
      const errorMessages = document.querySelectorAll('.error-message');
      
      errorInputs.forEach(input => {
          input.classList.remove('form-error', 'form-success');
      });
      
      errorMessages.forEach(message => {
          message.remove();
      });
  }
  
  function showFormSuccess(inputId) {
      const input = document.getElementById(inputId);
      if (input) {
          input.classList.remove('form-error');
          input.classList.add('form-success');
      }
  }
  
  // Initialize auth forms
  function initializeAuthForms() {
      // Login form
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
          loginForm.addEventListener('submit', handleLogin);
      }
      
      // Signup form
      const signupForm = document.getElementById('signup-form');
      if (signupForm) {
          signupForm.addEventListener('submit', handleSignup);
      }
      
      // Password strength indicator for signup
      const signupPassword = document.getElementById('signup-password');
      if (signupPassword) {
          signupPassword.addEventListener('input', function() {
              const strength = getPasswordStrength(this.value);
              updatePasswordStrengthIndicator(strength);
          });
      }
      
      // Real-time validation
      const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
      inputs.forEach(input => {
          input.addEventListener('blur', validateInputOnBlur);
          input.addEventListener('input', clearInputError);
      });
  }
  
  function updatePasswordStrengthIndicator(strength) {
      let indicator = document.querySelector('.password-strength');
      if (!indicator) {
          indicator = document.createElement('div');
          indicator.className = 'password-strength';
          const passwordInput = document.getElementById('signup-password');
          passwordInput.parentNode.appendChild(indicator);
      }
      
      indicator.className = `password-strength ${strength}`;
  }
  
  function validateInputOnBlur(event) {
      const input = event.target;
      const value = input.value.trim();
      
      if (input.type === 'email' && value) {
          if (!validateEmail(value)) {
              showFormError(input.id, 'Please enter a valid email address');
          } else {
              showFormSuccess(input.id);
          }
      }
      
      if (input.type === 'password' && value) {
          if (!validatePassword(value)) {
              showFormError(input.id, 'Password must be at least 6 characters long');
          } else {
              showFormSuccess(input.id);
          }
      }
      
      if (input.type === 'text' && input.required && !value) {
          showFormError(input.id, 'This field is required');
      } else if (input.type === 'text' && value) {
          showFormSuccess(input.id);
      }
  }
  
  function clearInputError(event) {
      const input = event.target;
      input.classList.remove('form-error');
      const errorMessage = input.parentNode.querySelector('.error-message');
      if (errorMessage) {
          errorMessage.remove();
      }
  }
  
  // Login handler
  function handleLogin(event) {
      event.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const rememberMe = document.getElementById('remember-me').checked;
      
      // Clear previous errors
      clearFormErrors();
      
      // Validate inputs
      let hasErrors = false;
      
      if (!email) {
          showFormError('login-email', 'Email is required');
          hasErrors = true;
      } else if (!validateEmail(email)) {
          showFormError('login-email', 'Please enter a valid email address');
          hasErrors = true;
      }
      
      if (!password) {
          showFormError('login-password', 'Password is required');
          hasErrors = true;
      }
      
      if (hasErrors) return;
      
      // Show loading state
      const submitBtn = event.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Signing in...';
      submitBtn.classList.add('loading-btn');
      
      // Simulate API call
      setTimeout(() => {
          // Find user
          const user = userDatabase.find(u => u.email === email && u.password === password);
          
          if (user) {
              currentUser = user;
              isAuthenticated = true;
              
              // Save to localStorage
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
              localStorage.setItem('authToken', 'token_' + Date.now());
              
              if (rememberMe) {
                  localStorage.setItem('rememberMe', 'true');
              }
              
              showToast('Welcome back, ' + user.name.split(' ')[0] + '!', 'success');
              showMainApp();
          } else {
              showFormError('login-password', 'Invalid email or password');
              submitBtn.textContent = originalText;
              submitBtn.classList.remove('loading-btn');
          }
      }, 1500);
  }
  
  // Signup handler
  function handleSignup(event) {
      event.preventDefault();
      
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const agreeTerms = document.getElementById('terms-agree').checked;
      
      // Clear previous errors
      clearFormErrors();
      
      // Validate inputs
      let hasErrors = false;
      
      if (!name) {
          showFormError('signup-name', 'Full name is required');
          hasErrors = true;
      }
      
      if (!email) {
          showFormError('signup-email', 'Email is required');
          hasErrors = true;
      } else if (!validateEmail(email)) {
          showFormError('signup-email', 'Please enter a valid email address');
          hasErrors = true;
      } else if (userDatabase.find(u => u.email === email)) {
          showFormError('signup-email', 'This email is already registered');
          hasErrors = true;
      }
      
      if (!password) {
          showFormError('signup-password', 'Password is required');
          hasErrors = true;
      } else if (!validatePassword(password)) {
          showFormError('signup-password', 'Password must be at least 6 characters long');
          hasErrors = true;
      }
      
      if (password !== confirmPassword) {
          showFormError('confirm-password', 'Passwords do not match');
          hasErrors = true;
      }
      
      if (!agreeTerms) {
          showToast('Please agree to the Terms of Service', 'error');
          hasErrors = true;
      }
      
      if (hasErrors) return;
      
      // Show loading state
      const submitBtn = event.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating account...';
      submitBtn.classList.add('loading-btn');
      
      // Simulate API call
      setTimeout(() => {
          // Create new user
          const newUser = {
              id: userDatabase.length + 1,
              name: name,
              email: email,
              password: password // In real app, this would be hashed
          };
          
          userDatabase.push(newUser);
          currentUser = newUser;
          isAuthenticated = true;
          
          // Save to localStorage
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          localStorage.setItem('authToken', 'token_' + Date.now());
          
          showToast('Account created successfully! Welcome to PharmAssist!', 'success');
          showMainApp();
      }, 2000);
  }
  
  // Navigation functionality (existing code)
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
      if (!isAuthenticated) return;
      
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
  
  // Utility functions
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
      
      // Show toast
      setTimeout(() => {
          toast.classList.add('show');
      }, 10);
      
      // Remove after 5 seconds
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
  
  // Medication reminder simulation
  function checkMedicationReminders() {
      if (!isAuthenticated) return;
      
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
  
  // Initialize app features on load
  requestNotificationPermission();
  
  // Export functions for global access
  window.showScreen = showScreen;
  window.showAuthScreen = showAuthScreen;
  window.demoLogin = demoLogin;
  window.logout = logout;
  window.sendMessage = sendMessage;
  window.sendQuickMessage = sendQuickMessage;
