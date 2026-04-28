// Данные мероприятий (даты генерируются относительно "сегодня")
const today = new Date();
const formatDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
};

const eventsData = [
  { id: 1, title: "AI Hackathon 2026", topic: "ai", format: "online", date: formatDate(1), level: "средний", prize: "600 000 ₽", featured: true, description: "Хакатон по AI.", location: "Онлайн", participants: "250+ команд", duration: "48 часов" },
  { id: 2, title: "React Meetup", topic: "frontend", format: "offline", date: formatDate(5), level: "начальный", prize: null, featured: false, description: "Встреча React-разработчиков.", location: "Москва", participants: "150 человек", duration: "3 часа" },
  { id: 3, title: "Python Workshop", topic: "backend", format: "hybrid", date: formatDate(12), level: "продвинутый", prize: "сертификаты", featured: false, description: "Интенсив по Python.", location: "СПб", participants: "80 мест", duration: "6 часов" },
  { id: 4, title: "Design Sprint", topic: "design", format: "online", date: formatDate(20), level: "средний", prize: "мерч", featured: false, description: "UX для AI.", location: "Онлайн", participants: "50 человек", duration: "4 часа" }
];

let currentView = 'list';
let selectedDate = null;
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function renderCalendarGrid() {
  const grid = document.getElementById('calendarGrid');
  const monthLabel = document.getElementById('currentMonthLabel');
  
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const daysOfWeek = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  
  monthLabel.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
  
  const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // HTML для навигации + дней
  let html = `
    <div class="calendar-nav" style="grid-column: 1/-1; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <button id="prevMonth" class="btn btn-outline" style="padding:6px 12px; font-size:14px;">← Назад</button>
      <span id="currentMonthLabel" style="font-weight:600; color:var(--primary)">${monthNames[currentCalendarMonth]} ${currentCalendarYear}</span>
      <button id="nextMonth" class="btn btn-outline" style="padding:6px 12px; font-size:14px;">Вперед →</button>
    </div>
    ${daysOfWeek.map(d => `<div class="cal-header">${d}</div>`).join('')}
  `;
  
  for(let i=0; i<startDay; i++) html += `<div class="cal-day empty"></div>`;
  
  for(let d=1; d<=daysInMonth; d++) {
    const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const hasEvent = eventsData.some(e => e.date === dateStr);
    const isSelected = selectedDate === dateStr;
    
    html += `<div class="cal-day ${hasEvent?'has-event':''} ${isSelected?'selected':''}" data-date="${dateStr}">
      <span>${d}</span>
    </div>`;
  }
  
  grid.innerHTML = html;
  
  // Клик по дате
  grid.querySelectorAll('.cal-day:not(.empty)').forEach(day => {
    day.addEventListener('click', () => {
      selectedDate = selectedDate === day.dataset.date ? null : day.dataset.date;
      renderCalendarGrid(); 
      filterAndRenderEvents();
    });
  });
  
  // Кнопки навигации
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) { currentCalendarMonth = 11; currentCalendarYear--; }
    renderCalendarGrid();
    filterAndRenderEvents();
  });
  
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) { currentCalendarMonth = 0; currentCalendarYear++; }
    renderCalendarGrid();
    filterAndRenderEvents();
  });
}

function renderEventsList(events) {
  const container = document.getElementById('eventsList');
  const msg = document.getElementById('calendarMessage');
  
  if (events.length === 0) {
    container.innerHTML = '';
    msg.style.display = 'block';
    msg.textContent = selectedDate ? `На ${selectedDate} мероприятий не найдено.` : '🤔 Ничего не найдено.';
    return;
  }
  
  msg.style.display = 'none';
  container.innerHTML = events.map(e => {
    const d = new Date(e.date);
    const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    const formatLabel = { online: '💻 Онлайн', offline: '📍 Офлайн', hybrid: '🔄 Гибрид' }[e.format];
    return `
      <div class="event-card ${e.featured?'featured':''}" onclick="openEvent(${e.id})">
        <div class="event-date"><span class="day">${d.getDate()}</span><span class="month">${months[d.getMonth()]}</span></div>
        <div class="event-info">
          <h3>${e.title}</h3>
          <div class="event-meta"><span>🎯 ${e.level}</span><span>📅 ${e.date}</span></div>
          <div class="event-badges">
            <span class="badge ${e.format}">${formatLabel}</span>
            ${e.prize ? `<span class="badge prize">🏆 ${e.prize}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterAndRenderEvents() {
  let filtered = [...eventsData];
  if(selectedDate) filtered = filtered.filter(e => e.date === selectedDate);
  else {
    const topic = document.getElementById('topicFilter').value;
    const format = document.getElementById('formatFilter').value;
    filtered = filtered.filter(e => {
      if (topic !== 'all' && e.topic !== topic) return false;
      if (format !== 'all' && e.format !== format) return false;
      return true;
    });
  }
  renderEventsList(filtered);
}

window.openEvent = function(id) { window.location.href = `event.html?id=${id}`; };

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('viewList').addEventListener('click', () => {
    currentView = 'list';
    document.getElementById('viewList').classList.add('active');
    document.getElementById('viewCalendar').classList.remove('active');
    document.getElementById('calendarGrid').style.display = 'none';
    document.getElementById('eventsList').style.display = 'flex';
    document.getElementById('filtersContainer').style.display = 'flex';
    selectedDate = null;
    filterAndRenderEvents();
  });
  
  document.getElementById('viewCalendar').addEventListener('click', () => {
    currentView = 'calendar';
    document.getElementById('viewCalendar').classList.add('active');
    document.getElementById('viewList').classList.remove('active');
    document.getElementById('calendarGrid').style.display = 'grid';
    document.getElementById('eventsList').style.display = 'flex';
    document.getElementById('filtersContainer').style.display = 'none';
    renderCalendarGrid();
    filterAndRenderEvents();
  });

  document.getElementById('topicFilter').addEventListener('change', filterAndRenderEvents);
  document.getElementById('formatFilter').addEventListener('change', filterAndRenderEvents);
  
  filterAndRenderEvents();
});