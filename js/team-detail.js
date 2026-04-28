const teamsData = [
  { id: 101, name: "CodeVanguard", event: "AI Hackathon 2026", roles: ["Frontend Developer", "UI/UX Designer"], desc: "Мы уже сделали бэкенд на FastAPI и прототип ML-модели для генерации контента. Ищем людей, чтобы докрутить UI, адаптировать под мобильные устройства и подготовить убойную презентацию.", members: 3, max: 5, history: ["🏆 Победители CyberHack 2025 (1 место)", "🥈 Финалисты TechBattle Spring", "🎓 Хакатоны: 12 участий"], founded: "Март 2025" },
  { id: 102, name: "NeuralNinjas", event: "AI Hackathon 2026", roles: ["Project Manager", "Backend Developer"], desc: "Команда аналитиков данных из МГУ. Нужен кто-то, кто организует процесс, распределит задачи и допишет REST API для нашего модуля прогнозирования.", members: 2, max: 4, history: [" Лучший кейс по Data Science на StudentConf", "🤝 Партнеры с AI-Lab МФТИ"], founded: "Январь 2026" },
  { id: 103, name: "PixelPioneers", event: "Design Sprint", roles: ["Frontend Developer", "Copywriter"], desc: "Дизайнеры и маркетологи. Делаем лендинг, фирменный стиль и контент-стратегию для AI-стартапа в сфере EdTech. Нужен кодер и автор текстов.", members: 3, max: 4, history: ["🎨 Лучший дизайн на StartupWeekend Moscow", "📈 Рост конверсии на 40% для клиента из финтеха"], founded: "Октябрь 2025" }
];

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const team = teamsData.find(t => t.id === id);
  const container = document.getElementById('teamContent');

  if(!team) {
    container.innerHTML = '<h2>Команда не найдена</h2><a href="teams.html" class="back-link">← Назад</a>';
    return;
  }

  container.innerHTML = `
    <a href="teams.html" class="back-link">← Назад к поиску</a>
    <div class="team-header-card">
      <h1 class="team-title">${team.name}</h1>
      <div class="team-meta">
        <span>📅 ${team.event}</span>
        <span>👥 ${team.members}/${team.max} участников</span>
        <span>📆 Основана: ${team.founded}</span>
      </div>
      <p class="team-desc-full">${team.desc}</p>
      <div style="margin: 16px 0;">
        <strong>Ищут:</strong> ${team.roles.map(r => `<span style="background:#ede9fe; color:var(--purple); padding:4px 8px; border-radius:6px; margin-left:6px; font-size:0.9rem;">${r}</span>`).join('')}
      </div>
      <div class="team-status">✅ Активна • Открыта для заявок</div>
    </div>

    <h2 class="section-title">🏆 История и достижения</h2>
    <ul class="history-list">
      ${team.history.map(h => `<li>${h} <span>2025-2026</span></li>`).join('')}
    </ul>

    <button class="btn join-btn" onclick="alert('Заявка отправлена! Команда свяжется с вами в чате.')">🚀 Подать заявку в команду</button>
  `;
});