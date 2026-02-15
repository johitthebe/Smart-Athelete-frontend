// CSRF token utility functions

export function getCsrfToken(): string | null {
  const name = 'csrftoken';
  let cookieValue: string | null = null;
  
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  
  return cookieValue;
}

export async function ensureCsrfToken(): Promise<void> {
  const token = getCsrfToken();
  if (!token) {
    // Fetch CSRF token from backend
    await fetch('/api/csrf/', {
      credentials: 'include',
    });
  }
}

export function getFetchHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  return headers;
}
