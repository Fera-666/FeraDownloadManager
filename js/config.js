// ============================================
// Fera Download Manager - Website Configuration
// ============================================

const CONFIG = {
    // GitHub repositories
    REPOS: {
        UPDATES: 'Fera-666/FeraUpdates',
        MAIN: 'Fera-666/FeraDownloadManager'
    },
    
    // URLs
    URLS: {
        UPDATE_JSON: 'https://raw.githubusercontent.com/Fera-666/FeraUpdates/main/update.json',
        LATEST_RELEASE: 'https://github.com/Fera-666/FeraUpdates/releases/latest',
        GITHUB_PROFILE: 'https://github.com/Fera-666',
        ISSUES: 'https://github.com/Fera-666/FeraUpdates/issues',
        CONTACT_API: 'https://formspree.io/f/xdawvlna'
    },
    
    // Google Analytics
    ANALYTICS: {
        GA_ID: 'G-4HMF87Z3SX'
    },
    
    // Site Configuration
    SITE: {
        NAME: 'Fera Download Manager',
        URL: 'https://fera-666.github.io/FeraDownloadManager/',
        DESCRIPTION: 'The all-in-one download manager for Windows with built-in browser, torrent support, YouTube downloader, and smart scheduler',
        AUTHOR: 'Fera',
        EMAIL: 'fera2007@gmail.com',
        SOCIAL: {
            GITHUB: 'https://github.com/Fera-666'
        }
    },
    
    // reCAPTCHA
    CONTACT: {
        EMAIL: 'fera2007@gmail.com',
        RECAPTCHA_SITE_KEY: '6LcD4ZIsAAAAAHx-ydIWnl1BYWixk2iC3xLvHJ2_',
        RECAPTCHA_SECRET_KEY: '6LcD4ZIsAAAAAJmKflIghyuowKU3yByPRRsuM_Vg'
    },
    
    // Payment Options
    PAYMENT: {
        CURRENCY: 'USD',
        WHATSAPP_LINK: 'https://wa.me/201008856808?text=I%20want%20to%20buy%20Fera%20license',
        PLANS: {
            monthly: { id: 'monthly', price: 2.99, interval: 'month', features: ['1 device', 'Email support (48h)', 'Updates during subscription'] },
            yearly: { id: 'yearly', price: 24.99, interval: 'year', features: ['2 devices', 'Email support (24h)', 'Updates during subscription', 'Save 30%'] },
            lifetime: { id: 'lifetime', price: 74.99, interval: 'lifetime', features: ['5 devices', 'Priority support + Live chat', 'Lifetime updates', 'Best value'] }
        }
    },
    
    // Testimonials
    TESTIMONIALS: [
        { name: 'Ahmed K.', role: 'Software Developer', rating: 5, text: 'Best download manager I have ever used! The built-in browser and YouTube downloader save me so much time.', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { name: 'Sarah M.', role: 'Content Creator', rating: 5, text: 'Finally a download manager that works perfectly! Highly recommended.', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { name: 'Mohamed R.', role: 'IT Professional', rating: 4, text: 'Great software with excellent torrent support. The scheduler is very useful.', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }
    ],
    
    // Program details
    PROGRAM: {
        NAME: 'Fera Download Manager',
        SHORT_NAME: 'Fera',
        VERSION: '1.0.0',
        MIN_WINDOWS: 'Windows 10 (64-bit)',
        INSTALLER_SIZE: '48 MB'
    }
};