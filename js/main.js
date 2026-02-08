/**
 * AutoStyle - Основной JavaScript файл
 * Веб-сайт по продаже автомобильных аксессуаров
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    initMobileMenu();
    initScrollToTop();
    initSmoothScroll();
    initLoginModal();
    initSubscribeForm();
    initContactForm();
    updateUserInterface();
    updateCartCounter();
    
    // Загрузка товаров на страницах каталога и главной
    initProductsLoader();
});

/**
 * Переключение видимости пароля
 */
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const svg = button.querySelector('svg');
    
    if (input.type === 'password') {
        input.type = 'text';
        // Иконка "скрыть" (перечёркнутый глаз)
        svg.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
        `;
    } else {
        input.type = 'password';
        // Иконка "показать" (глаз)
        svg.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        `;
    }
}

/**
 * Мобильное меню
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('button.md\\:hidden');
    const nav = document.querySelector('nav.hidden');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('hidden');
            nav.classList.toggle('flex');
            nav.classList.toggle('flex-col');
            nav.classList.toggle('absolute');
            nav.classList.toggle('top-full');
            nav.classList.toggle('left-0');
            nav.classList.toggle('right-0');
            nav.classList.toggle('bg-gray-900');
            nav.classList.toggle('p-4');
        });
    }
}

/**
 * Кнопка прокрутки вверх
 */
function initScrollToTop() {
    // Создание кнопки
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    scrollBtn.setAttribute('aria-label', 'Прокрутить вверх');
    document.body.appendChild(scrollBtn);

    // Показать/скрыть кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Прокрутка вверх при клике
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Плавная прокрутка к якорям
 */
function initSmoothScroll() {
    // Обработка кликов по якорным ссылкам на текущей странице
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });
    
    // Обработка хэша в URL при загрузке страницы (для кроссстраничных переходов)
    if (window.location.hash) {
        // Небольшая задержка, чтобы страница успела загрузиться
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    }
}

/**
 * Форма подписки на рассылку
 */
function initSubscribeForm() {
    const form = document.getElementById('subscribeForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('subscribeEmail');
            const email = emailInput.value.trim();
            
            if (email) {
                // Показываем уведомление об успешной подписке
                showNotification('Вы успешно подписались на рассылку!');
                
                // Очищаем поле ввода
                emailInput.value = '';
                
                // Можно сохранить email в localStorage для демонстрации
                const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('subscribers', JSON.stringify(subscribers));
                }
                
                console.log('Подписка оформлена:', email);
            }
        });
    }
}

/**
 * Форма обратной связи с валидацией
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Автозаполнение данными авторизованного пользователя
        const currentUser = getCurrentUser();
        if (currentUser) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if (nameInput && currentUser.name) {
                nameInput.value = currentUser.name;
            }
            if (emailInput && currentUser.email) {
                emailInput.value = currentUser.email;
            }
        }
        
        // Обработка отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Очищаем предыдущие ошибки
            clearFormErrors(form);
            
            // Получаем значения полей
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Валидация имени
            if (!name) {
                showFieldError('name', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (name.length < 2) {
                showFieldError('name', 'Имя должно содержать минимум 2 символа');
                isValid = false;
            } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name)) {
                showFieldError('name', 'Имя может содержать только буквы, пробелы и дефис');
                isValid = false;
            }
            
            // Валидация email
            if (!email) {
                showFieldError('email', 'Пожалуйста, введите email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showFieldError('email', 'Пожалуйста, введите корректный email адрес');
                isValid = false;
            }
            
            // Валидация темы обращения
            if (!subject) {
                showFieldError('subject', 'Пожалуйста, выберите тему обращения');
                isValid = false;
            }
            
            // Валидация сообщения
            if (!message) {
                showFieldError('message', 'Пожалуйста, введите сообщение');
                isValid = false;
            } else if (message.length < 10) {
                showFieldError('message', 'Сообщение должно содержать минимум 10 символов');
                isValid = false;
            } else if (message.length > 2000) {
                showFieldError('message', 'Сообщение не должно превышать 2000 символов');
                isValid = false;
            }
            
            if (isValid) {
                // Собираем данные формы
                const formData = {
                    name,
                    email,
                    subject,
                    message,
                    date: new Date().toISOString()
                };
                
                // Сохраняем сообщение в localStorage (для демонстрации)
                const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                messages.push(formData);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                // Показываем уведомление об успехе
                showNotification('Сообщение отправлено!');
                
                // Очищаем форму
                form.reset();
                
                console.log('Сообщение отправлено:', formData);
            }
        });
        
        // Валидация в реальном времени
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                // Убираем ошибку при начале ввода
                clearFieldError(this);
            });
            input.addEventListener('change', function() {
                // Для select элементов
                validateField(this);
            });
        });
    }
}

/**
 * Валидация отдельного поля
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    clearFieldError(field);
    
    switch(fieldId) {
        case 'name':
            if (value && value.length < 2) {
                showFieldError(fieldId, 'Имя должно содержать минимум 2 символа');
            } else if (value && !/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
                showFieldError(fieldId, 'Имя может содержать только буквы');
            }
            break;
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(fieldId, 'Введите корректный email');
            }
            break;
        case 'subject':
            // Валидация при потере фокуса не нужна, только при отправке
            break;
        case 'message':
            if (value && value.length < 10) {
                showFieldError(fieldId, 'Сообщение слишком короткое');
            }
            break;
    }
}

/**
 * Проверка валидности email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Показать ошибку поля
 * Поддерживает два варианта вызова:
 * 1. showFieldError(fieldId, message) - для контактной формы
 * 2. showFieldError(inputEl, errorEl, message) - для модальных окон
 */
function showFieldError(arg1, arg2, arg3) {
    // Если третий аргумент есть - это вызов для модальных окон
    if (arg3 !== undefined) {
        const inputEl = arg1;
        const errorEl = arg2;
        const message = arg3;
        
        if (inputEl) {
            inputEl.classList.add('border-red-500', 'focus:ring-red-500');
            inputEl.classList.remove('focus:ring-orange-500');
        }
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
        return;
    }
    
    // Иначе это вызов для контактной формы (fieldId, message)
    const fieldId = arg1;
    const message = arg2;
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('border-red-500', 'focus:ring-red-500');
        field.classList.remove('focus:ring-orange-500');
        
        // Удаляем старую ошибку если есть
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Добавляем сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

/**
 * Очистить ошибку поля
 */
function clearFieldError(field) {
    if (typeof field === 'string') {
        field = document.getElementById(field);
    }
    if (field) {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        field.classList.add('focus:ring-orange-500');
        
        // Удаляем динамически созданные ошибки (для контактной формы)
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        // Скрываем статические элементы ошибок (для модальных окон)
        const errorEl = document.getElementById(field.id + 'Error');
        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }
    }
}

/**
 * Очистить все ошибки формы
 */
function clearFormErrors(form) {
    const errors = form.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const fields = form.querySelectorAll('.border-red-500');
    fields.forEach(field => {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        field.classList.add('focus:ring-orange-500');
    });
}

/**
 * Модальное окно авторизации
 */
function initLoginModal() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (currentUser) {
                logout();
            } else {
                showLoginModal();
            }
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showRegisterModal();
            }
        });
    }
}

/**
 * Показать модальное окно авторизации
 */
function showLoginModal() {
    // Закрываем окно регистрации если открыто
    closeRegisterModal();
    
    // Создание модального окна
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'loginModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Вход в аккаунт</h2>
                <button class="close-modal text-gray-400 hover:text-gray-600" onclick="closeLoginModal()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <form id="loginForm" novalidate>
                <div class="form-group">
                    <label class="form-label" for="loginEmail">Email *</label>
                    <input type="email" id="loginEmail" class="form-input" placeholder="Введите email">
                    <p id="loginEmailError" class="text-red-500 text-sm mt-1 hidden"></p>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="loginPassword">Пароль *</label>
                    <div class="relative">
                        <input type="password" id="loginPassword" class="form-input pr-12" placeholder="Введите пароль">
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onclick="togglePasswordVisibility('loginPassword', this)">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </div>
                    <p id="loginPasswordError" class="text-red-500 text-sm mt-1 hidden"></p>
                </div>
                
                <button type="submit" class="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                    Войти
                </button>
            </form>
            
            <div class="mt-6 text-center">
                <p class="text-gray-600">
                    Нет аккаунта? 
                    <a href="#" class="text-orange-500 hover:underline" onclick="showRegisterModal()">Зарегистрироваться</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Инициализация валидации формы входа
    initLoginFormValidation();
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Закрытие при клике вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLoginModal();
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    });
}

/**
 * Инициализация валидации формы входа
 */
function initLoginFormValidation() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!form || !emailInput || !passwordInput) {
        console.error('Login form elements not found');
        return;
    }
    
    // Валидация email при потере фокуса
    emailInput.addEventListener('blur', function() {
        validateLoginEmail();
    });
    
    // Валидация пароля при потере фокуса
    passwordInput.addEventListener('blur', function() {
        validateLoginPassword();
    });
    
    // Очистка ошибок при вводе
    emailInput.addEventListener('input', function() {
        clearFieldError('loginEmail');
    });
    
    passwordInput.addEventListener('input', function() {
        clearFieldError('loginPassword');
    });
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isEmailValid = validateLoginEmail();
        const isPasswordValid = validateLoginPassword();
        
        if (isEmailValid && isPasswordValid) {
            handleLogin();
        }
    });
}

/**
 * Валидация email в форме входа
 */
function validateLoginEmail() {
    const email = document.getElementById('loginEmail').value.trim();
    const errorEl = document.getElementById('loginEmailError');
    const inputEl = document.getElementById('loginEmail');
    
    if (!email) {
        showFieldError(inputEl, errorEl, 'Введите email');
        return false;
    }
    
    // Проверка на наличие только английских букв (и допустимых символов)
    if (/[а-яА-ЯёЁ]/.test(email)) {
        showFieldError(inputEl, errorEl, 'Email должен содержать только английские буквы');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showFieldError(inputEl, errorEl, 'Введите корректный email');
        return false;
    }
    
    clearFieldError('loginEmail');
    return true;
}

/**
 * Валидация пароля в форме входа
 */
function validateLoginPassword() {
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginPasswordError');
    const inputEl = document.getElementById('loginPassword');
    
    if (!password) {
        showFieldError(inputEl, errorEl, 'Введите пароль');
        return false;
    }
    
    clearFieldError('loginPassword');
    return true;
}

/**
 * Закрыть модальное окно авторизации
 */
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Обработка формы авторизации
 */
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Показываем индикатор загрузки
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Вход...';
    submitBtn.disabled = true;
    
    try {
        const data = await loginUser(email, password);
        
        showNotification(`Добро пожаловать, ${data.user.name}!`);
        closeLoginModal();
        
        // Обновляем интерфейс
        updateUserInterface();
    } catch (error) {
        showFieldError(
            document.getElementById('loginEmail'),
            document.getElementById('loginEmailError'),
            error.message || 'Неверный email или пароль'
        );
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

/**
 * Показать модальное окно регистрации
 */
function showRegisterModal() {
    closeLoginModal();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'registerModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Регистрация</h2>
                <button class="close-modal text-gray-400 hover:text-gray-600" onclick="closeRegisterModal()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <form id="registerForm" novalidate>
                <div class="form-group">
                    <label class="form-label" for="registerName">Имя *</label>
                    <input type="text" id="registerName" class="form-input" placeholder="Введите ваше имя">
                    <p id="registerNameError" class="text-red-500 text-sm mt-1 hidden"></p>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="registerEmail">Email *</label>
                    <input type="email" id="registerEmail" class="form-input" placeholder="Введите email">
                    <p id="registerEmailError" class="text-red-500 text-sm mt-1 hidden"></p>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="registerPassword">Пароль *</label>
                    <div class="relative">
                        <input type="password" id="registerPassword" class="form-input pr-12" placeholder="Мин. 6 символов, заглавная, цифра, спецсимвол">
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onclick="togglePasswordVisibility('registerPassword', this)">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </div>
                    <p id="registerPasswordError" class="text-red-500 text-sm mt-1 hidden"></p>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="registerPasswordConfirm">Подтверждение пароля *</label>
                    <div class="relative">
                        <input type="password" id="registerPasswordConfirm" class="form-input pr-12" placeholder="Повторите пароль">
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onclick="togglePasswordVisibility('registerPasswordConfirm', this)">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </div>
                    <p id="registerPasswordConfirmError" class="text-red-500 text-sm mt-1 hidden"></p>
                </div>
                
                <button type="submit" class="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                    Зарегистрироваться
                </button>
            </form>
            
            <div class="mt-6 text-center">
                <p class="text-gray-600">
                    Уже есть аккаунт? 
                    <a href="#" class="text-orange-500 hover:underline" onclick="showLoginModal()">Войти</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Инициализация валидации формы регистрации
    initRegisterFormValidation();
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeRegisterModal();
        }
    });
}

/**
 * Инициализация валидации формы регистрации
 */
function initRegisterFormValidation() {
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    
    if (!form || !nameInput || !emailInput || !passwordInput || !passwordConfirmInput) {
        console.error('Register form elements not found');
        return;
    }
    
    // Валидация при потере фокуса
    nameInput.addEventListener('blur', validateRegisterName);
    emailInput.addEventListener('blur', validateRegisterEmail);
    passwordInput.addEventListener('blur', validateRegisterPassword);
    passwordConfirmInput.addEventListener('blur', validateRegisterPasswordConfirm);
    
    // Очистка ошибок при вводе
    nameInput.addEventListener('input', () => clearFieldError('registerName'));
    emailInput.addEventListener('input', () => clearFieldError('registerEmail'));
    passwordInput.addEventListener('input', () => clearFieldError('registerPassword'));
    passwordConfirmInput.addEventListener('input', () => clearFieldError('registerPasswordConfirm'));
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateRegisterName();
        const isEmailValid = validateRegisterEmail();
        const isPasswordValid = validateRegisterPassword();
        const isPasswordConfirmValid = validateRegisterPasswordConfirm();
        
        if (isNameValid && isEmailValid && isPasswordValid && isPasswordConfirmValid) {
            handleRegister();
        }
    });
}

/**
 * Валидация имени в форме регистрации
 */
function validateRegisterName() {
    const name = document.getElementById('registerName').value.trim();
    const errorEl = document.getElementById('registerNameError');
    const inputEl = document.getElementById('registerName');
    
    if (!name) {
        showFieldError(inputEl, errorEl, 'Введите имя');
        return false;
    }
    
    if (name.length < 5) {
        showFieldError(inputEl, errorEl, 'Имя должно содержать минимум 5 символов');
        return false;
    }
    
    // Проверка на наличие минимум 3 букв
    const letterCount = (name.match(/[a-zA-Zа-яА-ЯёЁ]/g) || []).length;
    if (letterCount < 3) {
        showFieldError(inputEl, errorEl, 'Имя должно содержать минимум 3 буквы');
        return false;
    }
    
    clearFieldError('registerName');
    return true;
}

/**
 * Валидация email в форме регистрации
 */
function validateRegisterEmail() {
    const email = document.getElementById('registerEmail').value.trim();
    const errorEl = document.getElementById('registerEmailError');
    const inputEl = document.getElementById('registerEmail');
    
    if (!email) {
        showFieldError(inputEl, errorEl, 'Введите email');
        return false;
    }
    
    // Проверка на наличие только английских букв (и допустимых символов)
    if (/[а-яА-ЯёЁ]/.test(email)) {
        showFieldError(inputEl, errorEl, 'Email должен содержать только английские буквы');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showFieldError(inputEl, errorEl, 'Введите корректный email');
        return false;
    }
    
    // Проверка на существующего пользователя происходит на сервере при регистрации
    
    clearFieldError('registerEmail');
    return true;
}

/**
 * Валидация пароля в форме регистрации
 */
function validateRegisterPassword() {
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerPasswordError');
    const inputEl = document.getElementById('registerPassword');
    
    if (!password) {
        showFieldError(inputEl, errorEl, 'Введите пароль');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(inputEl, errorEl, 'Пароль должен содержать минимум 6 символов');
        return false;
    }
    
    if (!/[A-ZА-ЯЁ]/.test(password)) {
        showFieldError(inputEl, errorEl, 'Пароль должен содержать заглавную букву');
        return false;
    }
    
    if (!/[0-9]/.test(password)) {
        showFieldError(inputEl, errorEl, 'Пароль должен содержать цифру');
        return false;
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        showFieldError(inputEl, errorEl, 'Пароль должен содержать спецсимвол (!@#$%^&* и др.)');
        return false;
    }
    
    clearFieldError('registerPassword');
    return true;
}

/**
 * Валидация подтверждения пароля
 */
function validateRegisterPasswordConfirm() {
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const errorEl = document.getElementById('registerPasswordConfirmError');
    const inputEl = document.getElementById('registerPasswordConfirm');
    
    if (!passwordConfirm) {
        showFieldError(inputEl, errorEl, 'Подтвердите пароль');
        return false;
    }
    
    if (password !== passwordConfirm) {
        showFieldError(inputEl, errorEl, 'Пароли не совпадают');
        return false;
    }
    
    clearFieldError('registerPasswordConfirm');
    return true;
}

/**
 * Закрыть модальное окно регистрации
 */
function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Обработка формы регистрации
 */
async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    // Показываем индикатор загрузки
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Регистрация...';
    submitBtn.disabled = true;
    
    try {
        const data = await registerUser(name, email, password);
        
        showNotification(`Регистрация успешна! Добро пожаловать, ${name}!`);
        closeRegisterModal();
        
        // Обновляем интерфейс
        updateUserInterface();
    } catch (error) {
        showFieldError(
            document.getElementById('registerEmail'),
            document.getElementById('registerEmailError'),
            error.message || 'Ошибка регистрации'
        );
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

/**
 * Обновление интерфейса после авторизации/выхода
 */
function updateUserInterface() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        if (currentUser) {
            // Пользователь авторизован - показываем имя и кнопку выхода
            loginBtn.textContent = 'Выйти';
            
            // Показываем имя пользователя вместо кнопки регистрации
            if (registerBtn) {
                registerBtn.textContent = currentUser.name;
                registerBtn.classList.add('font-semibold');
                registerBtn.style.pointerEvents = 'none';
            }
        } else {
            // Пользователь не авторизован - показываем кнопки входа и регистрации
            loginBtn.textContent = 'Войти';
            
            if (registerBtn) {
                registerBtn.textContent = 'Регистрация';
                registerBtn.classList.remove('font-semibold');
                registerBtn.style.pointerEvents = 'auto';
            }
        }
    }
}

/**
 * Выход из аккаунта
 */
function logout(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    logoutUser(); // Используем функцию из api.js
    showNotification('Вы вышли из аккаунта');
    updateUserInterface();
    
    // Перезагружаем страницу для очистки форм
    setTimeout(() => {
        location.reload();
    }, 1000);
}

/**
 * Добавление товара в корзину
 */
function addToCart(productId, productName, price, image = null) {
    // Используем функцию из api.js
    addItemToCart({
        id: productId,
        name: productName,
        price: price,
        image: image
    });
    
    // Обновляем счётчик
    updateCartCounter();
    
    // Показываем уведомление
    showNotification(`Товар "${productName}" добавлен в корзину!`);
}

/**
 * Показать уведомление
 */
function showNotification(message, type = 'success') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.site-notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    notification.className = `site-notification fixed bottom-4 left-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-[200] transform translate-y-full opacity-0 transition-all duration-300 max-w-md`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-lg">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-75">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.remove('translate-y-full', 'opacity-0');
    }, 10);
    
    // Удаление через 5 секунд
    setTimeout(() => {
        notification.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

/**
 * Анимация появления элементов при скролле
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.product-card, .category-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Инициализация анимаций после загрузки страницы
window.addEventListener('load', initScrollAnimations);

/**
 * ============================================
 * МОДУЛЬ ЗАГРУЗКИ ТОВАРОВ (fetch API + JSON)
 * ============================================
 */

/**
 * Инициализация загрузчика товаров
 */
function initProductsLoader() {
    const catalogGrid = document.getElementById('products-grid');
    const homeProductsGrid = document.getElementById('home-products-grid');
    
    if (catalogGrid) {
        loadProducts('all', catalogGrid);
    }
    
    if (homeProductsGrid) {
        loadProducts('featured', homeProductsGrid, 4);
    }
}

/**
 * Загрузка товаров из JSON файла
 * @param {string} filter - Фильтр категории ('all', 'electronics', 'interior', 'care', 'featured')
 * @param {HTMLElement} container - Контейнер для отображения товаров
 * @param {number} limit - Максимальное количество товаров (опционально)
 */
async function loadProducts(filter = 'all', container, limit = null) {
    try {
        // Показываем индикатор загрузки
        container.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <span class="ml-3 text-gray-600">Загрузка товаров...</span>
            </div>
        `;
        
        // Загружаем данные через fetch API
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        let products = data.products;
        
        // Фильтрация по категории
        if (filter !== 'all' && filter !== 'featured') {
            products = products.filter(product => product.category === filter);
        }
        
        // Для главной страницы показываем товары с бейджами (хиты, новинки)
        if (filter === 'featured') {
            products = products.filter(product => product.badge !== null);
        }
        
        // Ограничение количества
        if (limit) {
            products = products.slice(0, limit);
        }
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Рендерим товары
        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">Товары не найдены</p>
                </div>
            `;
            return;
        }
        
        products.forEach(product => {
            container.appendChild(createProductCard(product));
        });
        
        // Запускаем анимации для новых карточек
        initScrollAnimations();
        
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-500 text-lg">Ошибка загрузки товаров</p>
                <p class="text-gray-500 mt-2">${error.message}</p>
                <button onclick="initProductsLoader()" class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Повторить
                </button>
            </div>
        `;
    }
}

/**
 * Создание карточки товара
 * @param {Object} product - Объект товара
 * @returns {HTMLElement} - DOM элемент карточки
 */
function createProductCard(product) {
    const card = document.createElement('a');
    card.href = `product.html?id=${product.id}`;
    card.className = 'product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer block';
    
    // Определяем цвет бейджа
    const badgeColors = {
        'orange': 'bg-orange-500',
        'green': 'bg-green-500',
        'red': 'bg-red-500',
        'blue': 'bg-blue-500'
    };
    
    const badgeClass = product.badgeColor ? badgeColors[product.badgeColor] : 'bg-orange-500';
    
    // Генерируем звёзды рейтинга
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += `<svg class="w-4 h-4 star" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        } else {
            starsHTML += `<svg class="w-4 h-4 star-empty" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        }
    }
    
    // Форматируем цену
    const formattedPrice = new Intl.NumberFormat('ru-RU').format(product.price);
    const formattedOldPrice = product.oldPrice ? new Intl.NumberFormat('ru-RU').format(product.oldPrice) : null;
    
    card.innerHTML = `
        <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            ${product.badge ? `<span class="absolute top-3 left-3 ${badgeClass} text-white text-sm px-3 py-1 rounded-full">${product.badge}</span>` : ''}
        </div>
        <div class="p-4">
            <div class="flex items-center gap-1 mb-2">
                <div class="rating flex">
                    ${starsHTML}
                </div>
                <span class="text-gray-400 text-sm">(${product.reviews})</span>
            </div>
            <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
            <p class="text-gray-500 text-sm mb-3">${product.description}</p>
            <div class="flex justify-between items-center">
                <div>
                    <span class="text-xl font-bold text-gray-900">${formattedPrice} ₽</span>
                    ${formattedOldPrice ? `<span class="text-sm text-gray-400 line-through ml-2">${formattedOldPrice} ₽</span>` : ''}
                </div>
                <a href="product.html?id=${product.id}" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                    Подробнее
                </a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Обновление счётчика корзины
 */
function updateCartCounter() {
    const totalItems = getCartTotalItems(); // Используем функцию из api.js
    
    // Если есть элемент счётчика - обновляем
    const counter = document.getElementById('cart-counter');
    if (counter) {
        counter.textContent = totalItems;
        if (totalItems > 0) {
            counter.classList.remove('hidden');
        } else {
            counter.classList.add('hidden');
        }
    }
}
