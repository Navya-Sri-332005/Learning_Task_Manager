export const saveAuth = (obj) => localStorage.setItem('auth', JSON.stringify(obj));
export const readAuth = () => {
  try { return JSON.parse(localStorage.getItem('auth') || 'null'); } catch (e) { return null; }
};
export const clearAuth = () => localStorage.removeItem('auth');
