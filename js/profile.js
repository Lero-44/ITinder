document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  const previewContent = document.getElementById('previewContent');
  const profileCard = document.getElementById('profileCard');
  const resetBtn = document.getElementById('resetBtn');

  // Поля формы
  const fields = {
    fullName: document.getElementById('fullName'),
    birthDate: document.getElementById('birthDate'),
    city: document.getElementById('city'),
    skills: document.getElementById('skills'),
    goal: document.getElementById('goal'),
    bio: document.getElementById('bio')
  };

  // Элементы превью
  const preview = {
    avatar: document.getElementById('previewAvatar'),
    name: document.getElementById('previewName'),
    location: document.getElementById('previewLocation'),
    age: document.getElementById('previewAge'),
    goal: document.getElementById('previewGoal'),
    skills: document.getElementById('previewSkills'),
    bio: document.getElementById('previewBio'),
    bioText: document.getElementById('previewBioText')
  };

  // Живое обновление превью при вводе
  Object.values(fields).forEach(field => {
    field.addEventListener('input', updatePreview);
    field.addEventListener('change', updatePreview);
  });

  function updatePreview() {
    const name = fields.fullName.value.trim();
    const city = fields.city.value.trim();
    const birthDate = fields.birthDate.value;
    const skills = fields.skills.value.trim();
    const goal = fields.goal.value;
    const bio = fields.bio.value.trim();

    // Если есть хоть одно заполненное поле - показываем карточку
    if (name || city || skills || goal || bio) {
      previewContent.style.display = 'none';
      profileCard.style.display = 'block';
    } else {
      previewContent.style.display = 'block';
      profileCard.style.display = 'none';
      return;
    }

    // Аватар (инициалы)
    if (name) {
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      preview.avatar.textContent = initials || '?';
    }

    // Имя
    preview.name.textContent = name || 'Ваше имя';

    // Город
    preview.location.textContent = city ? `📍 ${city}` : '📍 Город не указан';

    // Возраст
    if (birthDate) {
      const age = calculateAge(new Date(birthDate));
      preview.age.textContent = `${age} лет`;
    } else {
      preview.age.textContent = '';
    }

    // Цель
    preview.goal.textContent = goal || 'Цель не указана';

    // Компетенции
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim()).filter(s => s);
      preview.skills.innerHTML = skillList.map(s => `<span class="skill-badge">${s}</span>`).join('');
    } else {
      preview.skills.innerHTML = '<span style="opacity:0.6; font-size:0.9rem;">Не указаны</span>';
    }

    // Био
    if (bio) {
      preview.bio.style.display = 'block';
      preview.bioText.textContent = bio;
    } else {
      preview.bio.style.display = 'none';
    }
  }

  function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Сохранение (показ финального вида)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Валидация
    if (!fields.fullName.value.trim() || !fields.city.value.trim() || !fields.goal.value) {
      alert('⚠️ Заполните обязательные поля: ФИО, Город и Цель');
      return;
    }

    // Анимация "сохранения"
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✅ Сохранено!';
    submitBtn.style.background = 'var(--success)';
    
    // Показываем готовую карточку на весь экран (опционально)
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      alert('✅ Анкета сохранена! Теперь вы видны другим участникам в поиске команды.');
    }, 1000);
  });

  // Очистка формы
  resetBtn.addEventListener('click', () => {
    if (confirm('🗑️ Очистить все поля?')) {
      form.reset();
      previewContent.style.display = 'block';
      profileCard.style.display = 'none';
    }
  });

  // Инициализация
  updatePreview();
});