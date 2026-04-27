import { getCurrentUser, signInWithGoogle, signOut } from './firebase-init.js';

// === Демо-данные профилей ===
const sampleProfiles = [
  {
    id: 101, name: "Алексей", avatar: "👨‍💻",
    goal: "Ищу фронтендера в стартап по автоматизации",
    skills: ["React", "TypeScript", "Next.js"],
    level: "Middle", location: "Москва", available: "полный день"
  },
  {
    id: 102, name: "Мария", avatar: "👩‍🔬",
    goal: "Хакатон по AI: нужен бэкенд для ML-модели",
    skills: ["Python", "TensorFlow", "FastAPI"],
    level: "Senior", location: "Онлайн", available: "вечера"
  },
  {
    id: 103, name: "Дмитрий", avatar: "🎨",
    goal: "Дизайнер ищет разработчиков для пет-проекта",
    skills: ["Figma", "UI/UX", "Prototyping"],
    level: "Junior", location: "СПб", available: "выходные"
  },
  {
    id: 104, name: "София", avatar: "👩‍💼",
    goal: "Product Manager: ищу техлида для MVP",
    skills: ["Product", "Agile", "Analytics"],
    level: "Middle", location: "Онлайн", available: "гибко"
  },
  {
    id: 105, name: "Иван", avatar: "⚙️",
    goal: "DevOps для хакатона: настрою CI/CD за ночь",
    skills: ["Docker", "Kubernetes", "AWS"],
    level: "Senior", location: "Онлайн", available: "полный день"
  }
];

// === Состояние ===
let profiles = [...sampleProfiles];
let currentIndex = profiles.length - 1;
let stats = { shown: 0, likes: 0, matches: 0 };

// === DOM элементы ===
const cardStack = document.getElementById('cardStack');
const authGate = document.getElementById('authGate');
const swipeContent = document.getElementById('swipeContent');
const matchModal = document.getElementById('matchModal');

// === Проверка авторизации ===
function checkAuth() {
  const user = getCurrentUser();
  if (!user) {
    authGate.style.display = 'block';
    swipeContent.style.display = 'none';
    return false;
  }
  authGate.style.display = 'none';
  swipeContent.style.display = 'block';
  
  // Показываем имя пользователя
  const userName = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  userName.textContent = user.displayName?.split(' ')[0] || 'Пользователь';
  userName.style.display = 'inline';
  logoutBtn.style.display = 'inline-flex';
  
  return true;
}

// === Рендер карточек ===
function renderCards() {
  cardStack.innerHTML = '';
  cardStack.classList.remove('show-indicators');
  
  if (currentIndex < 0) {
    cardStack.innerHTML = `
      <div class="card" style="display:flex; align-items:center; justify-content:center; height:100%; text-align:center; padding:20px;">
        <div>
          <div style="font-size:3rem; margin-bottom:16px;">🎉</div>
          <h3 style="color:var(--primary); margin-bottom:8px;">Профили закончились!</h3>
          <p style="color:var(--text-muted); margin-bottom:16px;">
            Попробуйте выбрать другое мероприятие или зайдите позже — мы добавляем новых участников каждый день.
          </p>
          <button class="btn" onclick="location.reload()">🔄 Обновить</button>
        </div>
      </div>
    `;
    return;
  }

  // Рендерим видимые карточки (последние 3 для эффекта стопки)
  const visible = profiles.slice(Math.max(0, currentIndex - 2), currentIndex + 1);
  
  visible.forEach((p, i, arr) => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.dataset.id = p.id;
    
    // Эффект стопки: верхняя карточка полноценная, нижние — уменьшены
    const offset = arr.length - 1 - i;
    card.style.zIndex = i;
    card.style.transform = `scale(${1 - offset * 0.04}) translateY(${offset * 8}px)`;
    if (offset > 0) card.style.pointerEvents = 'none'; // Нижние карточки некликабельны
    
    card.innerHTML = `
      <div class="profile-avatar">${p.avatar}</div>
      <h2 class="profile-name">${p.name}</h2>
      <p class="profile-goal">"${p.goal}"</p>
      <div class="profile-skills">
        ${p.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
      <div class="profile-meta">
        <div class="meta-item">🎯 <strong>${p.level}</strong></div>
        <div class="meta-item">📍 ${p.location}</div>
        <div class="meta-item">⏰ ${p.available}</div>
        <div class="meta-item">💼 ${p.skills.length} навыков</div>
      </div>
    `;
    
    // Добавляем обработчики свайпа только для верхней карточки
    if (offset === 0) initSwipe(card);
    
    cardStack.appendChild(card);
  });
  
  updateStats();
}

// === Логика свайпа (мышь + тач) ===
function initSwipe(card) {
  let startX = 0, currentX = 0, isDragging = false;
  
  const onMove = (clientX) => {
    if (!isDragging) return;
    currentX = clientX - startX;
    const rotate = currentX * 0.08;
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
    
    // Показываем индикаторы
    const threshold = 50;
    cardStack.classList.toggle('show-indicators', Math.abs(currentX) > threshold);
    document.getElementById('likeStamp').style.opacity = currentX > threshold ? '1' : '0';
    document.getElementById('nopeStamp').style.opacity = currentX < -threshold ? '1' : '0';
  };
  
  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('dragging');
    
    const threshold = 100;
    if (currentX > threshold) {
      swipeAction(card, 'like');
    } else if (currentX < -threshold) {
      swipeAction(card, 'nope');
    } else {
      // Возврат в центр
      card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = '';
      cardStack.classList.remove('show-indicators');
    }
    currentX = 0;
  };
  
  // Мышь
  card.addEventListener('mousedown', (e) => {
    isDragging = true; startX = e.clientX;
    card.style.transition = 'none'; card.classList.add('dragging');
  });
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
  
  // Тач
  card.addEventListener('touchstart', (e) => {
    isDragging = true; startX = e.touches[0].clientX;
    card.style.transition = 'none'; card.classList.add('dragging');
  }, { passive: true });
  window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend', onEnd);
}

// === Действие после свайпа ===
function swipeAction(card, action) {
  const id = card.dataset.id;
  const direction = action === 'like' ? '150%' : '-150%';
  const rotate = action === 'like' ? '20deg' : '-20deg';
  
  card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  card.style.transform = `translateX(${direction}) rotate(${rotate})`;
  card.style.opacity = '0';
  
  // Обновляем статистику
  stats.shown++;
  if (action === 'like') {
    stats.likes++;
    // Имитация мэтча (30% шанс для демо)
    if (Math.random() < 0.3) {
      setTimeout(() => showMatch(id), 300);
    }
  }
  
  // Переход к следующей карточке
  setTimeout(() => {
    currentIndex--;
    renderCards();
  }, 400);
}

// === Показать модальное окно мэтча ===
function showMatch(profileId) {
  stats.matches++;
  updateStats();
  
  const profile = sampleProfiles.find(p => p.id == profileId);
  document.getElementById('matchText').innerHTML = 
    `Вы и <strong>${profile?.name}</strong> лайкнули друг друга!<br>Теперь можно обсудить детали в чате.`;
  
  matchModal.classList.add('active');
  
  // Обработчики кнопок модалки
  document.getElementById('keepSwiping').onclick = () => {
    matchModal.classList.remove('active');
  };
  document.getElementById('openChat').onclick = () => {
    matchModal.classList.remove('active');
    alert(`💬 Чат с ${profile?.name} откроется здесь (функционал в разработке)`);
    // В реальной версии: window.location.href = `chat.html?match=${profileId}`;
  };
}

// === Обновление статистики ===
function updateStats() {
  document.getElementById('shownCount').textContent = stats.shown;
  document.getElementById('likesCount').textContent = stats.likes;
  document.getElementById('matchesCount').textContent = stats.matches;
}

// === Обработчики кнопок ===
document.getElementById('btnNope').addEventListener('click', () => {
  const card = cardStack.lastElementChild;
  if (card && !card.classList.contains('dragging')) swipeAction(card, 'nope');
});
document.getElementById('btnLike').addEventListener('click', () => {
  const card = cardStack.lastElementChild;
  if (card && !card.classList.contains('dragging')) swipeAction(card, 'like');
});
document.getElementById('btnSuper').addEventListener('click', () => {
  // Супер-лайк: сразу мэтч + уведомление
  const card = cardStack.lastElementChild;
  if (card) {
    stats.shown++; stats.likes++; stats.matches++;
    updateStats();
    swipeAction(card, 'like');
    setTimeout(() => {
      const id = card.dataset.id;
      const profile = sampleProfiles.find(p => p.id == id);
      document.getElementById('matchText').innerHTML = 
        `⭐ Вы отправили супер-лайк <strong>${profile?.name}</strong>!<br>Уведомление уже отправлено.`;
      matchModal.classList.add('active');
    }, 400);
  }
});

// === Смена мероприятия ===
document.getElementById('eventSelector').addEventListener('change', (e) => {
  const eventNames = { 1: "AI Hackathon 2026", 2: "React Moscow Meetup", 3: "Python Data Workshop" };
  document.getElementById('currentEventName').textContent = eventNames[e.target.value] || "Мероприятие";
  // В реальной версии: загрузка профилей для выбранного события из Firebase
  currentIndex = profiles.length - 1;
  stats = { shown: 0, likes: 0, matches: 0 };
  renderCards();
});

// === Выход из аккаунта ===
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  signOut();
  location.reload();
});

// === Инициализация ===
// if (checkAuth()) {  // <-- закомментировали проверку
renderCards();      // <-- карточки показываются сразу
// } else {            // <-- закомментировали блок else
//   document.querySelector('#authGate .btn').addEventListener('click', () => {
//     alert('🔐 Перейдите на главную и нажмите "Войти через Google"');
//   });
// }

// Экспорт для отладки
export { sampleProfiles, stats };