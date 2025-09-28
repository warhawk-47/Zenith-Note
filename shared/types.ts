export type ApiResponse<T = unknown> = { success: true; data: T } | { success: false; error: string };
// ZENITH NOTES TYPES
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}