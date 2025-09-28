import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!res.ok) {
    // Handle non-2xx responses by trying to parse an error message
    try {
      const errorJson = await res.json() as { error?: string };
      throw new Error(errorJson.error || `Request failed with status ${res.status}`);
    } catch (e) {
      // If parsing fails, throw a generic error
      throw new Error(`Request failed with status ${res.status}`);
    }
  }
  const json = (await res.json()) as ApiResponse<T>;
  if (json.success) {
    return json.data;
  }
  // Handle successful responses that indicate a business logic failure
  throw new Error(json.error || 'An unknown API error occurred');
}