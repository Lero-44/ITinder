// Данные для свайпов (тестовые анкеты)
const participants = [
  { id: 1, name: "Алексей", role: "Frontend-разработчик", emoji: "👨‍", skills: ["React", "TypeScript", "Next.js"], bio: "Ищу дизайнера и бэкендера для хакатона. Опыт 3 года." },
  { id: 2, name: "Мария", role: "UI/UX Дизайнер", emoji: "🎨", skills: ["Figma", "Prototyping", "UserFlow"], bio: "Хочу сделать красивый продукт. Свободна все выходные!" },
  { id: 3, name: "Дмитрий", role: "Python Backend", emoji: "🐍", skills: ["Django", "PostgreSQL", "Docker"], bio: "Могу поднять сервер за 15 минут. Ищу фронтендера." },
  { id: 4, name: "Елена", role: "Project Manager", emoji: "📋", skills: ["Agile", "Jira", "Communication"], bio: "Организую процесс, чтобы вы просто кодили." }
];

let currentIndex = 0;
const stack = document.getElementById('card-stack');

// Инициализация
function initCards() {
  // Рендерим карточки в обратном порядке, чтобы первая была сверху (z-index)
  participants.slice().reverse().forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'tinder-card';
    card.dataset.index = participants.length - 1 - i; // Оригинальный индекс
    card.innerHTML = `
      <div class="card-avatar">${p.emoji}</div>
      <h2 class="card-name">${p.name}</h2>
      <p class="card-role">${p.role}</p>
      <div class="card-skills">
        ${p.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
      <p class="card-bio">"${p.bio}"</p>
    `;
    stack.appendChild(card);
  });
  initSwipeLogic();
}

function initSwipeLogic() {
  const cards = document.querySelectorAll('.tinder-card');
  cards.forEach(card => {
    let isDragging = false;
    let startX = 0;

    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);

    function startDrag(e) {
      if (card !== stack.lastElementChild) return; // Двигаем только верхнюю
      isDragging = true;
      startX = e.clientX || e.touches[0].clientX;
      card.style.transition = 'none';
      
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function onDrag(e) {
      if (!isDragging) return;
      const currentX = e.clientX || e.touches[0].clientX;
      const diff = currentX - startX;
      const rotate = diff * 0.1;
      card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
    }

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      const currentX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0);
      const diff = currentX - startX;
      
      card.style.transition = 'transform 0.3s ease';
      
      if (diff > 100) {
        swipeAction('right', card);
      } else if (diff < -100) {
        swipeAction('left', card);
      } else {
        card.style.transform = '';
      }
      
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
    }
  });
}

function swipeAction(direction, cardElement) {
  const card = cardElement || stack.lastElementChild;
  if (!card) return;

  const translateX = direction === 'right' ? '150%' : '-150%';
  const rotate = direction === 'right' ? '20deg' : '-20deg';

  card.style.transform = `translateX(${translateX}) rotate(${rotate})`;
  card.style.opacity = '0';

  setTimeout(() => {
    card.remove();
    if (direction === 'right') {
      // Шанс мэтча 50% для демо
      if (Math.random() > 0.5) showMatchModal(card.dataset.name || 'Участник');
    }
  }, 300);
}

// Модальное окно мэтча
const matchModal = document.getElementById('match-modal');
let currentMatchId = null;

function showMatchModal(name) {
  document.getElementById('match-name').textContent = name;
  matchModal.classList.add('active');
}

function closeMatchModal() {
  matchModal.classList.remove('active');
}

function openChat() {
  window.location.href = 'chat.html';
}

// Запуск
initCards();