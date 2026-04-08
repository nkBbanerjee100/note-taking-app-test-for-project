export const DEFAULT_NOTE_TITLE = 'Untitled';

export const normalizeTags = (tags = []) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(
    tags
      .map((tag) => String(tag).trim())
      .filter(Boolean)
  )];
};

export const normalizeNotePayload = ({
  existingNote = {},
  title = existingNote.title ?? DEFAULT_NOTE_TITLE,
  content = existingNote.content ?? '',
  tags = existingNote.tags ?? [],
  updatedAt = new Date().toISOString(),
  ...rest
} = {}) => ({
  ...existingNote,
  ...rest,
  title: String(title).trim() || DEFAULT_NOTE_TITLE,
  content: String(content),
  tags: normalizeTags(tags),
  updatedAt,
});

export const sortNotesByUpdatedAt = (notes = []) =>
  notes
    .slice()
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));

export const matchesSearchQuery = (note, query = '') => {
  const normalizedQuery = String(query).trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return (
    note.title.toLowerCase().includes(normalizedQuery) ||
    note.content.toLowerCase().includes(normalizedQuery) ||
    (note.tags || []).some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );
};

export const countWords = (text = '') => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};
