import { Api } from './generated/api';

export const api = new Api({
  baseUrl: 'http://localhost:8080',
  baseApiParams: {
    secure: true, // ← ГЛОБАЛЬНО
  },
    securityWorker: () => {
    // ЧИТАЕМ ТОКЕН ИЗ localStorage ПРИ КАЖДОМ ВЫЗОВЕ (не при импорте!)
    const token = localStorage.getItem('authToken');
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`, // именно так — Bearer + пробел
        },
      };
    }
    return {}; // без токена — без заголовка
  },
});