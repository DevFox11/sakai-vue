/**
 * Utilidades para manejar localStorage de forma segura
 * Centraliza el acceso a localStorage para tokens y datos de usuario
 */

const STORAGE_KEYS = {
    TOKENS: 'auth_tokens',
    USER: 'auth_user'
};

/**
 * Guarda los tokens de autenticación en localStorage
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const saveTokens = (accessToken, refreshToken) => {
    const tokens = {
        access_token: accessToken,
        refresh_token: refreshToken
    };
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
};

/**
 * Obtiene los tokens de autenticación desde localStorage
 * @returns {Object|null} Objeto con access_token y refresh_token, o null si no existen
 */
export const getTokens = () => {
    try {
        const tokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
        return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
        console.error('Error parsing tokens from localStorage:', error);
        return null;
    }
};

/**
 * Elimina los tokens de autenticación de localStorage
 */
export const clearTokens = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
};

/**
 * Guarda los datos del usuario en localStorage
 * @param {Object} user - Objeto con datos del usuario
 */
export const saveUser = (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Obtiene los datos del usuario desde localStorage
 * @returns {Object|null} Datos del usuario o null si no existen
 */
export const getUser = () => {
    try {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

/**
 * Elimina los datos del usuario de localStorage
 */
export const clearUser = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Limpia todo el almacenamiento de autenticación
 */
export const clearAuth = () => {
    clearTokens();
    clearUser();
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean} true si existen tokens guardados
 */
export const hasActiveSession = () => {
    const tokens = getTokens();
    return !!(tokens && tokens.access_token);
};
