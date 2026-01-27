/**
 * Centralized API Service
 * Handles all API calls with automatic authentication, error handling, and loading states
 */

class ApiServiceClass {
    constructor() {
        this.loadingElement = null;
    }

    // ==========================================
    // CORE UTILITIES
    // ==========================================

    /**
     * Get authentication token from localStorage
     */
    getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Get admin token from localStorage
     */
    getAdminToken() {
        return localStorage.getItem('adminToken');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Check if admin is authenticated
     */
    isAdminAuthenticated() {
        return !!this.getAdminToken();
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'landing.html';
    }

    /**
     * Logout admin
     */
    adminLogout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'admin/admin-login.html';
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Core fetch wrapper with authentication
     */
    async request(endpoint, options = {}) {
        const url = buildApiUrl(endpoint);
        const token = options.adminAuth ? this.getAdminToken() : this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token && options.auth !== false) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                if (options.adminAuth) {
                    this.adminLogout();
                } else {
                    this.logout();
                }
                throw new Error('Session expired. Please login again.');
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            let data = null;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            }

            if (!response.ok) {
                throw new Error(data?.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // ==========================================
    // AUTHENTICATION APIs
    // ==========================================

    auth = {
        /**
         * User login
         */
        login: async (email, password) => {
            const data = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                auth: false,
                body: JSON.stringify({ email, password })
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.user.fullname.split(' ')[0]);
                localStorage.setItem('userEmail', data.user.email);
            }

            return data;
        },

        /**
         * User signup
         */
        signup: async (fullname, email, password) => {
            return await this.request(API_CONFIG.ENDPOINTS.SIGNUP, {
                method: 'POST',
                auth: false,
                body: JSON.stringify({ fullname, email, password })
            });
        },

        /**
         * Verify OTP
         */
        verifyOtp: async (email, otp) => {
            return await this.request(API_CONFIG.ENDPOINTS.VERIFY_OTP, {
                method: 'POST',
                auth: false,
                body: JSON.stringify({ email, otp })
            });
        }
    };

    // ==========================================
    // USER APIs
    // ==========================================

    user = {
        /**
         * Get user profile
         */
        getProfile: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.PROFILE);
        },

        /**
         * Update user profile
         */
        updateProfile: async (profileData) => {
            return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        },

        /**
         * Get user transactions
         */
        getTransactions: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.TRANSACTIONS);
        },

        /**
         * Get user's registered tournaments
         */
        getMyTournaments: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.MY_TOURNAMENTS);
        },

        /**
         * Request withdrawal
         */
        withdraw: async (amount, upiId) => {
            return await this.request('/user/withdraw', {
                method: 'POST',
                body: JSON.stringify({ amount, upiId })
            });
        },

        /**
         * Get unread support message count
         */
        getUnreadSupportCount: async () => {
            // Return mock data if backend not ready, or assume backend works. 
            // Ideally: return await this.request('/user/support/unread-count');
            // For now, let's assume the endpoint exists.
            return await this.request(API_CONFIG.ENDPOINTS.USER_SUPPORT_UNREAD || '/user/support/unread-count');
        },

        /**
         * Get support messages
         */
        getSupportMessages: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.USER_SUPPORT_MESSAGES || '/user/support/messages');
        },

        /**
         * Send support message
         */
        sendSupportMessage: async (message) => {
            return await this.request(API_CONFIG.ENDPOINTS.USER_SUPPORT_SEND || '/user/support/send', {
                method: 'POST',
                body: JSON.stringify({ message })
            });
        }
    };

    // ==========================================
    // TOURNAMENT APIs
    // ==========================================

    tournaments = {
        /**
         * Get all tournaments
         */
        getAll: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.TOURNAMENTS, {
                auth: false
            });
        },

        /**
         * Get tournament statistics
         */
        getStats: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.STATS, {
                auth: false
            });
        },

        /**
         * Register for a tournament
         */
        register: async (tournamentId, registrationData) => {
            return await this.request(API_CONFIG.ENDPOINTS.TOURNAMENT_REGISTER(tournamentId), {
                method: 'POST',
                body: JSON.stringify(registrationData)
            });
        },

        /**
         * Get user's registration for a specific tournament
         */
        getUserRegistration: async (tournamentId) => {
            return await this.request(API_CONFIG.ENDPOINTS.USER_REGISTRATION(tournamentId));
        },

        /**
         * Get banners
         */
        getBanners: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.BANNERS, {
                auth: false
            });
        }
    };

    // ==========================================
    // PAYMENT APIs
    // ==========================================

    payment = {
        /**
         * Get Razorpay key
         */
        getRazorpayKey: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.GET_RAZORPAY_KEY);
        },

        /**
         * Create payment order
         */
        createOrder: async (amount) => {
            return await this.request(API_CONFIG.ENDPOINTS.CREATE_PAYMENT_ORDER, {
                method: 'POST',
                body: JSON.stringify({ amount })
            });
        },

        /**
         * Verify payment
         */
        verifyPayment: async (paymentData) => {
            return await this.request(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT, {
                method: 'POST',
                body: JSON.stringify(paymentData)
            });
        }
    };

    // ==========================================
    // ADMIN APIs
    // ==========================================

    admin = {
        /**
         * Admin login
         */
        login: async (email, password) => {
            const data = await this.request(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, {
                method: 'POST',
                auth: false,
                body: JSON.stringify({ email, password })
            });

            if (data.tempToken) {
                localStorage.setItem('adminTempToken', data.tempToken);
                localStorage.setItem('adminEmail', email);
            }

            return data;
        },

        /**
         * Verify admin OTP
         */
        verifyOtp: async (email, otp) => {
            const data = await this.request(API_CONFIG.ENDPOINTS.ADMIN_VERIFY_OTP, {
                method: 'POST',
                auth: false,
                body: JSON.stringify({ email, otp })
            });

            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.admin));
                localStorage.removeItem('adminTempToken');
                localStorage.removeItem('adminEmail');
            }

            return data;
        },

        /**
         * Resend admin OTP
         */
        resendOtp: async (email) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_RESEND_OTP, {
                method: 'POST',
                auth: false,
                body: JSON.stringify({ email })
            });
        },

        /**
         * Verify admin token
         */
        verifyToken: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_VERIFY_TOKEN, {
                adminAuth: true
            });
        },

        /**
         * Get dashboard statistics
         */
        getDashboardStats: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD_STATS, {
                adminAuth: true
            });
        },

        /**
         * Get users
         */
        getUsers: async (searchTerm = '') => {
            const endpoint = searchTerm
                ? `${API_CONFIG.ENDPOINTS.ADMIN_USERS}?search=${encodeURIComponent(searchTerm)}`
                : API_CONFIG.ENDPOINTS.ADMIN_USERS;

            return await this.request(endpoint, {
                adminAuth: true
            });
        },

        /**
         * Get all tournaments
         */
        getTournaments: async () => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_TOURNAMENTS, {
                adminAuth: true
            });
        },

        /**
         * Create tournament
         */
        createTournament: async (tournamentData) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_TOURNAMENTS, {
                method: 'POST',
                adminAuth: true,
                body: JSON.stringify(tournamentData)
            });
        },

        /**
         * Delete tournament
         */
        deleteTournament: async (tournamentId) => {
            return await this.request(`${API_CONFIG.ENDPOINTS.ADMIN_TOURNAMENTS}/${tournamentId}`, {
                method: 'DELETE',
                adminAuth: true
            });
        },

        /**
         * Get tournament registrations
         */
        getTournamentRegistrations: async (tournamentId) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_TOURNAMENT_REGISTRATIONS(tournamentId), {
                adminAuth: true
            });
        },

        /**
         * Get tournament statistics
         */
        getTournamentStats: async (tournamentId) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_TOURNAMENT_STATS(tournamentId), {
                adminAuth: true
            });
        },

        /**
         * Update winning amount for a registration
         */
        updateWinningAmount: async (registrationId, amount) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_UPDATE_WINNING_AMOUNT(registrationId), {
                method: 'PATCH',
                adminAuth: true,
                body: JSON.stringify({ winningAmount: amount })
            });
        },

        /**
         * Update all winnings for a tournament
         */
        updateAllWinnings: async (tournamentId, winningAmount) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_UPDATE_ALL_WINNINGS(tournamentId), {
                method: 'PUT',
                adminAuth: true,
                body: JSON.stringify({ winningAmount })
            });
        },

        /**
         * Award winnings
         */
        awardWinnings: async (awardData) => {
            return await this.request(API_CONFIG.ENDPOINTS.ADMIN_AWARD_WINNINGS, {
                method: 'POST',
                adminAuth: true,
                body: JSON.stringify(awardData)
            });
        },

        /**
         * Delete user (NEW)
         */
        deleteUser: async (userId) => {
            return await this.request(`/admin/users/${userId}`, {
                method: 'DELETE',
                adminAuth: true
            });
        },

        /**
         * Get withdrawal requests (NEW)
         */
        getWithdrawals: async (status = 'all') => {
            const endpoint = status !== 'all'
                ? `/admin/withdrawals?status=${status}`
                : '/admin/withdrawals';

            return await this.request(endpoint, {
                adminAuth: true
            });
        },

        /**
         * Process withdrawal request (NEW)
         */
        processWithdrawal: async (withdrawalId, action, notes = '', rejectionReason = '') => {
            return await this.request(`/admin/withdrawals/${withdrawalId}/process`, {
                method: 'POST',
                adminAuth: true,
                body: JSON.stringify({ action, notes, rejectionReason })
            });
        },

        /**
         * Get filtered transactions (NEW)
         */
        getTransactionsFiltered: async (filters = {}) => {
            const params = new URLSearchParams();

            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });

            const endpoint = `/admin/transactions/filtered${params.toString() ? '?' + params.toString() : ''}`;

            return await this.request(endpoint, {
                adminAuth: true
            });
        }
    };

}

// Create and export singleton instance
const ApiService = new ApiServiceClass();

// Make it globally available
window.ApiService = ApiService;
