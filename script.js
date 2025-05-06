
        document.addEventListener('DOMContentLoaded', function() {
            // ========== VARIABLES ==========
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');
            const form = document.getElementById('adventure-form');
            const successMessage = document.getElementById('success-message');
            const secretFeature = document.getElementById('secret-feature');
            
            // Gallery variables
            const galleryImages = document.querySelectorAll('.gallery-image');
            const galleryCaption = document.querySelector('.gallery-caption');
            const prevButton = document.getElementById('prev-destination');
            const nextButton = document.getElementById('next-destination');
            let currentImageIndex = 0;
            
            // Activity selection variables
            const activityCards = document.querySelectorAll('.activity-card');
            const activitiesInput = document.getElementById('activities');
            const selectedActivities = new Set();
            
            // ========== TAB NAVIGATION ==========
            // Handle tab navigation
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    
                    // Remove active class from all tabs
                    tabButtons.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to selected tab
                    button.classList.add('active');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });
            
            // Next button handlers
            document.getElementById('personal-next').addEventListener('click', () => {
                if (validatePersonalTab()) {
                    activateTab('destination');
                }
            });
            
            document.getElementById('destination-next').addEventListener('click', () => {
                if (validateDestinationTab()) {
                    activateTab('activities');
                }
            });
            
            document.getElementById('activities-next').addEventListener('click', () => {
                if (validateActivitiesTab()) {
                    activateTab('account');
                }
            });
            
            // Previous button handlers
            document.getElementById('destination-prev').addEventListener('click', () => {
                activateTab('personal');
            });
            
            document.getElementById('activities-prev').addEventListener('click', () => {
                activateTab('destination');
            });
            
            document.getElementById('account-prev').addEventListener('click', () => {
                activateTab('activities');
            });
            
            // Function to activate a specific tab
            function activateTab(tabId) {
                tabButtons.forEach(button => {
                    if (button.getAttribute('data-tab') === tabId) {
                        button.click();
                    }
                });
            }
            
            // ========== IMAGE GALLERY ==========
            // Gallery navigation
            function showImage(index) {
                // Remove active class from all images
                galleryImages.forEach(img => img.classList.remove('active'));
                
                // Add active class to current image
                galleryImages[index].classList.add('active');
                
                // Update caption
                galleryCaption.textContent = galleryImages[index].getAttribute('data-name');
                
                // Update destination input
                document.getElementById('destination').value = galleryImages[index].getAttribute('data-name');
            }
            
            // Previous button
            prevButton.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                showImage(currentImageIndex);
            });
            
            // Next button
            nextButton.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                showImage(currentImageIndex);
            });
            
            // ========== ACTIVITY SELECTION ==========
            // Handle activity selection
            activityCards.forEach(card => {
                card.addEventListener('click', () => {
                    const activity = card.getAttribute('data-activity');
                    
                    if (card.classList.contains('selected')) {
                        // Remove activity
                        card.classList.remove('selected');
                        selectedActivities.delete(activity);
                    } else {
                        // Add activity
                        card.classList.add('selected');
                        selectedActivities.add(activity);
                    }
                    
                    // Update activities input
                    activitiesInput.value = Array.from(selectedActivities).join(', ');
                    
                    // Hide error message if at least one activity is selected
                    if (selectedActivities.size > 0) {
                        document.getElementById('activities-error').classList.remove('show-error');
                    }
                });
            });
            
            // ========== FORM VALIDATION ==========
            // Set minimum date to today
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            document.getElementById('date').min = formattedDate;
            
            // Validate personal tab
            function validatePersonalTab() {
                let isValid = true;
                
                // Validate name
                const name = document.getElementById('name');
                if (name.value.trim() === '') {
                    showError(name, 'name-error');
                    isValid = false;
                } else {
                    hideError(name, 'name-error');
                }
                
                // Validate email
                const email = document.getElementById('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value)) {
                    showError(email, 'email-error');
                    isValid = false;
                } else {
                    hideError(email, 'email-error');
                }
                
                // Validate phone (optional)
                const phone = document.getElementById('phone');
                if (phone.value.trim() !== '') {
                    const phoneRegex = /^\d{10,15}$/;
                    if (!phoneRegex.test(phone.value.replace(/[-()\s]/g, ''))) {
                        showError(phone, 'phone-error');
                        isValid = false;
                    } else {
                        hideError(phone, 'phone-error');
                    }
                }
                
                // Validate date
                const date = document.getElementById('date');
                if (date.value === '') {
                    showError(date, 'date-error');
                    isValid = false;
                } else {
                    hideError(date, 'date-error');
                }
                
                return isValid;
            }
            
            // Validate destination tab
            function validateDestinationTab() {
                let isValid = true;
                
                // Validate duration
                const duration = document.getElementById('duration');
                if (duration.value < 1 || duration.value > 30) {
                    showError(duration, 'duration-error');
                    isValid = false;
                } else {
                    hideError(duration, 'duration-error');
                }
                
                return isValid;
            }
            
            // Validate activities tab
            function validateActivitiesTab() {
                let isValid = true;
                
                // Validate activities
                if (selectedActivities.size === 0) {
                    document.getElementById('activities-error').classList.add('show-error');
                    isValid = false;
                } else {
                    document.getElementById('activities-error').classList.remove('show-error');
                }
                
                return isValid;
            }
            
            // Validate account tab
            function validateAccountTab() {
                let isValid = true;
                
                // Validate username
                const username = document.getElementById('username');
                if (username.value.length < 4) {
                    showError(username, 'username-error');
                    isValid = false;
                } else {
                    hideError(username, 'username-error');
                }
                
                // Validate password
                const password = document.getElementById('password');
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
                if (!passwordRegex.test(password.value)) {
                    showError(password, 'password-error');
                    isValid = false;
                } else {
                    hideError(password, 'password-error');
                }
                
                // Validate confirm password
                const confirmPassword = document.getElementById('confirm-password');
                if (password.value !== confirmPassword.value) {
                    showError(confirmPassword, 'confirm-password-error');
                    isValid = false;
                } else {
                    hideError(confirmPassword, 'confirm-password-error');
                }
                
                // Validate terms
                const terms = document.getElementById('terms');
                if (!terms.checked) {
                    document.getElementById('terms-error').classList.add('show-error');
                    isValid = false;
                } else {
                    document.getElementById('terms-error').classList.remove('show-error');
                }
                
                return isValid;
            }
            
            // Helper functions for form validation
            function showError(input, errorId) {
                input.classList.add('error');
                document.getElementById(errorId).classList.add('show-error');
            }
            
            function hideError(input, errorId) {
                input.classList.remove('error');
                document.getElementById(errorId).classList.remove('show-error');
            }
            
            // ========== REAL-TIME FORM VALIDATION ==========
            // Real-time email validation
            document.getElementById('email').addEventListener('input', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    showError(this, 'email-error');
                } else {
                    hideError(this, 'email-error');
                }
            });
            
            // Real-time password strength validation
            const passwordInput = document.getElementById('password');
            const strengthBar = document.querySelector('.password-strength');
            const strengthText = document.querySelector('.strength-text');
            
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                // Check length
                if (password.length >= 8) {
                    strength += 1;
                }
                
                // Check for numbers
                if (/\d/.test(password)) {
                    strength += 1;
                }
                
                // Check for special characters
                if (/[!@#$%^&*]/.test(password)) {
                    strength += 1;
                }
                
                // Update strength bar and text
                strengthBar.className = 'password-strength';
                if (strength === 0) {
                    strengthBar.classList.add('weak');
                    strengthText.textContent = 'Weak password';
                } else if (strength === 1) {
                    strengthBar.classList.add('weak');
                    strengthText.textContent = 'Weak password';
                } else if (strength === 2) {
                    strengthBar.classList.add('medium');
                    strengthText.textContent = 'Medium strength password';
                } else {
                    strengthBar.classList.add('strong');
                    strengthText.textContent = 'Strong password';
                }
                
                // Validate against password requirements
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
                if (this.value && !passwordRegex.test(this.value)) {
                    showError(this, 'password-error');
                } else {
                    hideError(this, 'password-error');
                }
            });
            
            // Real-time confirm password validation
            document.getElementById('confirm-password').addEventListener('input', function() {
                const password = document.getElementById('password').value;
                if (this.value && this.value !== password) {
                    showError(this, 'confirm-password-error');
                } else {
                    hideError(this, 'confirm-password-error');
                }
            });
            
            // ========== FORM SUBMISSION ==========
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate all tabs
                const personalValid = validatePersonalTab();
                const destinationValid = validateDestinationTab();
                const activitiesValid = validateActivitiesTab();
                const accountValid = validateAccountTab();
                
                if (personalValid && destinationValid && activitiesValid && accountValid) {
                    // Show success message
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Add confetti animation
                    createConfetti();
                } else {
                    // Show the tab with errors
                    if (!accountValid) {
                        activateTab('account');
                    } else if (!activitiesValid) {
                        activateTab('activities');
                    } else if (!destinationValid) {
                        activateTab('destination');
                    } else {
                        activateTab('personal');
                    }
                }
            });
            
            // Start over button
            document.getElementById('start-over').addEventListener('click', function() {
                // Reset form
                form.reset();
                
                // Reset activities
                selectedActivities.clear();
                activityCards.forEach(card => card.classList.remove('selected'));
                activitiesInput.value = '';
                
                // Reset gallery
                currentImageIndex = 0;
                showImage(currentImageIndex);
                
                // Reset password strength
                strengthBar.className = 'password-strength';
                strengthText.textContent = '';
                
                // Show form and hide success message
                form.style.display = 'block';
                successMessage.style.display = 'none';
                
                // Show first tab
                activateTab('personal');
            });
            
            // ========== SECRET FEATURE (DOUBLE-CLICK) ==========
            // Double-click on the title reveals a secret discount
            document.querySelector('h1').addEventListener('dblclick', function() {
                secretFeature.classList.add('show');
                
                // Add some animation
                this.style.color = '#e67e22';
                setTimeout(() => {
                    this.style.color = '';
                }, 1000);
            });
            
            // Long press also reveals the secret feature (for mobile)
            let pressTimer;
            document.querySelector('h1').addEventListener('mousedown', function() {
                pressTimer = window.setTimeout(() => {
                    secretFeature.classList.add('show');
                }, 1000);
            });
            
            document.querySelector('h1').addEventListener('mouseup', function() {
                clearTimeout(pressTimer);
            });
            
            // Close secret feature
            document.getElementById('secret-close').addEventListener('click', function() {
                secretFeature.classList.remove('show');
            });
            
            // ========== KEYBOARD NAVIGATION ==========
            // Handle keyboard navigation
            document.addEventListener('keydown', function(e) {
                // Arrow right to move to next tab
                if (e.key === 'ArrowRight') {
                    const activeTab = document.querySelector('.tab-button.active');
                    const nextTab = activeTab.nextElementSibling;
                    if (nextTab && nextTab.classList.contains('tab-button')) {
                        nextTab.click();
                    }
                }
                
                // Arrow left to move to previous tab
                if (e.key === 'ArrowLeft') {
                    const activeTab = document.querySelector('.tab-button.active');
                    const prevTab = activeTab.previousElementSibling;
                    if (prevTab && prevTab.classList.contains('tab-button')) {
                        prevTab.click();
                    }
                }
                
                // Escape to close secret feature
                if (e.key === 'Escape') {
                    secretFeature.classList.remove('show');
                }
            });
            
            // ========== CONFETTI ANIMATION ==========
            function createConfetti() {
                const colors = ['#3498db', '#2ecc71', '#e67e22', '#e74c3c', '#9b59b6'];
                const confettiCount = 100;
                
                for (let i = 0; i < confettiCount; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.animationDelay = Math.random() * 3 + 's';
                    
                    document.body.appendChild(confetti);
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove();
                    }, 6000);
                }
            }
            
            // ========== HOVER EFFECTS ==========
            // Add hover effect to container
            const container = document.querySelector('.container');
            container.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            container.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
   