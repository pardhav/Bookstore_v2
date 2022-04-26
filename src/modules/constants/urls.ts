export const GET_ISBN_COVER_S = (isbn_id: string): string =>
  `https://covers.openlibrary.org/b/isbn/${isbn_id}.jpg`;

export const GET_ISBN_INFO = (isbn_id: string): string =>
  `https://openlibrary.org/isbn/${isbn_id}.json`;

export const GET_WORKS_INFO = (works_id: string): string =>
  `https://openlibrary.org${works_id}.json`;
