// src/api/mathApi.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function mapOperationToRoute(op: string): string {
  switch (op) {
    case 'power': return 'power';
    case 'fibonacci': return 'fibonacci';
    case 'factorial': return 'factorial';
    default: return op;
  }
}

export async function postOperation(endpoint: string, data: any): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/${mapOperationToRoute(endpoint)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Server error: ${err}`);
  }

  const json = await response.json();
  return json.result;
}
