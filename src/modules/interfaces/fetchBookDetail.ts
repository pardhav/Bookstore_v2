export interface Timestamp {
  type: string;
  value: Date | string;
}

export interface IDetail {
  key: string;
}

export interface BookDetails {
  publishers: string[];
  physical_format: string;
  last_modified: Timestamp;
  title: string;
  full_title?: string;
  number_of_pages: number;
  covers: number[];
  created: Timestamp;
  languages: IDetail[];
  isbn_10: string[];
  publish_date: string;
  key: string;
  latest_revision: number;
  publish_places: string[];
  works: IDetail[];
  type: IDetail;
  revision: number;
}
export interface Excerpt {
  comment: string;
  author: IDetail;
  excerpt: string;
}
export interface Link {
  url: string;
  title: string;
  type: IDetail;
}
export interface Author {
  author: IDetail;
  type: IDetail;
}
export interface Works {
  description: string | Timestamp;
  links: Link[];
  title: string;
  covers: number[];
  subject_places: string[];
  subject_people: string[];
  key: string;
  authors: Author[];
  excerpts: Excerpt[];
  type: IDetail;
  subjects: string[];
  latest_revision: number;
  revision: number;
  created: Timestamp;
  last_modified: Timestamp;
}
