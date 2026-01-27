// ============================================
// 🔧 EASY MODE SWITCH - Change this to switch between dev and production
// ============================================
const DEV_MODE = true; // Set to true for localhost:5050, false for production

// API Configuration
const API_CONFIG = {
    BASE_URL: DEV_MODE
        ? 'http://localhost:5050'
        : 'https://ff-2026-backend-819593952150.us-central1.run.app',

    // Image base URL (for static assets)
    IMG_BASE_URL: DEV_MODE
        ? 'http://localhost:5050'
        : 'https://ff-2026-backend-819593952150.us-central1.run.app',

    ENDPOINTS: {
        // Authentication
        LOGIN: '/login',
        SIGNUP: '/signup',
        VERIFY_OTP: '/verify-otp',
        FORGOT_PASSWORD: '/forgot-password',
        VERIFY_TOKEN: '/verify-token',

        // User
        PROFILE: '/profile',
        TRANSACTIONS: '/transactions',
        MY_TOURNAMENTS: '/my-tournaments',

        // Tournaments
        TOURNAMENTS: '/tournaments',
        TOURNAMENT_REGISTER: (id) => `/tournaments/${id}/register`,
        USER_REGISTRATION: (id) => `/user/registration/${id}`,

        // Admin
        ADMIN_LOGIN: '/admin/login',
        ADMIN_VERIFY_OTP: '/admin/verify-otp',
        ADMIN_VERIFY_TOKEN: '/admin/verify-token',
        ADMIN_RESEND_OTP: '/admin/resend-otp',
        ADMIN_DASHBOARD_STATS: '/admin/dashboard-stats',
        ADMIN_USERS: '/admin/users',
        ADMIN_TOURNAMENTS: '/admin/tournaments',
        ADMIN_TRANSACTIONS: '/admin/transactions',
        ADMIN_TOURNAMENT_REGISTRATIONS: (id) => `/admin/tournaments/${id}/registrations`,
        ADMIN_TOURNAMENT_STATS: (id) => `/admin/tournaments/${id}/stats`,
        ADMIN_AWARD_WINNINGS: '/admin/award-winnings',
        ADMIN_UPDATE_WINNING_AMOUNT: (registrationId) => `/admin/registrations/${registrationId}/winning-amount`,
        ADMIN_UPDATE_ALL_WINNINGS: (tournamentId) => `/admin/tournaments/${tournamentId}/update-all-winnings`,

        // Other
        BANNERS: '/banners',
        GET_RAZORPAY_KEY: '/get-razorpay-key',
        CREATE_PAYMENT_ORDER: '/create-payment-order',
        VERIFY_PAYMENT: '/verify-payment',
        STATS: '/stats'
    }
};

// Helper function to build full API URLs
function buildApiUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;

    // Replace path parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });

    return url;
}

// Helper function to build image URLs
function buildImgUrl(imagePath) {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    return API_CONFIG.IMG_BASE_URL + cleanPath;
}

// Export for use in other files
window.API_CONFIG = API_CONFIG;
window.buildApiUrl = buildApiUrl;
window.buildImgUrl = buildImgUrl;
window.DEV_MODE = DEV_MODE;