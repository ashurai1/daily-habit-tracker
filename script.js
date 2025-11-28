/**
 * ============================================
 * Daily Habit Tracker - JavaScript
 * Complete Application Logic with Animations
 * ============================================
 */

// ============================================
// Global State Management
// ============================================
const state = {
    habits: [],
    completions: {}, // { 'YYYY-MM-DD': { habitId: true/false } }
    streaks: {}, // { habitId: streakCount }
    theme: 'light',
    animationsEnabled: true,
    currentFilter: 7,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    hasSampleData: false
};

// Chart instances
let barChart = null;
let lineChart = null;

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeApp();
    setupEventListeners();
    applyTheme();
    updateGreeting();
    renderHabits();
    updateSummaryCards();
    updateProgressCircle();
    initializeCharts();
    renderCalendar();
    
    // Load sample data if first time user
    if (state.habits.length === 0) {
        loadSampleData();
    }
});

/**
 * Initialize application components
 */
function initializeApp() {
    // Set current date
    const dateElement = document.querySelector('.current-date');
    if (dateElement) {
        dateElement.textContent = formatDate(new Date());
    }
    
    // Initialize character counter
    const habitNameInput = document.getElementById('habit-name');
    if (habitNameInput) {
        habitNameInput.addEventListener('input', updateCharCount);
    }
    
    // Apply animations setting
    if (!state.animationsEnabled) {
        document.body.classList.add('no-animations');
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeToggleSetting = document.getElementById('theme-toggle-setting');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (themeToggleSetting) {
        themeToggleSetting.addEventListener('change', toggleTheme);
    }
    
    // Animations toggle
    const animationsToggle = document.getElementById('animations-toggle');
    if (animationsToggle) {
        animationsToggle.checked = state.animationsEnabled;
        animationsToggle.addEventListener('change', (e) => {
            state.animationsEnabled = e.target.checked;
            document.body.classList.toggle('no-animations', !state.animationsEnabled);
            saveToLocalStorage();
        });
    }
    
    // Add habit form
    const addHabitForm = document.getElementById('add-habit-form');
    if (addHabitForm) {
        addHabitForm.addEventListener('submit', handleAddHabit);
    }
    
    // Edit habit form
    const editHabitForm = document.getElementById('edit-habit-form');
    if (editHabitForm) {
        editHabitForm.addEventListener('submit', handleEditHabit);
    }
    
    // Clear demo data
    const clearDemoBtn = document.getElementById('clear-demo-btn');
    if (clearDemoBtn) {
        clearDemoBtn.addEventListener('click', clearSampleData);
    }
    
    // Analytics filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.currentFilter = parseInt(e.target.dataset.filter);
            updateCharts();
        });
    });
    
    // Calendar navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            state.currentMonth--;
            if (state.currentMonth < 0) {
                state.currentMonth = 11;
                state.currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            state.currentMonth++;
            if (state.currentMonth > 11) {
                state.currentMonth = 0;
                state.currentYear++;
            }
            renderCalendar();
        });
    }
    
    // Settings buttons
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const importInput = document.getElementById('import-file-input');
    const resetBtn = document.getElementById('reset-data-btn');
    
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (importBtn) importBtn.addEventListener('click', () => importInput.click());
    if (importInput) importInput.addEventListener('change', importData);
    if (resetBtn) resetBtn.addEventListener('click', () => {
        showConfirmModal('Are you sure you want to reset all data? This action cannot be undone.', resetAllData);
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

// ============================================
// Navigation
// ============================================
function handleNavigation(e) {
    e.preventDefault();
    const targetSection = e.currentTarget.dataset.section;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show target section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const section = document.getElementById(targetSection);
    if (section) {
        section.classList.add('active');
        
        // Update charts if navigating to analytics
        if (targetSection === 'analytics') {
            updateCharts();
        }
        
        // Update calendar if navigating to calendar
        if (targetSection === 'calendar') {
            renderCalendar();
        }
    }
    
    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Theme Management
// ============================================
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveToLocalStorage();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    
    // Update theme toggle checkbox
    const themeToggleSetting = document.getElementById('theme-toggle-setting');
    if (themeToggleSetting) {
        themeToggleSetting.checked = state.theme === 'dark';
    }
    
    // Update charts colors
    if (barChart || lineChart) {
        updateCharts();
    }
}

// ============================================
// Greeting & Date
// ============================================
function updateGreeting() {
    const greetingElement = document.querySelector('.greeting');
    if (!greetingElement) return;
    
    const hour = new Date().getHours();
    let greeting = '';
    let emoji = '';
    
    if (hour < 12) {
        greeting = 'Good Morning';
        emoji = '🌅';
    } else if (hour < 18) {
        greeting = 'Good Afternoon';
        emoji = '☀️';
    } else {
        greeting = 'Good Evening';
        emoji = '🌙';
    }
    
    greetingElement.textContent = `${emoji} ${greeting}!`;
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// ============================================
// Habit Management
// ============================================
function handleAddHabit(e) {
    e.preventDefault();
    
    const name = document.getElementById('habit-name').value.trim();
    const category = document.getElementById('habit-category').value;
    const difficulty = document.getElementById('habit-difficulty').value;
    const marks = parseInt(document.getElementById('habit-marks').value);
    
    if (!name) {
        showMessage('Please enter a habit name');
        return;
    }
    
    const habit = {
        id: Date.now().toString(),
        name,
        category,
        difficulty,
        marks,
        createdDate: new Date().toISOString(),
        archived: false
    };
    
    state.habits.push(habit);
    state.streaks[habit.id] = 0;
    
    saveToLocalStorage();
    renderHabits();
    updateSummaryCards();
    updateProgressCircle();
    
    // Reset form
    e.target.reset();
    document.querySelector('.char-count').textContent = '0/50';
    
    // Show success message
    showMessage('Habit added successfully! 🎉');
    
    // Navigate to home
    setTimeout(() => {
        document.querySelector('[data-section="home"]').click();
    }, 1000);
}

function editHabit(habitId) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Populate edit form
    document.getElementById('edit-habit-id').value = habit.id;
    document.getElementById('edit-habit-name').value = habit.name;
    document.getElementById('edit-habit-category').value = habit.category;
    document.getElementById('edit-habit-difficulty').value = habit.difficulty;
    document.getElementById('edit-habit-marks').value = habit.marks;
    
    // Show modal
    showModal('edit-modal');
}

function handleEditHabit(e) {
    e.preventDefault();
    
    const habitId = document.getElementById('edit-habit-id').value;
    const habit = state.habits.find(h => h.id === habitId);
    
    if (!habit) return;
    
    habit.name = document.getElementById('edit-habit-name').value.trim();
    habit.category = document.getElementById('edit-habit-category').value;
    habit.difficulty = document.getElementById('edit-habit-difficulty').value;
    habit.marks = parseInt(document.getElementById('edit-habit-marks').value);
    
    saveToLocalStorage();
    renderHabits();
    updateSummaryCards();
    closeAllModals();
    
    showMessage('Habit updated successfully! ✨');
}

function deleteHabit(habitId) {
    showConfirmModal('Are you sure you want to delete this habit?', () => {
        state.habits = state.habits.filter(h => h.id !== habitId);
        delete state.streaks[habitId];
        
        // Remove from completions
        Object.keys(state.completions).forEach(date => {
            delete state.completions[date][habitId];
        });
        
        saveToLocalStorage();
        renderHabits();
        updateSummaryCards();
        updateProgressCircle();
        updateCharts();
        
        showMessage('Habit deleted successfully');
    });
}

function archiveHabit(habitId) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    habit.archived = !habit.archived;
    
    saveToLocalStorage();
    renderHabits();
    updateSummaryCards();
    
    const message = habit.archived ? 'Habit archived' : 'Habit restored';
    showMessage(message);
}

// ============================================
// Habit Rendering
// ============================================
function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!habitsList) return;
    
    const activeHabits = state.habits.filter(h => !h.archived);
    
    if (activeHabits.length === 0) {
        habitsList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    const today = getTodayString();
    if (!state.completions[today]) {
        state.completions[today] = {};
    }
    
    habitsList.innerHTML = activeHabits.map(habit => {
        const isCompleted = state.completions[today][habit.id] || false;
        const streak = state.streaks[habit.id] || 0;
        
        return `
            <div class="habit-item ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                <label class="habit-checkbox">
                    <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleHabitCompletion('${habit.id}')">
                    <span class="checkbox-custom"></span>
                </label>
                
                <div class="habit-info">
                    <div class="habit-header">
                        <h4 class="habit-name">${habit.name}</h4>
                        <div class="habit-badges">
                            <span class="badge badge-category">${getCategoryEmoji(habit.category)} ${habit.category}</span>
                            <span class="badge badge-difficulty ${habit.difficulty.toLowerCase()}">${habit.difficulty}</span>
                        </div>
                    </div>
                    <div class="habit-meta">
                        <span>⭐ ${habit.marks} points</span>
                        <span>🔥 ${streak} day streak</span>
                    </div>
                </div>
                
                <div class="habit-actions">
                    <button class="btn-icon-only edit" onclick="editHabit('${habit.id}')" aria-label="Edit habit" title="Edit">
                        ✏️
                    </button>
                    <button class="btn-icon-only archive" onclick="archiveHabit('${habit.id}')" aria-label="Archive habit" title="Archive">
                        📦
                    </button>
                    <button class="btn-icon-only delete" onclick="deleteHabit('${habit.id}')" aria-label="Delete habit" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Show/hide clear demo button
    const clearDemoBtn = document.getElementById('clear-demo-btn');
    if (clearDemoBtn) {
        clearDemoBtn.style.display = state.hasSampleData ? 'inline-flex' : 'none';
    }
}

function getCategoryEmoji(category) {
    const emojis = {
        'Health': '🏃',
        'Study': '📚',
        'Work': '💼',
        'Personal': '🌟',
        'Fitness': '💪',
        'Mindfulness': '🧘',
        'Other': '📌'
    };
    return emojis[category] || '📌';
}

// ============================================
// Habit Completion
// ============================================
function toggleHabitCompletion(habitId) {
    const today = getTodayString();
    
    if (!state.completions[today]) {
        state.completions[today] = {};
    }
    
    state.completions[today][habitId] = !state.completions[today][habitId];
    
    // Update streak
    updateStreaks();
    
    saveToLocalStorage();
    renderHabits();
    updateSummaryCards();
    updateProgressCircle();
    updateCharts();
    
    // Check if all habits are completed
    checkAllHabitsComplete();
}

function updateStreaks() {
    const today = new Date();
    const activeHabits = state.habits.filter(h => !h.archived);
    
    activeHabits.forEach(habit => {
        let streak = 0;
        let currentDate = new Date(today);
        
        // Count consecutive days from today backwards
        while (true) {
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            
            if (state.completions[dateString] && state.completions[dateString][habit.id]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        state.streaks[habit.id] = streak;
    });
}

// ============================================
// Summary & Statistics
// ============================================
function updateSummaryCards() {
    const activeHabits = state.habits.filter(h => !h.archived);
    const today = getTodayString();
    const todayCompletions = state.completions[today] || {};
    
    const totalHabits = activeHabits.length;
    const completedHabits = activeHabits.filter(h => todayCompletions[h.id]).length;
    const pendingHabits = totalHabits - completedHabits;
    
    // Calculate today's score
    const todayScore = activeHabits.reduce((score, habit) => {
        if (todayCompletions[habit.id]) {
            return score + habit.marks;
        }
        return score;
    }, 0);
    
    // Get best streak
    const bestStreak = Math.max(0, ...Object.values(state.streaks));
    
    // Calculate weekly average
    const weeklyAverage = calculateWeeklyAverage();
    
    // Update DOM
    document.getElementById('total-habits').textContent = totalHabits;
    document.getElementById('completed-habits').textContent = completedHabits;
    document.getElementById('pending-habits').textContent = pendingHabits;
    document.getElementById('today-score').textContent = todayScore;
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('weekly-average').textContent = `${weeklyAverage}%`;
}

function updateProgressCircle() {
    const activeHabits = state.habits.filter(h => !h.archived);
    const today = getTodayString();
    const todayCompletions = state.completions[today] || {};
    
    const totalHabits = activeHabits.length;
    const completedHabits = activeHabits.filter(h => todayCompletions[h.id]).length;
    
    const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
    
    // Update progress ring
    const progressRing = document.querySelector('.progress-ring-fill');
    if (progressRing) {
        const circumference = 2 * Math.PI * 90; // radius = 90
        const offset = circumference - (percentage / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
    }
    
    // Update percentage text
    const progressPercentage = document.querySelector('.progress-percentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
}

function calculateWeeklyAverage() {
    const activeHabits = state.habits.filter(h => !h.archived);
    if (activeHabits.length === 0) return 0;
    
    let totalPercentage = 0;
    let daysCount = 0;
    
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        const dayCompletions = state.completions[dateString] || {};
        const completed = activeHabits.filter(h => dayCompletions[h.id]).length;
        const percentage = (completed / activeHabits.length) * 100;
        
        totalPercentage += percentage;
        daysCount++;
    }
    
    return Math.round(totalPercentage / daysCount);
}

// ============================================
// Confetti & Celebrations
// ============================================
function checkAllHabitsComplete() {
    const activeHabits = state.habits.filter(h => !h.archived);
    const today = getTodayString();
    const todayCompletions = state.completions[today] || {};
    
    const allComplete = activeHabits.length > 0 && activeHabits.every(h => todayCompletions[h.id]);
    
    if (allComplete) {
        triggerConfetti();
        showMessage('🎉 Amazing! You completed all your habits today! You\'re crushing it! 🎉');
    }
}

function triggerConfetti() {
    if (!state.animationsEnabled) return;
    
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const confettiCount = 150;
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    let animationFrame;
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(c.d);
            c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;
            
            if (c.y > canvas.height) {
                confetti[i] = {
                    ...c,
                    x: Math.random() * canvas.width,
                    y: -20
                };
            }
        });
        
        animationFrame = requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    
    // Stop after 5 seconds
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

// ============================================
// Charts & Analytics
// ============================================
function initializeCharts() {
    const barCtx = document.getElementById('bar-chart');
    const lineCtx = document.getElementById('line-chart');
    
    if (!barCtx || !lineCtx) return;
    
    const isDark = state.theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)';
    
    // Bar Chart
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Score',
                data: [],
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: { family: 'Inter', size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
    
    // Line Chart
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Completion %',
                data: [],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgba(16, 185, 129, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: { family: 'Inter', size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { 
                        color: textColor,
                        callback: value => value + '%'
                    },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
    
    updateCharts();
}

function updateCharts() {
    if (!barChart || !lineChart) return;
    
    const days = state.currentFilter;
    const labels = [];
    const scores = [];
    const percentages = [];
    
    const activeHabits = state.habits.filter(h => !h.archived);
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // Format label
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        labels.push(label);
        
        // Calculate score
        const dayCompletions = state.completions[dateString] || {};
        const score = activeHabits.reduce((total, habit) => {
            if (dayCompletions[habit.id]) {
                return total + habit.marks;
            }
            return total;
        }, 0);
        scores.push(score);
        
        // Calculate percentage
        const completed = activeHabits.filter(h => dayCompletions[h.id]).length;
        const percentage = activeHabits.length > 0 ? Math.round((completed / activeHabits.length) * 100) : 0;
        percentages.push(percentage);
    }
    
    // Update bar chart
    barChart.data.labels = labels;
    barChart.data.datasets[0].data = scores;
    barChart.update();
    
    // Update line chart
    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = percentages;
    lineChart.update();
    
    // Update analytics summary
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const avgScore = scores.length > 0 ? Math.round(totalScore / scores.length) : 0;
    const avgCompletion = percentages.length > 0 ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) : 0;
    
    document.getElementById('analytics-total-score').textContent = totalScore;
    document.getElementById('analytics-avg-score').textContent = avgScore;
    document.getElementById('analytics-completion-rate').textContent = `${avgCompletion}%`;
    document.getElementById('analytics-active-habits').textContent = activeHabits.length;
}

// ============================================
// Calendar
// ============================================
function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearElement = document.getElementById('calendar-month-year');
    
    if (!calendarGrid || !monthYearElement) return;
    
    const firstDay = new Date(state.currentYear, state.currentMonth, 1);
    const lastDay = new Date(state.currentYear, state.currentMonth + 1, 0);
    const prevLastDay = new Date(state.currentYear, state.currentMonth, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = `${monthNames[state.currentMonth]} ${state.currentYear}`;
    
    let days = '';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        days += `<div class="calendar-day header">${day}</div>`;
    });
    
    // Previous month days
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="calendar-day other-month">${prevLastDayDate - x + 1}</div>`;
    }
    
    // Current month days
    const today = new Date();
    const activeHabits = state.habits.filter(h => !h.archived);
    
    for (let i = 1; i <= lastDayDate; i++) {
        const dateString = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayCompletions = state.completions[dateString] || {};
        
        const completed = activeHabits.filter(h => dayCompletions[h.id]).length;
        const percentage = activeHabits.length > 0 ? (completed / activeHabits.length) * 100 : 0;
        
        let className = 'calendar-day';
        
        if (today.getDate() === i && today.getMonth() === state.currentMonth && today.getFullYear() === state.currentYear) {
            className += ' today';
        }
        
        if (percentage === 100) {
            className += ' complete-100';
        } else if (percentage >= 50) {
            className += ' complete-50';
        } else if (percentage > 0) {
            className += ' complete-partial';
        }
        
        days += `<div class="${className}" title="${Math.round(percentage)}% complete">${i}</div>`;
    }
    
    // Next month days
    const nextDays = 7 - ((firstDayIndex + lastDayDate) % 7);
    if (nextDays < 7) {
        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="calendar-day other-month">${j}</div>`;
        }
    }
    
    calendarGrid.innerHTML = days;
}

// ============================================
// Sample Data
// ============================================
function loadSampleData() {
    state.hasSampleData = true;
    
    const sampleHabits = [
        { name: 'Drink 2L Water', category: 'Health', difficulty: 'Easy', marks: 5 },
        { name: 'Study for 1 hour', category: 'Study', difficulty: 'Medium', marks: 10 },
        { name: 'Exercise 20 minutes', category: 'Fitness', difficulty: 'Medium', marks: 10 },
        { name: 'Meditate 10 minutes', category: 'Mindfulness', difficulty: 'Easy', marks: 5 },
        { name: 'Read 30 pages', category: 'Personal', difficulty: 'Medium', marks: 8 },
        { name: 'No social media before bed', category: 'Personal', difficulty: 'Hard', marks: 15 }
    ];
    
    sampleHabits.forEach(habit => {
        const newHabit = {
            id: Date.now().toString() + Math.random(),
            name: habit.name,
            category: habit.category,
            difficulty: habit.difficulty,
            marks: habit.marks,
            createdDate: new Date().toISOString(),
            archived: false
        };
        state.habits.push(newHabit);
        state.streaks[newHabit.id] = 0;
    });
    
    // Add some historical completions
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        state.completions[dateString] = {};
        
        state.habits.forEach(habit => {
            // Random completion (70% chance)
            if (Math.random() > 0.3) {
                state.completions[dateString][habit.id] = true;
            }
        });
    }
    
    updateStreaks();
    saveToLocalStorage();
    renderHabits();
    updateSummaryCards();
    updateProgressCircle();
    updateCharts();
}

function clearSampleData() {
    showConfirmModal('Clear all demo data?', () => {
        state.habits = [];
        state.completions = {};
        state.streaks = {};
        state.hasSampleData = false;
        
        saveToLocalStorage();
        renderHabits();
        updateSummaryCards();
        updateProgressCircle();
        updateCharts();
        renderCalendar();
    });
}

// ============================================
// Data Management
// ============================================
function saveToLocalStorage() {
    try {
        localStorage.setItem('habitTrackerState', JSON.stringify(state));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('habitTrackerState');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(state, loaded);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showMessage('Data exported successfully! 📥');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            
            // Validate data structure
            if (imported.habits && Array.isArray(imported.habits)) {
                Object.assign(state, imported);
                saveToLocalStorage();
                
                renderHabits();
                updateSummaryCards();
                updateProgressCircle();
                updateCharts();
                renderCalendar();
                applyTheme();
                
                showMessage('Data imported successfully! 📤');
            } else {
                showMessage('Invalid data format');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            showMessage('Error importing data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset input
}

function resetAllData() {
    state.habits = [];
    state.completions = {};
    state.streaks = {};
    state.hasSampleData = false;
    
    localStorage.removeItem('habitTrackerState');
    
    renderHabits();
    updateSummaryCards();
    updateProgressCircle();
    updateCharts();
    renderCalendar();
    
    closeAllModals();
    showMessage('All data has been reset');
}

// ============================================
// Modals
// ============================================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const messageElement = document.getElementById('confirm-message');
    const confirmButton = document.getElementById('confirm-action');
    
    if (!modal || !messageElement || !confirmButton) return;
    
    messageElement.textContent = message;
    
    // Remove old listeners
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    
    // Add new listener
    newConfirmButton.addEventListener('click', () => {
        onConfirm();
        closeAllModals();
    });
    
    showModal('confirm-modal');
}

function showMessage(message) {
    const modal = document.getElementById('message-modal');
    const messageElement = document.getElementById('message-text');
    
    if (!modal || !messageElement) return;
    
    messageElement.textContent = message;
    showModal('message-modal');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closeAllModals();
    }, 3000);
}

// ============================================
// Utility Functions
// ============================================
function updateCharCount() {
    const input = document.getElementById('habit-name');
    const counter = document.querySelector('.char-count');
    
    if (input && counter) {
        counter.textContent = `${input.value.length}/50`;
    }
}

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', (e) => {
    // Close modals on Escape
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// ============================================
// Resize Handler for Charts
// ============================================
window.addEventListener('resize', () => {
    if (barChart) barChart.resize();
    if (lineChart) lineChart.resize();
});
