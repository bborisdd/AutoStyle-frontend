/**
 * AutoStyle API Client
 * Клиент для работы с backend API с JWT авторизацией
 */

// URL API сервера
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://autostyle-backend-production.up.railway.app/api';

// ==================== TOKEN MANAGEMENT ====================

/**
 * Сохранение JWT токена
 */
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

/**
 * Получение JWT токена
 */
function getToken() {
    return localStorage.getItem('authToken');
}

/**
 * Удаление JWT токена
 */
function removeToken() {
    localStorage.removeItem('authToken');
}

/**
 * Проверка авторизации
 */
function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    
    // Проверяем не истёк ли токен
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

/**
 * Базовая функция для API запросов
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Добавляем токен если есть
    const token = getToken();
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        // Если токен истёк — выходим
        if (response.status === 401 && data.error === 'Токен истёк') {
            logoutUser();
            window.location.reload();
            throw new Error('Сессия истекла. Войдите снова.');
        }
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка сервера');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== USERS API ====================

/**
 * Регистрация пользователя
 */
async function registerUser(name, email, password, phone = null) {
    const data = await apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
    });
    
    // Сохраняем токен и пользователя
    if (data.token) {
        saveToken(data.token);
    }
    if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
}

/**
 * Вход пользователя
 */
async function loginUser(email, password) {
    const data = await apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    
    // Сохраняем токен и пользователя
    if (data.token) {
        saveToken(data.token);
    }
    if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
}

/**
 * Получение текущего пользователя из localStorage
 */
function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Получение данных пользователя с сервера
 */
async function fetchCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }
    try {
        const data = await apiRequest('/users/me');
        if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        return data.user;
    } catch {
        return null;
    }
}

/**
 * Выход пользователя
 */
function logoutUser() {
    removeToken();
    localStorage.removeItem('currentUser');
}

/**
 * Получение данных пользователя по ID
 */
async function getUserById(userId) {
    return await apiRequest(`/users/${userId}`);
}

/**
 * Обновление данных пользователя
 */
async function updateUser(userId, data) {
    const result = await apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    
    // Обновляем данные в localStorage
    if (result.user) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    
    return result;
}

// ==================== ORDERS API ====================

/**
 * Создание заказа
 */
async function createOrder(items, total, deliveryAddress = null) {
    return await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({ items, total, deliveryAddress }),
    });
}

/**
 * Получение заказов текущего пользователя
 */
async function getMyOrders() {
    return await apiRequest('/orders/my');
}

/**
 * Получение заказов пользователя (deprecated)
 */
async function getUserOrders(userId) {
    return await apiRequest(`/orders/user/${userId}`);
}

/**
 * Получение заказа по ID
 */
async function getOrderById(orderId) {
    return await apiRequest(`/orders/${orderId}`);
}

// ==================== CART (localStorage) ====================
// Корзина остаётся в localStorage для удобства работы без авторизации

/**
 * Получение корзины
 */
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * Сохранение корзины
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Очистка корзины
 */
function clearCart() {
    localStorage.removeItem('cart');
}

/**
 * Добавление товара в корзину
 */
function addItemToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || null,
            quantity: 1
        });
    }
    
    saveCart(cart);
    return cart;
}

/**
 * Обновление количества товара
 */
function updateCartItemQuantity(productId, delta) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }
    }
    
    saveCart(cart);
    return cart;
}

/**
 * Удаление товара из корзины
 */
function removeCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

/**
 * Подсчёт общего количества товаров в корзине
 */
function getCartTotalItems() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Подсчёт общей стоимости корзины
 */
function getCartTotalPrice() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
