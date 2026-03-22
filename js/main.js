// ========================================
// Fera Download Manager - Main JavaScript
// ========================================

// ========================================
// 1. Analytics System
// ========================================

function initAnalytics() {
    if (CONFIG.ANALYTICS.GA_ID && CONFIG.ANALYTICS.GA_ID !== 'G-XXXXXXXXXX') {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ANALYTICS.GA_ID}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', CONFIG.ANALYTICS.GA_ID);
        window.gtag = gtag;
    }
    trackPageView();
}

function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', { page_title: document.title, page_location: window.location.href });
    }
}

function trackEvent(category, action, label = null) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, { event_category: category, event_label: label });
    }
}

// ========================================
// 2. Load Latest Version & Update Notifications
// ========================================

let lastVersion = localStorage.getItem('fera_last_version') || CONFIG.PROGRAM.VERSION;

async function loadLatestVersion() {
    try {
        const response = await fetch(CONFIG.URLS.UPDATE_JSON);
        const data = await response.json();
        
        document.querySelectorAll('.latest-version').forEach(el => el.textContent = `v${data.NewVersion}`);
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.href = CONFIG.URLS.LATEST_RELEASE;
            if (btn.classList.contains('version-btn')) btn.textContent = `Download v${data.NewVersion}`;
        });
        document.querySelectorAll('.release-date').forEach(el => {
            const date = new Date(data.ReleaseDate);
            el.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        });
        
        if (data.NewVersion !== lastVersion && data.NewVersion !== CONFIG.PROGRAM.VERSION) {
            showUpdateNotification(data.NewVersion);
            localStorage.setItem('fera_last_version', data.NewVersion);
        }
        
        if (document.getElementById('changelog-content')) displayChangelog(data);
        return data;
    } catch (error) {
        console.error('Error loading update info:', error);
        showErrorMessage();
    }
}

function showUpdateNotification(newVersion) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `<div class="notification-content"><span class="notification-icon">🎉</span><p>New version v${newVersion} available!</p><a href="download.html" class="notification-btn">Download Now</a><button class="notification-close">&times;</button></div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 500);
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    trackEvent('Update', 'Notification shown', newVersion);
}

function displayChangelog(data) {
    const container = document.getElementById('changelog-content');
    if (!container) return;
    
    let html = `<div class="version-card"><div class="version-header"><h2>Version ${data.NewVersion}</h2><span class="release-badge">Latest</span></div><p class="version-date">Released: ${new Date(data.ReleaseDate).toLocaleDateString('en-US')}</p><div class="changelog-text">${data.ChangelogEnglish.replace(/\n/g, '<br>')}</div></div>`;
    
    if (data.PreviousVersions) {
        data.PreviousVersions.forEach(version => {
            html += `<div class="version-card old"><div class="version-header"><h3>Version ${version.NewVersion}</h3></div><p class="version-date">Released: ${new Date(version.ReleaseDate).toLocaleDateString()}</p><div class="changelog-text">${version.ChangelogEnglish.replace(/\n/g, '<br>')}</div></div>`;
        });
    }
    container.innerHTML = html;
}

function showErrorMessage() {
    document.querySelectorAll('.latest-version').forEach(el => el.textContent = 'v1.0.0');
    document.querySelectorAll('.download-btn').forEach(btn => btn.href = CONFIG.URLS.LATEST_RELEASE);
}

// ========================================
// 3. Search System
// ========================================

function initSearchSystem() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `<input type="text" id="search-input" placeholder="Search pages..." class="search-input"><div id="search-results" class="search-results"></div>`;
    
    // وضع شريط البحث أسفل شريط التنقل (بعد الـ nav)
    const nav = document.querySelector('nav');
    if (nav && nav.nextSibling) {
        const existingSearch = document.querySelector('.search-container');
        if (existingSearch) existingSearch.remove();
        // إضافة البحث بعد الـ nav مباشرة
        nav.parentNode.insertBefore(searchContainer, nav.nextSibling);
    } else {
        // إذا لم يتم العثور على nav، ضعه بعد الـ header
        const header = document.querySelector('header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(searchContainer, header.nextSibling);
        }
    }
    
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // تحسين ظهور نتائج البحث
    searchContainer.style.position = 'relative';
    searchResults.style.position = 'absolute';
    searchResults.style.top = '100%';
    searchResults.style.left = '0';
    searchResults.style.right = '0';
    searchResults.style.zIndex = '1001';
    searchResults.style.maxHeight = '300px';
    searchResults.style.overflowY = 'auto';
    
    const pages = [
        { title: 'Home', url: 'index.html', content: 'download manager, torrent, youtube downloader, scheduler, bilingual' },
        { title: 'Features', url: 'features.html', content: 'download manager, web browser, torrent, youtube, scheduler, clipboard, license, bilingual' },
        { title: 'Gallery', url: 'gallery.html', content: 'screenshots, main window, browser, torrent, youtube, scheduler, settings' },
        { title: 'Changelog', url: 'changelog.html', content: 'updates, versions, release notes, changelog' },
        { title: 'License', url: 'license.html', content: 'license, pricing, monthly, yearly, lifetime, trial, activation' },
        { title: 'Download', url: 'download.html', content: 'download, installer, setup, windows, system requirements' },
        { title: 'Support', url: 'support.html', content: 'support, help, faq, contact, email, issues' }
    ];
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) { 
            searchResults.classList.remove('active'); 
            return; 
        }
        
        const results = pages.filter(page => 
            page.title.toLowerCase().includes(query) || 
            page.content.toLowerCase().includes(query)
        );
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <strong>${result.title}</strong>
                    <span>${result.content.substring(0, 50)}...</span>
                </a>
            `).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = `<div class="search-no-results">No results found for "${query}"</div>`;
            searchResults.classList.add('active');
        }
    });
    
    document.addEventListener('click', (e) => { 
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// ========================================
// 4. Contact Form with Formspree
// ========================================

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.action = CONFIG.URLS.CONTACT_API;
    contactForm.method = 'POST';
    
    if (!document.querySelector('input[name="_subject"]')) {
        const subjectInput = document.createElement('input');
        subjectInput.type = 'hidden';
        subjectInput.name = '_subject';
        subjectInput.value = 'New message from Fera Website';
        contactForm.appendChild(subjectInput);
    }
}

// ========================================
// 5. Payment Buttons
// ========================================

function initPaymentButtons() {
    document.querySelectorAll('.payment-btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            trackEvent('Payment', 'WhatsApp clicked', plan);
        });
    });
}

// ========================================
// 6. Image Protection
// ========================================

function initImageProtection() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => { e.preventDefault(); showProtectionWarning(); return false; });
        img.addEventListener('dragstart', (e) => { e.preventDefault(); return false; });
    });
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && (e.key === 's' || e.key === 'p')) || (e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'F12') {
            e.preventDefault();
            showProtectionWarning('shortcut');
        }
        if (e.key === 'PrintScreen') { e.preventDefault(); showProtectionWarning('printscreen'); }
    });
    
    document.addEventListener('contextmenu', (e) => { if (e.target.tagName === 'IMG') { e.preventDefault(); showProtectionWarning(); return false; } });
    addDigitalWatermark();
}

function addDigitalWatermark() {
    document.querySelectorAll('img[src*="screenshots"]').forEach((img) => {
        const watermark = document.createElement('div');
        watermark.className = 'image-watermark';
        watermark.innerHTML = '© Fera Download Manager';
        watermark.style.cssText = `position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.6); color:rgba(255,255,255,0.5); font-size:10px; padding:2px 6px; border-radius:4px; pointer-events:none; z-index:10;`;
        const container = img.parentElement;
        if (container && !container.querySelector('.image-watermark')) {
            container.style.position = 'relative';
            container.appendChild(watermark);
        }
    });
}

function showProtectionWarning(type = 'image') {
    const warning = document.createElement('div');
    warning.textContent = type === 'printscreen' ? '📸 Screenshot protection active' : '🔒 Image copying is disabled';
    warning.style.cssText = `position:fixed; bottom:20px; right:20px; background:#e74c3c; color:white; padding:10px 20px; border-radius:8px; font-size:14px; z-index:10000; animation:fadeOut 2s forwards; box-shadow:0 2px 10px rgba(0,0,0,0.2);`;
    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 2000);
}

// ========================================
// 7. Lazy Loading Images
// ========================================

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => img.src = img.dataset.src);
    }
}

// ========================================
// 8. Testimonials Display
// ========================================

function initTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;
    
    const testimonialsHTML = CONFIG.TESTIMONIALS.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-avatar"><img src="${t.avatar}" alt="${t.name}"></div>
            <div class="testimonial-rating">${'⭐'.repeat(t.rating)}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <h4 class="testimonial-name">${t.name}</h4>
            <span class="testimonial-role">${t.role}</span>
        </div>
    `).join('');
    container.innerHTML = testimonialsHTML;
}

// ========================================
// 9. Video Tutorial
// ========================================

function initVideoTutorial() {
    const videoBtn = document.getElementById('video-tutorial-btn');
    if (!videoBtn) return;
    
    videoBtn.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'video-lightbox';
        lightbox.innerHTML = `<div class="video-lightbox-content"><button class="video-close">&times;</button><iframe width="100%" height="500" src="https://www.youtube.com/embed/rDq-VRzgW8U" frameborder="0" allowfullscreen></iframe></div>`;
        document.body.appendChild(lightbox);
        setTimeout(() => lightbox.classList.add('active'), 10);
        lightbox.querySelector('.video-close').addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.remove(), 300);
        });
        trackEvent('Video', 'Tutorial viewed');
    });
}

// ========================================
// 10. Mobile Menu & Smooth Scroll
// ========================================

function toggleMobileMenu() {
    document.querySelector('nav ul')?.classList.toggle('show');
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ========================================
// Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initAnalytics();
    initSearchSystem();
    initImageProtection();
    initLazyLoading();
    loadLatestVersion();
    initTestimonials();
    initVideoTutorial();
    initContactForm();
    initPaymentButtons();
    initSmoothScroll();
    
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);
    
    trackEvent('Device', 'Device type', /Mobile|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop');
    console.log('Fera Download Manager - Website loaded!');
});
