# AutoStyle Frontend

Фронтенд интернет-магазина автомобильных аксессуаров AutoStyle.

## 🛠️ Технологии

- HTML5
- CSS3 + Tailwind CSS (CDN)
- JavaScript (ES6+)
- Yandex Maps API

## 📁 Структура

```
frontend/
├── index.html      # Главная страница
├── catalog.html    # Каталог товаров
├── product.html    # Страница товара
├── cart.html       # Корзина
├── contacts.html   # Контакты
├── css/
│   └── style.css   # Кастомные стили
├── js/
│   ├── api.js      # API клиент для backend
│   └── main.js     # Основная логика
├── images/         # Изображения
└── data/
    └── products.json # Данные о товарах
```

## 🚀 Деплой на GitHub Pages

1. Создайте репозиторий на GitHub
2. Загрузите содержимое этой папки
3. Settings → Pages → Source: Deploy from a branch → main → / (root)
4. Сайт будет доступен по адресу: `https://your-username.github.io/repo-name`

## ⚙️ Настройка API

После деплоя backend на Railway, обновите URL в файле `js/api.js`:

```javascript
const API_URL = 'https://your-backend.railway.app/api';
```

## 📝 Локальная разработка

Запустите локальный сервер:
```bash
python -m http.server 8000
```

Откройте: http://localhost:8000
