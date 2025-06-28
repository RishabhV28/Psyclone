const BASE_URL = "http://localhost:8000";  // your FastAPI backend

export async function startSession(issue: string) {
  const response = await fetch(`${BASE_URL}/start?issue=${encodeURIComponent(issue)}`);
  return response.json();
}

export async function chatWithPatient(user_message: string, issue: string) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_message, issue })
  });
  return response.json();
}

export async function evaluateSession(user_message: string, issue: string) {
  const response = await fetch(`${BASE_URL}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_message, issue })
  });
  return response.json();
}
