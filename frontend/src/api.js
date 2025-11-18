const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function api(path, { method = 'GET', body, token, qs } = {}) {
  let url = API_BASE + path;
  if (qs) {
    const params = new URLSearchParams(qs).toString();
    url += `?${params}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
