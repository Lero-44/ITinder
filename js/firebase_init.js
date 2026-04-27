// Заглушка для Firebase Auth (демо-режим)
let currentUser = null;

export function getCurrentUser() {
  return currentUser;
}

export async function signInWithGoogle() {
  // Имитация успешного входа (позже заменим на реальный Firebase)
  currentUser = {
    uid: 'user_demo_001',
    displayName: 'Алексей Разработчик',
    email: 'alex@demo.ru',
    photoURL: null
  };
  console.log('🔑 Вход выполнен:', currentUser.displayName);
  return currentUser;
}

export function signOut() {
  currentUser = null;
  window.location.reload(); // Перезагрузка для сброса состояния
}

// Заглушка для Firestore (чтобы не падали ошибки импорта)
export const db = { 
  collection: () => ({ 
    doc: () => ({ set: () => Promise.resolve(), get: () => Promise.resolve({ data: () => ({}) }) }) 
  }) 
};