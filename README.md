# Чат MAX через GREEN-API

Тестовое задание на должность Frontend React Developer.

## Описание

Веб-приложение для отправки и получения текстовых сообщений в мессенджере MAX через сервис [GREEN-API](https://green-api.com/max).

Интерфейс выполнен по прототипу [web.max.ru](https://web.max.ru/).

## Технологии

- **React** (Vite)
- **JavaScript (ES6+)**
- **CSS** (чистый, без фреймворков)
- **GREEN-API** (MAX API)

## Функционал

- Вход в систему по `idInstance` и `apiTokenInstance`
- Создание чата по номеру телефона получателя
- Отправка текстовых сообщений
- Получение входящих сообщений (long-polling)
- Минималистичный интерфейс, похожий на MAX

## Запуск проекта локально

### Требования

- Node.js (версия 18 или выше)
- npm

### Установка

1. Клонируй репозиторий:

```bash
git clone https://github.com/KiraSmygina/max-chat.git
cd max-chat
```

2. Установи зависимости:

```bash
npm install
```

3. Запусти сервер разработки:

```bash
npm run dev
```

4. Открой браузер по адресу:

```
http://localhost:5173
```

## Как пользоваться

1. Зарегистрируйся на [GREEN-API](https://green-api.com/) и создай инстанс MAX.
2. Авторизуй инстанс через QR-код в приложении MAX.
3. Скопируй `idInstance` и `apiTokenInstance` из личного кабинета.
4. Введи их в форму входа на сайте.
5. Введи номер телефона получателя и нажми «Создать чат».
6. Пиши сообщения и получай ответы.

## Структура проекта

```
max-chat/
├── src/
│   ├── App.jsx        # Основной компонент
│   ├── App.css        # Стили
│   ├── main.jsx       # Точка входа
│   └── index.css      # Глобальные стили
├── index.html
├── package.json
└── README.md
```

##  Автор

Твоё Имя
- GitHub: [@KiraSmygina](https://github.com/KiraSmygina)
- Telegram: @Skkkkl543
