/**
 * APPEARANCE SETTINGS MANAGER
 * 
 * Comprehensive theme and UI customization system with:
 * - Theme color switching (8 colors)
 * - Font family selection (3 fonts)
 * - Dark/light mode toggle
 * - Portfolio filtering
 * - Navigation highlighting
 * - Scroll-to-top functionality
 * - Settings sidebar with persistence
 * 
 * All preferences are saved to localStorage for persistence across sessions.
 */

// ===== DOM ELEMENTS INITIALIZATION =====
// Cache all DOM elements for better performance and readability
const settingsToggle = document.getElementById('settings-toggle');          // Button to open settings sidebar
const settingsSidebar = document.getElementById('settings-sidebar');        // Settings sidebar container
const closeSettingsBtn = document.getElementById('close-settings');         // Button to close settings sidebar
const resetSettingsBtn = document.getElementById('reset-settings');         // Button to reset all settings to defaults
const fontOptions = document.querySelectorAll('.font-option');              // All font selection buttons
const themeColorsGrid = document.getElementById('theme-colors-grid');       // Container for dynamic color buttons
const themeToggleButton = document.getElementById('theme-toggle-button');   // Dark/light mode toggle button
const themeToggleCircle = themeToggleButton.querySelector('.theme-toggle-circle'); // Inner circle of toggle (visual)
const scrollToTopBtn = document.getElementById('scroll-to-top');            // Scroll to top floating button
const navLinks = document.querySelectorAll('.nav-links a');                 // All navigation menu links
const portfolioFilters = document.querySelectorAll('.portfolio-filter');    // Portfolio category filter buttons
const portfolioItems = document.querySelectorAll('.portfolio-item');        // All portfolio items for filtering

// ===== THEME CONFIGURATION =====
// Predefined color palette for theme customization
// Each color has a display name and hex value for CSS
const themeColors = [
    { name: 'Purple', color: '#A157F6' },    // Primary brand color (default)
    { name: 'Blue', color: '#4F94F8' },      // Professional blue
    { name: 'Green', color: '#34D399' },     // Success/eco green
    { name: 'Red', color: '#F87171' },       // Error/attention red
    { name: 'Orange', color: '#F97316' },    // Warning/energy orange
    { name: 'Yellow', color: '#FACC15' },    // Highlight yellow
    { name: 'Pink', color: '#F472B6' },      // Creative pink
    { name: 'Teal', color: '#14B8A6' }       // Modern teal
];

// ===== COLOR MANAGEMENT FUNCTIONS =====

/**
 * MASTER FUNCTION: Updates primary color across entire application
 * This is the main entry point for color changes - updates CSS variables,
 * applies theme classes, saves to storage, and updates UI elements
 * 
 * @param {string} color - Hex color code (e.g., '#A157F6')
 * @returns {void}
 */
function updatePrimaryColor(color) {
    // Update root CSS custom properties for global color variables
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--primary', color);

    // Apply corresponding theme class to body for contextual styling
    applyThemeClass(color);

    // Update all color-related CSS variables
    updateCSSVariables(color);

    // Persist user's color choice across sessions
    localStorage.setItem('selectedColor', color);
}

/**
 * Applies theme-specific CSS class to body element based on selected color
 * This allows for theme-specific overrides beyond just the color value
 * 
 * @param {string} color - Hex color code to map to theme class
 * @returns {void}
 */
function applyThemeClass(color) {
    // Define all possible theme classes for removal
    const themeClasses = [
        'theme-purple', 'theme-blue', 'theme-green',
        'theme-red', 'theme-orange', 'theme-yellow',
        'theme-pink', 'theme-teal'
    ];

    // Clean slate: remove all existing theme classes
    document.body.classList.remove(...themeClasses);

    // Get the appropriate theme class for the selected color
    const themeClass = getThemeClassFromColor(color);

    // Apply the new theme class if found
    if (themeClass) document.body.classList.add(themeClass);
}

/**
 * Maps hexadecimal color codes to corresponding theme class names
 * This is a lookup function that connects color values to CSS class names
 * 
 * @param {string} color - Hex color code to look up
 * @returns {string} Theme class name (e.g., 'theme-purple') or default
 */
function getThemeClassFromColor(color) {
    // Map of hex colors to theme class names
    const colorMap = {
        '#A157F6': 'theme-purple',
        '#4F94F8': 'theme-blue',
        '#34D399': 'theme-green',
        '#F87171': 'theme-red',
        '#F97316': 'theme-orange',
        '#FACC15': 'theme-yellow',
        '#F472B6': 'theme-pink',
        '#14B8A6': 'theme-teal'
    };

    // Return mapped class or default to purple if not found
    return colorMap[color] || 'theme-purple';
}

/**
 * Updates CSS custom properties in a dynamic style element
 * This function injects CSS rules that override Tailwind's utility classes
 * 
 * @param {string} color - Hex color code for CSS generation
 * @returns {void}
 */
function updateCSSVariables(color) {
    // Find or create the dynamic style element in document head
    let styleElement = document.getElementById('dynamic-primary-colors');

    // Create new style element if it doesn't exist
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-primary-colors';  // ID for easy retrieval
        document.head.appendChild(styleElement);
    }

    // Inject the generated CSS with the new color
    styleElement.textContent = generateColorCSS(color);
}

/**
 * Generates CSS rules for dynamic color updates
 * Creates !important overrides for Tailwind classes to ensure they take precedence
 * 
 * @param {string} color - Hex color code to use in CSS rules
 * @returns {string} Complete CSS string with all color overrides
 */
function generateColorCSS(color) {
    return `
        /* Root CSS variables for global access */
        :root {
            --color-primary: ${color};
            --primary: ${color};
        }
        
        /* Text color utilities */
        .text-primary { color: ${color} !important; }
        
        /* Background color utilities */
        .bg-primary { background-color: ${color} !important; }
        
        /* Border color utilities */
        .border-primary { border-color: ${color} !important; }
        
        /* Ring/focus outline utilities */
        .ring-primary { --tw-ring-color: ${color} !important; }
        
        /* Gradient color stops */
        .from-primary { --tw-gradient-from: ${color} !important; }
        .to-primary { --tw-gradient-to: ${color} !important; }
        
        /* Hover state overrides */
        .hover\\:text-primary:hover { color: ${color} !important; }
        .hover\\:bg-primary:hover { background-color: ${color} !important; }
        .hover\\:border-primary:hover { border-color: ${color} !important; }
        
        /* Group hover states (for nested elements) */
        .group:hover .group-hover\\:text-primary { color: ${color} !important; }
        
        /* Shadow color with transparency (33 = 20% opacity) */
        .shadow-primary { --tw-shadow-color: ${color}33 !important; }
    `;
}

/**
 * Updates visual state of color selection buttons in UI
 * Highlights the selected color button and removes highlight from others
 * 
 * @param {string} color - Hex color code of the selected button
 * @returns {void}
 */
function highlightSelectedColor(color) {
    // Get all color buttons in the theme colors grid
    const allColorButtons = document.querySelectorAll('#theme-colors-grid button');

    // Update each button's visual state
    allColorButtons.forEach(btn => {
        // Check if this button corresponds to the selected color
        const isSelected = btn.getAttribute('data-color') === color;

        // Toggle visual indicators based on selection state
        btn.classList.toggle('selected', isSelected);          // Custom selected class
        btn.classList.toggle('ring-2', isSelected);            // Outer ring
        btn.classList.toggle('ring-primary', isSelected);      // Ring color
        btn.classList.toggle('ring-offset-2', isSelected);     // Ring offset
        btn.classList.toggle('scale-110', isSelected);         // Slight enlargement
    });
}

// ===== SIDEBAR MANAGEMENT FUNCTIONS =====

/**
 * Opens the settings sidebar with proper accessibility attributes
 * Controls both visual display and ARIA states for screen readers
 * 
 * @returns {void}
 */
function openSidebar() {
    // Remove translate-x-full class to slide in from right
    settingsSidebar.classList.remove('translate-x-full');

    // Update ARIA attributes for accessibility
    settingsSidebar.setAttribute('aria-hidden', 'false');     // Sidebar is visible
    settingsToggle.setAttribute('aria-expanded', 'true');     // Toggle button is expanded
}

/**
 * Closes the settings sidebar with proper accessibility attributes
 * Slides sidebar out of view and updates ARIA states
 * 
 * @returns {void}
 */
function closeSidebar() {
    // Add translate-x-full class to slide out to right
    settingsSidebar.classList.add('translate-x-full');

    // Update ARIA attributes for accessibility
    settingsSidebar.setAttribute('aria-hidden', 'true');      // Sidebar is hidden
    settingsToggle.setAttribute('aria-expanded', 'false');    // Toggle button is collapsed
}

// ===== FONT SELECTION FUNCTIONS =====

/**
 * Handles font selection from UI buttons
 * Manages active states, applies font to body, and saves preference
 * 
 * @param {HTMLElement} selectedButton - The clicked font option button
 * @returns {void}
 */
function handleFontSelection(selectedButton) {
    // STEP 1: Clear active state from all font buttons
    fontOptions.forEach(button => {
        button.classList.remove('active');                    // Remove visual active class
        button.setAttribute('aria-checked', 'false');         // Update ARIA for accessibility
    });

    // STEP 2: Mark selected button as active
    selectedButton.classList.add('active');                   // Add visual active class
    selectedButton.setAttribute('aria-checked', 'true');      // Update ARIA for accessibility

    // STEP 3: Get font name from data attribute
    const font = selectedButton.dataset.font;

    // STEP 4: Apply selected font to document body
    applyFontToBody(font);

    // STEP 5: Save user preference to localStorage
    localStorage.setItem('selectedFont', font);
}

/**
 * Applies selected font family to document body
 * Removes all font classes first, then adds the selected one
 * 
 * @param {string} font - Font family name (alexandria, tajawal, cairo)
 * @returns {void}
 */
function applyFontToBody(font) {
    // Define all possible font classes
    const fontClasses = ['font-alexandria', 'font-tajawal', 'font-cairo'];

    // Remove all font classes for clean slate
    document.body.classList.remove(...fontClasses);

    // Add the selected font class (prefix with 'font-' for Tailwind)
    document.body.classList.add(`font-${font}`);
}

// ===== THEME COLOR BUTTONS GENERATION =====

/**
 * Dynamically generates color selection buttons from themeColors array
 * Creates interactive buttons for each color in the palette
 * 
 * @returns {void}
 */
function generateThemeColorButtons() {
    // Iterate through each color in the theme palette
    themeColors.forEach(theme => {
        // Create button element for this color
        const colorBtn = document.createElement('button');

        // Base styling classes (Tailwind CSS)
        colorBtn.className = 'w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current';

        // Set background color to the theme color
        colorBtn.style.backgroundColor = theme.color;

        // Accessibility and semantic attributes
        colorBtn.setAttribute('aria-label', `Select ${theme.name} theme`);  // Screen reader text
        colorBtn.setAttribute('data-color', theme.color);                   // Store color for reference
        colorBtn.setAttribute('title', theme.name);                         // Tooltip on hover

        // Click event: update theme color and highlight button
        colorBtn.addEventListener('click', () => {
            updatePrimaryColor(theme.color);         // Update global color
            highlightSelectedColor(theme.color);     // Update button UI state
        });

        // Append button to the colors grid container
        themeColorsGrid.appendChild(colorBtn);
    });
}

// ===== RESET FUNCTIONALITY =====

/**
 * Resets all appearance settings to their default values
 * Includes fonts, colors, and clears localStorage
 * 
 * @returns {void}
 */
function resetSettings() {
    // STEP 1: Reset font to default (Tajawal)
    applyFontToBody('tajawal');

    // STEP 2: Reset color to default (Purple)
    const defaultColor = '#A157F6';
    updatePrimaryColor(defaultColor);
    highlightSelectedColor(defaultColor);

    // STEP 3: Clear stored preferences from localStorage
    localStorage.removeItem('selectedFont');
    localStorage.removeItem('selectedColor');

    // STEP 4: Reset font buttons UI to default state
    resetFontButtons();

    // STEP 5: Show confirmation toast to user (in Arabic)
    showToast('تم إعادة الضبط إلى الإعدادات الافتراضية'); // "Reset to default settings"
}

/**
 * Resets font selection buttons to default state (Tajawal)
 * Updates both visual state and ARIA attributes
 * 
 * @returns {void}
 */
function resetFontButtons() {
    fontOptions.forEach(btn => {
        // Check if this button is the default (Tajawal)
        const isDefault = btn.dataset.font === 'tajawal';

        // Update visual and accessibility states
        btn.classList.toggle('active', isDefault);                       // Active class
        btn.setAttribute('aria-checked', isDefault.toString());          // ARIA checked state
    });
}

// ===== TOAST NOTIFICATION SYSTEM =====

/**
 * Displays a temporary notification message to the user
 * Used for confirmations, errors, or status updates
 * 
 * @param {string} message - The text message to display
 * @returns {void}
 */
function showToast(message) {
    // STEP 1: Remove any existing toast to prevent duplicates
    const existingToast = document.getElementById('settings-toast');
    if (existingToast) existingToast.remove();

    // STEP 2: Create new toast element
    const toast = document.createElement('div');
    toast.id = 'settings-toast';  // Unique ID for reference

    // Styling classes for positioning and appearance
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg z-[100] animate-fade-in-up';

    // Set the message text
    toast.textContent = message;

    // STEP 3: Ensure animation styles are available
    if (!document.getElementById('toast-animations')) {
        addToastAnimationStyles();
    }

    // STEP 4: Add toast to DOM
    document.body.appendChild(toast);

    // STEP 5: Schedule automatic removal after 3 seconds
    setTimeout(() => removeToast(toast), 3000);
}

/**
 * Adds CSS animation keyframes for toast transitions
 * Creates fade-in-up and fade-out-down animations
 * 
 * @returns {void}
 */
function addToastAnimationStyles() {
    // Create style element for animations
    const style = document.createElement('style');
    style.id = 'toast-animations';

    // Define keyframes and animation classes
    style.textContent = `
        /* Slide up and fade in animation */
        @keyframes fade-in-up {
            from { 
                opacity: 0; 
                transform: translate(-50%, 20px);  /* Start 20px below */
            }
            to { 
                opacity: 1; 
                transform: translate(-50%, 0);     /* End at normal position */
            }
        }
        
        /* Slide down and fade out animation */
        @keyframes fade-out-down {
            from { 
                opacity: 1; 
                transform: translate(-50%, 0);     /* Start at normal position */
            }
            to { 
                opacity: 0; 
                transform: translate(-50%, 20px);  /* End 20px below */
            }
        }
        
        /* Utility classes for applying animations */
        .animate-fade-in-up { 
            animation: fade-in-up 0.3s ease-out; 
        }
        
        .animate-fade-out-down { 
            animation: fade-out-down 0.3s ease-out; 
        }
    `;

    // Add to document head
    document.head.appendChild(style);
}

/**
 * Removes toast element with fade-out animation
 * Adds animation class first, then removes element after animation completes
 * 
 * @param {HTMLElement} toast - The toast element to remove
 * @returns {void}
 */
function removeToast(toast) {
    // Add fade-out animation class
    toast.classList.add('animate-fade-out-down');

    // Wait for animation to complete (300ms) then remove element
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 300);
}

// ===== PREFERENCE MANAGEMENT (LOAD/SAVE) =====

/**
 * Loads saved user preferences from localStorage
 * Applies saved fonts and colors on page load
 * 
 * @returns {void}
 */
function loadSavedPreferences() {
    // STEP 1: Retrieve saved values from localStorage
    const savedFont = localStorage.getItem('selectedFont');
    const savedColor = localStorage.getItem('selectedColor');

    // STEP 2: Apply saved font preference if it exists
    if (savedFont) {
        applyFontToBody(savedFont);          // Apply font to body
        updateFontButtons(savedFont);        // Update font buttons UI
    }

    // STEP 3: Apply saved color preference (or default)
    const colorToApply = savedColor || '#A157F6';  // Use saved color or default purple
    updatePrimaryColor(colorToApply);              // Update global color
    highlightSelectedColor(colorToApply);          // Update color buttons UI
}

/**
 * Updates font selection buttons based on saved preference
 * Sets active state on the button matching the saved font
 * 
 * @param {string} font - The font name to set as active
 * @returns {void}
 */
function updateFontButtons(font) {
    fontOptions.forEach(btn => {
        // Check if this button corresponds to the saved font
        const isActive = btn.dataset.font === font;

        // Update visual and accessibility states
        btn.classList.toggle('active', isActive);                      // Active class
        btn.setAttribute('aria-checked', isActive.toString());         // ARIA checked state
    });
}

/**
 * Adds static theme color styles to document head
 * These styles define CSS custom properties for each theme
 * Only adds once to prevent duplication
 * 
 * @returns {void}
 */
function addThemeColorStyles() {
    // Check if styles already exist to avoid duplication
    if (document.getElementById('theme-color-styles')) return;

    // Create style element
    const style = document.createElement('style');
    style.id = 'theme-color-styles';

    // Add generated CSS for theme color classes
    style.textContent = generateThemeColorStyles();

    // Append to document head
    document.head.appendChild(style);
}

/**
 * Generates static CSS for theme color classes
 * Defines CSS custom properties and text color overrides for each theme
 * 
 * @returns {string} CSS string with theme-specific styles
 */
function generateThemeColorStyles() {
    return `
        /* Theme-specific CSS custom properties (CSS variables) */
        .theme-purple { 
            --color-primary: #A157F6; 
            --primary: #A157F6; 
        }
        
        .theme-blue { 
            --color-primary: #4F94F8; 
            --primary: #4F94F8; 
        }
        
        .theme-green { 
            --color-primary: #34D399; 
            --primary: #34D399; 
        }
        
        .theme-red { 
            --color-primary: #F87171; 
            --primary: #F87171; 
        }
        
        .theme-orange { 
            --color-primary: #F97316; 
            --primary: #F97316; 
        }
        
        .theme-yellow { 
            --color-primary: #FACC15; 
            --primary: #FACC15; 
        }
        
        .theme-pink { 
            --color-primary: #F472B6; 
            --primary: #F472B6; 
        }
        
        .theme-teal { 
            --color-primary: #14B8A6; 
            --primary: #14B8A6; 
        }
        
        /* Force text color updates within each theme context */
        .theme-purple .text-primary { color: #A157F6 !important; }
        .theme-blue .text-primary { color: #4F94F8 !important; }
        .theme-green .text-primary { color: #34D399 !important; }
        .theme-red .text-primary { color: #F87171 !important; }
        .theme-orange .text-primary { color: #F97316 !important; }
        .theme-yellow .text-primary { color: #FACC15 !important; }
        .theme-pink .text-primary { color: #F472B6 !important; }
        .theme-teal .text-primary { color: #14B8A6 !important; }
    `;
}

// ===== DARK/LIGHT THEME MANAGEMENT =====

/**
 * Toggles between dark and light color themes
 * Updates HTML class, saves preference, and updates toggle button state
 * 
 * @returns {void}
 */
function toggleTheme() {
    const htmlEl = document.documentElement;  // Reference to <html> element

    // Check if dark mode is currently active
    if (htmlEl.classList.contains('dark')) {
        // STEP 1: Switch to light mode
        htmlEl.classList.remove('dark');                    // Remove dark class
        localStorage.setItem('theme', 'light');             // Save preference
        themeToggleButton.setAttribute('aria-pressed', 'false'); // Update toggle state
    } else {
        // STEP 2: Switch to dark mode
        htmlEl.classList.add('dark');                       // Add dark class
        localStorage.setItem('theme', 'dark');              // Save preference
        themeToggleButton.setAttribute('aria-pressed', 'true');  // Update toggle state
    }
}

/**
 * Loads saved theme preference from localStorage on page load
 * Applies the appropriate theme class to <html> element
 * 
 * @returns {void}
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');  // Get saved preference
    const htmlEl = document.documentElement;           // Reference to <html> element

    // Apply dark theme if saved preference is 'dark'
    if (savedTheme === 'dark') {
        htmlEl.classList.add('dark');                              // Add dark class
        themeToggleButton.setAttribute('aria-pressed', 'true');    // Set toggle to "on"
    } else {
        // Default to light theme
        htmlEl.classList.remove('dark');                           // Remove dark class
        themeToggleButton.setAttribute('aria-pressed', 'false');   // Set toggle to "off"
    }
}

// ===== SCROLL TO TOP FUNCTIONALITY =====

/**
 * Shows or hides the scroll-to-top button based on scroll position
 * Uses opacity and visibility for smooth transitions
 * 
 * @returns {void}
 */
function handleScrollToTopVisibility() {
    // Determine if user has scrolled beyond threshold (300px from top)
    const isVisible = window.scrollY > 300;

    // Toggle visibility classes with smooth transitions
    scrollToTopBtn.classList.toggle('opacity-0', !isVisible);   // Fade out
    scrollToTopBtn.classList.toggle('invisible', !isVisible);   // Hide from layout
    scrollToTopBtn.classList.toggle('opacity-100', isVisible);  // Fade in
    scrollToTopBtn.classList.toggle('visible', isVisible);      // Show in layout
}

/**
 * Smoothly scrolls the page back to the top
 * Uses native smooth scrolling behavior
 * 
 * @returns {void}
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,                   // Target position (top of page)
        behavior: 'smooth'        // Smooth scrolling animation
    });
}

// ===== NAVIGATION HIGHLIGHTING =====

/**
 * Updates active navigation link based on current scroll position
 * Highlights the link corresponding to the section currently in viewport center
 * 
 * @returns {void}
 */
function updateActiveNavLink() {
    // Calculate center point of viewport (for section detection)
    const scrollPos = window.scrollY + window.innerHeight / 2;

    // Check each section to see if it's in the viewport center
    sections.forEach((section, index) => {
        // Skip if section doesn't exist (broken link)
        if (!section) return;

        // Get section boundaries
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        // Check if viewport center is within this section
        const isActive = scrollPos >= sectionTop && scrollPos < sectionBottom;

        // If this section is active, update navigation links
        if (isActive) {
            // Remove active state from all links
            navLinks.forEach(link => link.classList.remove('text-primary'));

            // Add active state to corresponding link
            navLinks[index].classList.add('text-primary');
        }
    });
}

/**
 * Extracts section elements referenced by navigation links
 * Maps each nav link's href to its corresponding section element
 * 
 * @returns {Array<HTMLElement>} Array of section DOM elements
 */
function getSectionsFromNavLinks() {
    return Array.from(navLinks).map(link => {
        // Extract section ID from href (remove '#')
        const targetId = link.getAttribute('href').slice(1);

        // Return corresponding DOM element
        return document.getElementById(targetId);
    });
}

// Cache sections array for performance (calculated once)
const sections = getSectionsFromNavLinks();

// ===== PORTFOLIO FILTERING SYSTEM =====

/**
 * Filters portfolio items by category
 * Shows/hides items based on selected filter with transition effects
 * 
 * @param {string} category - Filter category ('all', 'web', 'app', etc.)
 * @returns {void}
 */
function filterPortfolio(category) {
    portfolioItems.forEach(item => {
        // Get item's category from data attribute
        const itemCategory = item.dataset.category;

        // Determine if item should be shown
        // 'all' shows everything, otherwise match specific category
        const shouldShow = category === 'all' || itemCategory === category;

        // Control visibility with display property
        item.style.display = shouldShow ? '' : 'none';  // '' = default, 'none' = hidden

        // Add/remove transition classes for smooth animations
        item.classList.toggle('opacity-0', !shouldShow);   // Fade out
        item.classList.toggle('scale-95', !shouldShow);    // Shrink
    });
}

/**
 * Sets active visual state on portfolio filter buttons
 * Updates both visual appearance and ARIA attributes
 * 
 * @param {HTMLElement} activeBtn - The filter button that was clicked
 * @returns {void}
 */
function setActiveFilterButton(activeBtn) {
    portfolioFilters.forEach(btn => {
        // Check if this button is the active one
        const isActive = btn === activeBtn;

        // Toggle all visual state classes
        btn.classList.toggle('active', isActive);                    // Active state
        btn.classList.toggle('bg-linear-to-r', isActive);           // Gradient background
        btn.classList.toggle('from-primary', isActive);             // Gradient start color
        btn.classList.toggle('to-secondary', isActive);             // Gradient end color
        btn.classList.toggle('text-white', isActive);               // Text color
        btn.classList.toggle('shadow-lg', isActive);                // Shadow elevation
        btn.classList.toggle('shadow-primary/50', isActive);        // Shadow color

        // Update ARIA pressed state for accessibility
        btn.setAttribute('aria-pressed', isActive.toString());
    });
}

// ===== EVENT LISTENERS SETUP =====

/**
 * Sets up all event listeners for interactive elements
 * Centralized event binding for better maintainability
 * 
 * @returns {void}
 */
function setupEventListeners() {
    // SIDEBAR CONTROLS
    settingsToggle.addEventListener('click', () => {
        // Toggle sidebar: open if closed, close if open
        settingsSidebar.classList.contains('translate-x-full') ? openSidebar() : closeSidebar();
    });

    closeSettingsBtn.addEventListener('click', closeSidebar);

    // FONT SELECTION
    fontOptions.forEach(btn => {
        btn.addEventListener('click', () => handleFontSelection(btn));
    });

    // RESET SETTINGS
    resetSettingsBtn.addEventListener('click', resetSettings);

    // THEME TOGGLE
    themeToggleButton.addEventListener('click', toggleTheme);

    // SCROLL TO TOP
    window.addEventListener('scroll', handleScrollToTopVisibility);
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // NAVIGATION HIGHLIGHTING
    window.addEventListener('scroll', updateActiveNavLink);

    // PORTFOLIO FILTERING
    portfolioFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;      // Get filter category
            filterPortfolio(category);                // Apply filter
            setActiveFilterButton(btn);               // Update button states
        });
    });

    // ESCAPE KEY TO CLOSE SIDEBAR
    document.addEventListener('keydown', (e) => {
        // Close sidebar if Escape key pressed and sidebar is open
        if (e.key === 'Escape' && !settingsSidebar.classList.contains('translate-x-full')) {
            closeSidebar();
        }
    });
}

// ===== APPLICATION INITIALIZATION =====

/**
 * Main initialization function - runs when DOM is fully loaded
 * Sets up all functionality in proper sequence
 * 
 * @returns {void}
 */
function initialize() {
    // STEP 1: Generate dynamic UI elements
    generateThemeColorButtons();   // Create color selection buttons
    addThemeColorStyles();         // Add theme color CSS

    // STEP 2: Load saved user preferences
    loadSavedPreferences();        // Fonts and theme colors
    loadSavedTheme();              // Dark/light mode

    // STEP 3: Set up all event listeners
    setupEventListeners();         // Interactive functionality

    // STEP 4: Initialize portfolio display
    filterPortfolio('all');        // Show all items by default

    // STEP 5: Initialize scroll-to-top button state
    handleScrollToTopVisibility(); // Show/hide based on initial scroll
}

// ===== PUBLIC API (Optional Export) =====
// Expose key functions to global scope for external use if needed
window.AppearanceSettings = {
    updatePrimaryColor,        // Change theme color programmatically
    getThemeClassFromColor,    // Get theme class for a color
    loadSavedPreferences,      // Reload preferences
    showToast,                 // Display notification
    themeColors,               // Access color palette
    highlightSelectedColor     // Update color button UI
};

// ===== APPLICATION START =====
// Initialize when DOM is fully loaded and parsed
document.addEventListener('DOMContentLoaded', initialize);


document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       DOM ELEMENTS
    ========================= */
    const carousel = document.getElementById("testimonials-carousel");
    const cards = document.querySelectorAll(".testimonial-card");
    const nextBtn = document.getElementById("next-testimonial");
    const prevBtn = document.getElementById("prev-testimonial");
    const indicators = document.querySelectorAll(".carousel-indicator");

    /* =========================
       STATE
    ========================= */
    let currentIndex = 0;

    /* =========================
       HELPERS
    ========================= */

    // Returns number of visible cards based on screen width
    function getCardsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    // Updates carousel position and active indicator
    function updateCarousel() {
        if (!cards.length) return;

        const cardWidth = cards[0].offsetWidth;
        const translateX = currentIndex * cardWidth;

        // RTL-friendly movement
        carousel.style.transform = `translateX(${translateX}px)`;

        updateIndicators();
    }

    // Updates active indicator color & accessibility state
    function updateIndicators() {
        const activeDotIndex = currentIndex % indicators.length;

        indicators.forEach((dot, index) => {
            // Reset indicator styles
            dot.classList.remove("bg-accent", "bg-slate-400", "dark:bg-slate-600");

            if (index === activeDotIndex) {
                // Active indicator
                dot.classList.add("bg-accent");
                dot.setAttribute("aria-selected", "true");
            } else {
                // Inactive indicators
                dot.classList.add("bg-slate-400");
                dot.setAttribute("aria-selected", "false");
            }
        });
    }

    /* =========================
       EVENT HANDLERS
    ========================= */

    function goNext() {
        const cardsPerView = getCardsPerView();
        const maxIndex = cards.length - cardsPerView;

        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function goPrev() {
        const cardsPerView = getCardsPerView();
        const maxIndex = cards.length - cardsPerView;

        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateCarousel();
    }

    function goToIndex(index) {
        currentIndex = index;
        updateCarousel();
    }

    /* =========================
       EVENT LISTENERS
    ========================= */

    nextBtn?.addEventListener("click", goNext);
    prevBtn?.addEventListener("click", goPrev);

    indicators.forEach((dot) => {
        dot.addEventListener("click", () => {
            goToIndex(Number(dot.dataset.index));
        });
    });

    window.addEventListener("resize", updateCarousel);

    /* =========================
       INIT
    ========================= */

    updateCarousel();
});
