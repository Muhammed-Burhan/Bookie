export type Role = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  email_verified: boolean;
  preferences?: {
    favorite_genres: string[];
    reading_goal: number;
  };
  created_at: string;
}

export interface Book {
  id: number;
  openlibrary_key: string;
  title: string;
  author: string;
  description?: string;
  first_publish_year?: number;
  cover_url?: string;
  isbn?: string;
  subjects?: string[];
  average_rating: number;
  ratings_count: number;
}

export interface Rating {
  id: number;
  user_id: number;
  book_id: number;
  score: number | null;
  ai_explanation?: string;
  is_completed: boolean;
  exchange_count: number;
  interview_data?: InterviewMessage[];
  created_at: string;
  book?: Book;
  user?: User;
}

export interface InterviewMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface Opinion {
  id: number;
  user_id: number;
  book_id: number;
  rating_id?: number;
  content: string;
  contains_spoilers: boolean;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
  user?: User;
  book?: Book;
}

export interface Suggestion {
  id: number;
  user_id: number;
  book_id?: number;
  suggested_title: string;
  suggested_author: string;
  reason: string;
  genres: string[];
  is_dismissed: boolean;
  is_read: boolean;
  created_at: string;
  book?: Book;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}
