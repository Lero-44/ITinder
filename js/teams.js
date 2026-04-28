const participants = [
  { id: 1, name: "Алексей", role: "Frontend-разработчик", emoji: "👨‍", skills: ["React", "TypeScript", "Next.js"], city: "Москва", bio: "Ищу дизайнера и бэкендера для хакатона." },
  { id: 2, name: "Мария", role: "UI/UX Дизайнер", emoji: "🎨", skills: ["Figma", "Prototyping", "UserFlow"], city: "Санкт-Петербург", bio: "Хочу сделать красивый продукт." },
  { id: 3, name: "Дмитрий", role: "Python Backend", emoji: "🐍", skills: ["Django", "PostgreSQL", "Docker"], city: "Казань", bio: "Могу поднять сервер за 15 минут." },
  { id: 4, name: "Елена", role: "Project Manager", emoji: "📋", skills: ["Agile", "Jira", "Communication"], city: "Новосибирск", bio: "Организую процесс, чтобы вы просто кодили." }
];

const teamsData = [
  { id: 101, name: "CodeVanguard", event: "AI Hackathon 2026", roles: ["Нужен: Frontend", "Нужен: Designer"], desc: "Мы уже сделали бэкенд и прототип ML-модели.", members: 3, max: 5, history: "Победители CyberHack 2025" },
  { id: 102, name: "NeuralNinjas", event: "AI Hackathon 2026", roles: ["Нужен: PM", "Нужен: Backend"], desc: "Команда аналитиков данных. Нужен кто-то, кто организует процесс.", members: 2, max: 4, history: "Финалисты DataFest 2025" },
  { id: 103, name: "PixelPioneers", event: "Design Sprint", roles: ["Нужен: Frontend", "Нужен: Copywriter"], desc: "Дизайнеры и маркетологи. Делаем лендинг.", members: 3, max: 4, history: "Лучший дизайн на StartupWeekend" }
];

// Tabs Logic
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// Render Teams
const teamsGrid = document.getElementById('teamsGrid');
if(teamsGrid) {
  teamsGrid.innerHTML = teamsData.map(t => `
    <div class="team-card" onclick="openTeamDetail(${t.id})">
      <div class="team-header">
        <h3 class="team-name">${t.name}</h3>
        <span class="team-event">📅 ${t.event}</span>
      </div>
      <div class="team-roles">${t.roles.map(r => `<span class="role-tag">${r}</span>`).join('')}</div>
      <p class="team-desc">"${t.desc}"</p>
      <div class="team-footer">
        <span>👥 ${t.members}/${t.max} участников</span>
        <span style="color:var(--primary); font-weight:500;">Подробнее →</span>
      </div>
    </div>
  `).join('');
}
window.openTeamDetail = id => window.location.href = `team-detail.html?id=${id}`;

// Swipe Logic
const stack = document.getElementById('card-stack');
if(stack) {
  participants.slice().reverse().forEach((p) => {
    const card = document.createElement('div');
    card.className = 'tinder-card';
    card.innerHTML = `
      <div class="card-avatar">${p.emoji}</div>
      <h2 class="card-name">${p.name}</h2>
      <div class="card-city">📍 ${p.city}</div>
      <p class="card-role">${p.role}</p>
      <div class="card-skills">${p.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>
      <p class="card-bio">"${p.bio}"</p>
    `;
    stack.appendChild(card);
    initDrag(card); // Включаем механику драга
  });

  // Кнопка свайпа
  window.swipeAction = dir => {
    const card = stack.lastElementChild;
    if(!card) return;
    const x = dir==='right' ? '150%' : '-150%';
    const rot = dir==='right' ? '20deg' : '-20deg';
    card.style.transform = `translateX(${x}) rotate(${rot})`;
    card.style.opacity = '0';
    setTimeout(() => card.remove(), 300);
  };
}

function initDrag(card) {
  let isDragging = false;
  let startX = 0;

  const startDrag = (e) => {
    if (card !== stack.lastElementChild) return;
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    card.style.transition = 'none';
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const diff = currentX - startX;
    const rotate = diff * 0.1;
    card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
  };

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = 'transform 0.3s ease';
    
    const currentX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0);
    const diff = currentX - startX;

    if (diff > 100) {
      card.style.transform = `translateX(150%) rotate(20deg)`;
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 300);
    } else if (diff < -100) {
      card.style.transform = `translateX(-150%) rotate(-20deg)`;
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 300);
    } else {
      card.style.transform = '';
    }
    
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  };

  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag);
}