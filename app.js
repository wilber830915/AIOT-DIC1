/**
 * Personal Space & Real-Time Precision Clock
 * Pure vanilla JavaScript with zero external dependencies
 */

(function () {
  'use strict';

  // =========================================================================
  // State & Persistence
  // =========================================================================
  const state = {
    is12Hour: localStorage.getItem('pref_time_format') === '12h',
    theme: localStorage.getItem('pref_theme') || 'theme-aurora',
    profile: {
      name: (() => {
        const stored = localStorage.getItem('profile_name');
        return (!stored || stored === 'Alex Chen') ? 'Wilber WEN' : stored;
      })(),
      role: localStorage.getItem('profile_role') || 'Creative Technologist & Explorer',
      bio: localStorage.getItem('profile_bio') || 'Building thoughtful digital experiences and exploring modern interfaces at the edge of craft.'
    },
    currentQuoteIndex: 0
  };

  const quotes = [
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" },
    { text: "Make each day your masterpiece.", author: "John Wooden" },
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" }
  ];

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const el = {
    // Clock
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    ampm: document.getElementById('ampm-indicator'),
    currentDate: document.getElementById('current-date'),
    currentTimezone: document.getElementById('current-timezone'),
    dayProgressBar: document.getElementById('day-progress-bar'),
    dayProgressPercent: document.getElementById('day-progress-percent'),
    greetingText: document.getElementById('greeting-text'),
    greetingIcon: document.getElementById('greeting-icon'),
    formatToggle: document.getElementById('format-toggle'),
    formatLabel: document.getElementById('format-label'),
    copyTimeBtn: document.getElementById('copy-time-btn'),

    // World Cities
    cityNy: document.getElementById('city-ny'),
    cityLon: document.getElementById('city-lon'),
    cityTokyo: document.getElementById('city-tokyo'),
    citySydney: document.getElementById('city-sydney'),

    // Profile
    userNameDisplay: document.getElementById('user-name-display'),
    userRoleDisplay: document.getElementById('user-role-display'),
    userBioDisplay: document.getElementById('user-bio-display'),
    avatarInitials: document.getElementById('avatar-initials'),
    avatarContainer: document.getElementById('avatar-container'),
    editNameTrigger: document.getElementById('edit-name-trigger'),
    quickEmailBtn: document.getElementById('quick-email-btn'),

    // Modal
    editModal: document.getElementById('edit-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalCancelBtn: document.getElementById('modal-cancel-btn'),
    profileForm: document.getElementById('profile-form'),
    inputName: document.getElementById('input-name'),
    inputRole: document.getElementById('input-role'),
    inputBio: document.getElementById('input-bio'),

    // Quote
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    refreshQuoteBtn: document.getElementById('refresh-quote-btn'),

    // Themes & Extras
    themeButtons: document.querySelectorAll('.theme-btn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    currentYear: document.getElementById('current-year')
  };

  // =========================================================================
  // Clock & Time Calculations
  // =========================================================================

  function getInitials(name) {
    if (!name || !name.trim()) return 'ME';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getGreeting(hour, name) {
    let greeting = '';
    let icon = '✨';

    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning';
      icon = '🌅';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon';
      icon = '☀️';
    } else if (hour >= 17 && hour < 22) {
      greeting = 'Good Evening';
      icon = '🌆';
    } else {
      greeting = 'Night Owl Hours';
      icon = '🌙';
    }

    const firstName = (name || '').trim().split(' ')[0] || 'Friend';
    return {
      text: `${greeting}, ${firstName}`,
      icon: icon
    };
  }

  function updateClock() {
    const now = new Date();
    const rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();

    // 12h vs 24h format
    let displayHours = rawHours;
    let ampmText = '';

    if (state.is12Hour) {
      ampmText = rawHours >= 12 ? 'PM' : 'AM';
      displayHours = rawHours % 12 || 12;
    }

    const hoursStr = String(displayHours).padStart(2, '0');
    const minutesStr = String(rawMinutes).padStart(2, '0');
    const secondsStr = String(rawSeconds).padStart(2, '0');

    // Only update if changed to avoid unnecessary repaints
    if (el.hours && el.hours.textContent !== hoursStr) el.hours.textContent = hoursStr;
    if (el.minutes && el.minutes.textContent !== minutesStr) el.minutes.textContent = minutesStr;
    if (el.seconds && el.seconds.textContent !== secondsStr) el.seconds.textContent = secondsStr;
    if (el.ampm && el.ampm.textContent !== ampmText) el.ampm.textContent = ampmText;

    // Dynamic greeting based on the hour
    const greetingData = getGreeting(rawHours, state.profile.name);
    if (el.greetingText && el.greetingText.textContent !== greetingData.text) {
      el.greetingText.textContent = greetingData.text;
      el.greetingIcon.textContent = greetingData.icon;
    }

    // Day elapsed percentage (0-100%)
    const secondsToday = (rawHours * 3600) + (rawMinutes * 60) + rawSeconds;
    const dayProgress = ((secondsToday / 86400) * 100).toFixed(1);
    if (el.dayProgressBar) el.dayProgressBar.style.width = `${dayProgress}%`;
    if (el.dayProgressPercent) el.dayProgressPercent.textContent = `${dayProgress}% completed`;

    // World Cities (time zone preview)
    updateWorldCities(now);
  }

  function updateWorldCities(now) {
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: state.is12Hour
    };

    try {
      if (el.cityNy) el.cityNy.textContent = now.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'America/New_York' });
      if (el.cityLon) el.cityLon.textContent = now.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'Europe/London' });
      if (el.cityTokyo) el.cityTokyo.textContent = now.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'Asia/Tokyo' });
      if (el.citySydney) el.citySydney.textContent = now.toLocaleTimeString('en-US', { ...timeOptions, timeZone: 'Australia/Sydney' });
    } catch (e) {
      // Graceful fallback if environment lacks timezone DB
    }
  }

  function updateStaticMeta() {
    const now = new Date();

    // Localized Date
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    if (el.currentDate) {
      el.currentDate.textContent = now.toLocaleDateString(undefined, dateOptions);
    }

    // Timezone Info
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const remMinutes = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const gmtString = `UTC${sign}${offsetHours}${remMinutes > 0 ? ':' + remMinutes : ''}`;
      if (el.currentTimezone) {
        el.currentTimezone.textContent = `${tz} (${gmtString})`;
      }
    } catch (e) {
      if (el.currentTimezone) {
        el.currentTimezone.textContent = 'Local Time';
      }
    }

    if (el.currentYear) {
      el.currentYear.textContent = now.getFullYear();
    }
  }

  // =========================================================================
  // Profile Management
  // =========================================================================

  function renderProfile() {
    if (el.userNameDisplay) el.userNameDisplay.textContent = state.profile.name;
    if (el.userRoleDisplay) el.userRoleDisplay.textContent = state.profile.role;
    if (el.userBioDisplay) el.userBioDisplay.textContent = state.profile.bio;
    if (el.avatarInitials) el.avatarInitials.textContent = getInitials(state.profile.name);

    // Update form values
    if (el.inputName) el.inputName.value = state.profile.name;
    if (el.inputRole) el.inputRole.value = state.profile.role;
    if (el.inputBio) el.inputBio.value = state.profile.bio;
  }

  function openEditModal() {
    if (!el.editModal) return;
    el.inputName.value = state.profile.name;
    el.inputRole.value = state.profile.role;
    el.inputBio.value = state.profile.bio;
    el.editModal.classList.add('open');
    setTimeout(() => {
      if (el.inputName) el.inputName.focus();
    }, 150);
  }

  function closeEditModal() {
    if (el.editModal) {
      el.editModal.classList.remove('open');
    }
  }

  function saveProfile(e) {
    e.preventDefault();
    const newName = el.inputName.value.trim() || 'Wilber WEN';
    const newRole = el.inputRole.value.trim() || 'Creative Technologist';
    const newBio = el.inputBio.value.trim() || 'Building thoughtful digital experiences.';

    state.profile.name = newName;
    state.profile.role = newRole;
    state.profile.bio = newBio;

    localStorage.setItem('profile_name', newName);
    localStorage.setItem('profile_role', newRole);
    localStorage.setItem('profile_bio', newBio);

    renderProfile();
    updateClock();
    closeEditModal();
    showToast(`Saved! Welcome, ${newName}.`);
  }

  // =========================================================================
  // Time Format Toggle
  // =========================================================================

  function toggleFormat() {
    state.is12Hour = !state.is12Hour;
    localStorage.setItem('pref_time_format', state.is12Hour ? '12h' : '24h');
    applyFormatState();
    updateClock();
    showToast(`Switched to ${state.is12Hour ? '12-Hour (AM/PM)' : '24-Hour'} format`);
  }

  function applyFormatState() {
    if (!el.formatToggle || !el.formatLabel) return;
    if (state.is12Hour) {
      el.formatToggle.classList.add('is-12h');
      el.formatLabel.textContent = '12H';
    } else {
      el.formatToggle.classList.remove('is-12h');
      el.formatLabel.textContent = '24H';
    }
  }

  // =========================================================================
  // Theme Switching
  // =========================================================================

  function applyTheme(themeName) {
    document.body.className = themeName;
    state.theme = themeName;
    localStorage.setItem('pref_theme', themeName);

    if (el.themeButtons) {
      el.themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === themeName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // =========================================================================
  // Toast & Utilities
  // =========================================================================

  let toastTimer = null;
  function showToast(message) {
    if (!el.toast || !el.toastMessage) return;
    el.toastMessage.textContent = message;
    el.toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 2800);
  }

  function copyCurrentTime() {
    const timeStr = `${el.hours.textContent}:${el.minutes.textContent}:${el.seconds.textContent} ${el.ampm.textContent}`.trim();
    const fullDateStr = el.currentDate ? el.currentDate.textContent : '';
    const tzStr = el.currentTimezone ? el.currentTimezone.textContent : '';
    const textToCopy = `${timeStr} (${fullDateStr} • ${tzStr})`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Time copied to clipboard! 📋');
      }).catch(() => {
        showToast(`Current Time: ${timeStr}`);
      });
    } else {
      showToast(`Current Time: ${timeStr}`);
    }
  }

  function cycleQuote() {
    if (!el.quoteText || !el.quoteAuthor) return;
    state.currentQuoteIndex = (state.currentQuoteIndex + 1) % quotes.length;
    const item = quotes[state.currentQuoteIndex];
    
    // Quick fade transition
    el.quoteText.style.opacity = '0';
    el.quoteAuthor.style.opacity = '0';
    
    setTimeout(() => {
      el.quoteText.textContent = `"${item.text}"`;
      el.quoteAuthor.textContent = `— ${item.author}`;
      el.quoteText.style.opacity = '1';
      el.quoteAuthor.style.opacity = '1';
    }, 200);
  }

  // =========================================================================
  // Initialization & Event Listeners
  // =========================================================================

  function init() {
    // 1. Initial renders
    applyTheme(state.theme);
    applyFormatState();
    renderProfile();
    updateStaticMeta();
    updateClock();

    // 2. High frequency timer for smooth clock ticking
    setInterval(updateClock, 500);

    // Refresh date/timezone every minute
    setInterval(updateStaticMeta, 60000);

    // 3. Event Listeners
    if (el.formatToggle) el.formatToggle.addEventListener('click', toggleFormat);

    if (el.themeButtons) {
      el.themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const theme = btn.getAttribute('data-theme');
          applyTheme(theme);
          showToast(`Theme applied ✨`);
        });
      });
    }

    if (el.copyTimeBtn) el.copyTimeBtn.addEventListener('click', copyCurrentTime);

    // Profile Edit events
    if (el.editNameTrigger) el.editNameTrigger.addEventListener('click', openEditModal);
    if (el.userNameDisplay) el.userNameDisplay.addEventListener('click', openEditModal);
    if (el.avatarContainer) el.avatarContainer.addEventListener('click', openEditModal);
    if (el.modalCloseBtn) el.modalCloseBtn.addEventListener('click', closeEditModal);
    if (el.modalCancelBtn) el.modalCancelBtn.addEventListener('click', closeEditModal);
    if (el.profileForm) el.profileForm.addEventListener('submit', saveProfile);

    // Close modal on backdrop click
    if (el.editModal) {
      el.editModal.addEventListener('click', (e) => {
        if (e.target === el.editModal) closeEditModal();
      });
    }

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.editModal && el.editModal.classList.contains('open')) {
        closeEditModal();
      }
    });

    // Quotes
    if (el.refreshQuoteBtn) el.refreshQuoteBtn.addEventListener('click', cycleQuote);

    // Contact button
    if (el.quickEmailBtn) {
      el.quickEmailBtn.addEventListener('click', () => {
        const email = `${state.profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
        showToast(`Contact placeholder: ${email}`);
      });
    }
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
