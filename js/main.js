// ========================================
// Fera Download Manager - Main JavaScript
// ========================================

// Load latest version from update.json
async function loadLatestVersion() {
    try {
        const response = await fetch(CONFIG.URLS.UPDATE_JSON);
        const data = await response.json();
        
        // Update all version elements
        const versionElements = document.querySelectorAll('.latest-version');
        versionElements.forEach(el => {
            el.textContent = `v${data.NewVersion}`;
        });
        
        // Update all download buttons
        const downloadBtns = document.querySelectorAll('.download-btn');
        downloadBtns.forEach(btn => {
            btn.href = CONFIG.URLS.LATEST_RELEASE;
            if (btn.classList.contains('version-btn')) {
                btn.textContent = `Download v${data.NewVersion}`;
            }
        });
        
        // Update release date
        const dateElements = document.querySelectorAll('.release-date');
        dateElements.forEach(el => {
            const date = new Date(data.ReleaseDate);
            el.textContent = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        });
        
        // Update changelog if on changelog page
        if (document.getElementById('changelog-content')) {
            displayChangelog(data);
        }
        
        return data;
    } catch (error) {
        console.error('Error loading update info:', error);
        showErrorMessage();
    }
}

// Display changelog on the changelog page
function displayChangelog(data) {
    const container = document.getElementById('changelog-content');
    if (!container) return;
    
    let html = `
        <div class="version-card">
            <div class="version-header">
                <h2>Version ${data.NewVersion}</h2>
                <span class="release-badge">Latest</span>
            </div>
            <p class="version-date">Released: ${new Date(data.ReleaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div class="changelog-text">${data.ChangelogEnglish.replace(/\n/g, '<br>')}</div>
        </div>
    `;
    
    // Add previous versions if available
    if (data.PreviousVersions) {
        data.PreviousVersions.forEach(version => {
            html += `
                <div class="version-card old">
                    <div class="version-header">
                        <h3>Version ${version.NewVersion}</h3>
                    </div>
                    <p class="version-date">Released: ${new Date(version.ReleaseDate).toLocaleDateString()}</p>
                    <div class="changelog-text">${version.ChangelogEnglish.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// Show error message if update info fails to load
function showErrorMessage() {
    const versionElements = document.querySelectorAll('.latest-version');
    versionElements.forEach(el => {
        el.textContent = 'v1.0.0';
    });
    
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.href = CONFIG.URLS.LATEST_RELEASE;
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Load version info
    loadLatestVersion();
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Mobile menu button
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
});