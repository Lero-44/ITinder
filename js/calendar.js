// Данные мероприятий
const eventsData = [
  { id: 1, title: "AI Hackathon 2026: Agents & Automation", topic: "ai", format: "online", date: "2026-05-10", level: "средний", prize: "600 000 ₽", featured: true, description: "Крупнейший хакатон по созданию AI-агентов. Работаем с GPT-4, Claude и собственными ML-моделями. Задача: создать прототип агента за 48 часов.", location: "Онлайн (Discord)", participants: "250+ команд", duration: "48 часов" },
  { id: 2, title: "React Moscow Meetup #42", topic: "frontend", format: "offline", date: "2026-05-12", level: "начальный", prize: null, featured: false, description: "Ежемесячная встреча React-разработчиков. Доклады о новых фичах React 19, оптимизации производительности и лучших практиках. Нетворкинг и пицца.", location: "Москва, офис Сбера", participants: "150 человек", duration: "3 часа" },
  { id: 3, title: "Python Data Workshop: от pandas к продакшену", topic: "backend", format: "hybrid", date: "2026-05-15", level: "продвинутый", prize: "сертификаты", featured: false, description: "Интенсив по работе с данными: pandas, NumPy, визуализация и деплой ML-моделей в production. Разберем реальные кейсы из финтеха.", location: "Онлайн + офлайн в СПб", participants: "80 мест", duration: "6 часов" },
  { id: 4, title: "Design Sprint: UX для AI-продуктов", topic: "design", format: "online", date: "2026-05-18", level: "средний", prize: "мерч от спонсоров", featured: false, description: "Учимся проектировать интерфейсы для AI-приложений. Разбираем кейсы ChatGPT, Midjourney и других продуктов. Практика в Figma.", location: "Онлайн (Zoom)", participants: "50 человек", duration: "4 часа" }
];

function renderEvents() {
  const topic = document.getElementById('topicFilter').value;
  const format = document.getElementById('formatFilter').value;
  const date = document.getElementById('dateFilter').value;

  const filtered = eventsData.filter(e => {
    if (topic !== 'all' && e.topic !== topic) return false;
    if (format !== 'all' && e.format !== format) return false;
    if (date && e.date < date) return false;
    return true;
  });

  const container = document.getElementById('eventsList');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = '<div class="card" style="text-align:center; padding:40px; color:var(--text-muted)">🤔 Ничего не найдено. Попробуйте изменить фильтры.</div>';
    return;
  }

  container.innerHTML = filtered.map(e => {
    const d = new Date(e.date);
    const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const fullDate = d.toLocaleDateString('ru-RU');
    const formatLabel = { online: '💻 Онлайн', offline: '📍 Офлайн', hybrid: '🔄 Гибрид' }[e.format];

    // Клик по всей карточке ведет на event.html
    return `
      <div class="event-card ${e.featured ? 'featured' : ''}" onclick="openEvent(${e.id})">
        <div class="event-date"><span class="day">${day}</span><span class="month">${month}</span></div>
        <div class="event-info">
          <h3>${e.title}</h3>
          <div class="event-meta"><span>🎯 ${e.level}</span><span>📅 ${fullDate}</span></div>
          <div class="event-badges">
            <span class="badge ${e.format}">${formatLabel}</span>
            ${e.prize ? `<span class="badge prize">🏆 ${e.prize}</span>` : ''}
            <span class="badge" style="background:#f1f5f9;color:#64748b">#${e.topic}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Функция перехода на страницу мероприятия
function openEvent(id) {
  window.location.href = `event.html?id=${id}`;
}
window.openEvent = openEvent;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('topicFilter')?.addEventListener('change', renderEvents);
  document.getElementById('formatFilter')?.addEventListener('change', renderEvents);
  document.getElementById('dateFilter')?.addEventListener('change', renderEvents);
  renderEvents();
});