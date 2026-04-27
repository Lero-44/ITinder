// Те же данные, что и в calendar.js (для простоты прототипа)
const eventsData = [
  { id: 1, title: "AI Hackathon 2026: Agents & Automation", topic: "ai", format: "online", date: "2026-05-10", level: "средний", prize: "600 000 ₽", description: "Крупнейший хакатон по созданию AI-агентов. Работаем с GPT-4, Claude и собственными ML-моделями. Задача: создать прототип агента за 48 часов.", location: "Онлайн (Discord)", participants: "250+ команд", duration: "48 часов" },
  { id: 2, title: "React Moscow Meetup #42", topic: "frontend", format: "offline", date: "2026-05-12", level: "начальный", prize: null, description: "Ежемесячная встреча React-разработчиков. Доклады о новых фичах React 19, оптимизации производительности и лучших практиках. Нетворкинг и пицца.", location: "Москва, офис Сбера", participants: "150 человек", duration: "3 часа" },
  { id: 3, title: "Python Data Workshop: от pandas к продакшену", topic: "backend", format: "hybrid", date: "2026-05-15", level: "продвинутый", prize: "сертификаты", description: "Интенсив по работе с данными: pandas, NumPy, визуализация и деплой ML-моделей в production. Разберем реальные кейсы из финтеха.", location: "Онлайн + офлайн в СПб", participants: "80 мест", duration: "6 часов" },
  { id: 4, title: "Design Sprint: UX для AI-продуктов", topic: "design", format: "online", date: "2026-05-18", level: "средний", prize: "мерч от спонсоров", description: "Учимся проектировать интерфейсы для AI-приложений. Разбираем кейсы ChatGPT, Midjourney и других продуктов. Практика в Figma.", location: "Онлайн (Zoom)", participants: "50 человек", duration: "4 часа" }
];

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = parseInt(urlParams.get('id'));
  
  const event = eventsData.find(e => e.id === eventId);
  const container = document.getElementById('event-content');

  if (!event) {
    container.innerHTML = '<h2>Мероприятие не найдено</h2><a href="index.html">На главную</a>';
    return;
  }

  const formatLabel = { online: '💻 Онлайн', offline: '📍 Офлайн', hybrid: '🔄 Гибрид' }[event.format];

  container.innerHTML = `
    <span class="badge ${event.format}" style="margin-bottom:16px">${formatLabel}</span>
    <h1 class="event-full-title">${event.title}</h1>
    <div class="event-full-meta">
      <span>📅 ${event.date}</span>
      <span>🎯 ${event.level}</span>
      <span>📍 ${event.location}</span>
      <span>👥 ${event.participants}</span>
    </div>
    
    <div class="event-full-desc">
      <h3>Описание</h3>
      <p>${event.description}</p>
    </div>

    ${event.prize ? `<div style="background:#fef3c7; padding:16px; border-radius:12px; color:#92400e; margin-bottom:20px;"><strong>🏆 Призы:</strong> ${event.prize}</div>` : ''}

    <div class="event-cta-row">
      <button class="btn" onclick="alert('Функция добавления в личный календарь')">📅 В мой календарь</button>
      <button class="btn btn-outline" onclick="window.location.href='swipe.html'">👥 Найти команду</button>
    </div>
  `;
});