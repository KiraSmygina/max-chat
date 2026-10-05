import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const receivingRef = useRef(false);

  const API_URL = `https://3100.api.green-api.com/waInstance${idInstance}`;

  // --- Вход ---
  const handleLogin = () => {
    const trimmedId = idInstance.trim();
    const trimmedToken = apiTokenInstance.trim();

    if (!trimmedId || !trimmedToken) {
      alert('Заполни оба поля!');
      return;
    }

    if (trimmedId.startsWith('79')) {
      alert('Ты ввела номер телефона вместо idInstance! Нужен idInstance вида 310022756501.');
      return;
    }

    setIdInstance(trimmedId);
    setApiTokenInstance(trimmedToken);
    setIsLoggedIn(true);
  };

  // --- Создание чата ---
  const handleStartChat = async () => {
    console.log('Кнопка "Создать чат" нажата. phoneNumber =', phoneNumber);

    if (!phoneNumber) {
      alert('Введи номер телефона получателя!');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/checkAccount/${apiTokenInstance}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phoneNumber })
        }
      );

      const data = await response.json();
      console.log('checkAccount response:', data);

      if (data && data.chatId) {
        setChatId(data.chatId);
        setMessages([]);
        alert('Чат создан! chatId = ' + data.chatId);
      } else {
        alert('Не удалось создать чат. Смотри консоль.');
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
      alert('Ошибка: ' + error.message);
    }
  };

  // --- Отправка сообщения ---
  const handleSendMessage = async () => {
    console.log('Кнопка "Отправить" нажата. newMessage =', newMessage, 'chatId =', chatId);

    if (!newMessage.trim()) {
      alert('Введи текст сообщения!');
      return;
    }

    if (!chatId) {
      alert('Сначала нажми "Создать чат"!');
      return;
    }

    const textToSend = newMessage;
    setMessages(prev => [...prev, { text: textToSend, isMine: true }]);
    setNewMessage('');

    try {
      const response = await fetch(
        `${API_URL}/sendMessage/${apiTokenInstance}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: chatId,
            message: textToSend
          })
        }
      );

      const result = await response.json();
      console.log('sendMessage response:', result);
    } catch (error) {
      console.error('Ошибка при отправке:', error);
    }
  };

  // --- Получение сообщений ---
  useEffect(() => {
    if (!isLoggedIn || receivingRef.current) return;
    receivingRef.current = true;

    const receiveLoop = async () => {
      if (!isLoggedIn) {
        receivingRef.current = false;
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`
        );

        if (!response.ok) {
          setTimeout(receiveLoop, 3000);
          return;
        }

        const text = await response.text();

        if (!text || text.trim() === '') {
          setTimeout(receiveLoop, 1000);
          return;
        }

        let notification;
        try {
          notification = JSON.parse(text);
        } catch (e) {
          setTimeout(receiveLoop, 2000);
          return;
        }

        if (!notification || !notification.body) {
          setTimeout(receiveLoop, 1000);
          return;
        }

        const msgData = notification.body.messageData;
        const senderData = notification.body.senderData;

        if (msgData?.typeMessage === 'textMessage' && senderData) {
          const incomingText = msgData.textMessageData?.textMessage;
          setMessages(prev => [...prev, { text: incomingText, isMine: false }]);
        }

        await fetch(
          `${API_URL}/deleteNotification/${apiTokenInstance}/${notification.receiptId}`,
          { method: 'DELETE' }
        );

      } catch (error) {
        console.error('Ошибка при получении:', error);
      }

      setTimeout(receiveLoop, 500);
    };

    receiveLoop();

    return () => { receivingRef.current = false; };
  }, [isLoggedIn, idInstance, apiTokenInstance]);

  // --- Экран входа ---
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>Вход в MAX</h2>
        <input
          placeholder="idInstance (например, 310022756501)"
          value={idInstance}
          onChange={e => setIdInstance(e.target.value)}
        />
        <input
          placeholder="apiTokenInstance"
          value={apiTokenInstance}
          onChange={e => setApiTokenInstance(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>Войти</button>
      </div>
    );
  }

  // --- Экран чата ---
  return (
    <div className="chat-container">
      <div className="chat-header">Чат MAX</div>

      <div className="chat-start">
        <input
          placeholder="Номер получателя (например, 79209102225)"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
        <button type="button" onClick={handleStartChat}>Создать чат</button>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isMine ? 'mine' : 'theirs'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
        />
        <button type="button" onClick={handleSendMessage}>Отправить</button>
      </div>
    </div>
  );
}

export default App;