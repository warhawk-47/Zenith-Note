import type { Note } from './types';
const now = Date.now();
export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Welcome to Zenith Notes',
    content: 'This is a sample note to get you started. Feel free to edit or delete it.\n\nZenith Notes offers a clean, fast, and beautiful note-taking experience, powered by Cloudflare.',
    createdAt: now - 1000 * 60 * 60 * 24,
    updatedAt: now - 1000 * 60 * 60 * 24,
  },
  {
    id: 'note-2',
    title: 'Markdown Support',
    content: 'You can use Markdown to format your notes.\n\n# Heading 1\n## Heading 2\n\n- List item 1\n- List item 2\n\n*Italic text*\n**Bold text**\n`code snippet`',
    createdAt: now - 1000 * 60 * 30,
    updatedAt: now - 1000 * 60 * 30,
  },
  {
    id: 'note-3',
    title: 'Meeting Notes - Project Phoenix',
    content: 'Attendees: Alice, Bob, Charlie\n\nKey discussion points:\n1. Finalize Q3 roadmap.\n2. Review user feedback from the latest release.\n3. Plan the next marketing campaign.',
    createdAt: now,
    updatedAt: now,
  },
];