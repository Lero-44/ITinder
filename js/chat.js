const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const messagesArea = document.getElementById('messagesArea');

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  // Добавляем сообщение пользователя
  addMessage(text, 'sent');
  msgInput.value = '';

  // Имитация ответа собеседника через 1.5 секунды
  setTimeout(() => {
    const replies = [
      "Звучит отлично! 👍",
      "Давай обсудим детали завтра?",
      "Скинь ссылку на свое портфолио.",
      "Окей, договорились!"
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(randomReply, 'received');
  }, 1500);
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  
  const now = new Date();
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  
  div.innerHTML = `<p>${text}</p><span class="time">${time}</span>`;
  messagesArea.appendChild(div);
  
  // Прокрутка вниз
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Обработчики событий
sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});