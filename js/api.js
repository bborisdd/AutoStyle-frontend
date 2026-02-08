/**
 * AutoStyle API Client
 * Клиент для работы с backend API
 */

// URL API сервера (изменить на продакшен URL после деплоя)
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://your-railway-app.railway.app/api'; // TODO: Заменить на реальный URL после деплоя

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
    
    // Сохраняем пользователя в sessionStorage (сессия браузера)
    if (data.user) {
        sessionStorage.setItem('currentUser', JSON.stringify(data.user));
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
    
    // Сохраняем пользователя в sessionStorage
    if (data.user) {
        sessionStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
}

/**
 * Получение текущего пользователя из сессии
 */
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Выход пользователя
 */
function logoutUser() {
    sessionStorage.removeItem('currentUser');
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
    
    // Обновляем данные в сессии
    if (result.user) {
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    
    return result;
}

// ==================== ORDERS API ====================

/**
 * Создание заказа
 */
async function createOrder(userId, items, total, deliveryAddress = null) {
    return await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({ userId, items, total, deliveryAddress }),
    });
}

/**
 * Получение заказов пользователя
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
