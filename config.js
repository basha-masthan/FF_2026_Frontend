// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://api.futurebound.tech',
    // BASE_URL : 'http://localhost:3000',
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

        // Other
        BANNERS: '/banners',
        GET_RAZORPAY_KEY: '/get-razorpay-key',
        CREATE_PAYMENT_ORDER: '/create-payment-order',
        VERIFY_PAYMENT: '/verify-payment',
        STATS: '/stats'
    }
};

// Helper function to build full URLs
function buildApiUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;

    // Replace path parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });

    return url;
}

// Export for use in other files
window.API_CONFIG = API_CONFIG;
window.buildApiUrl = buildApiUrl;