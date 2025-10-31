// Database Types
export interface Post {
  id: number;
  title: string;
  image: string;
  category_id: number;
  description: string;
  content: string;
  date: Date;
  status_id: number;
  likes_count: number;
}

export interface PostWithDetails extends Post {
  category_name: string;
  status_name: string;
}

export interface CreatePostInput {
  title: string;
  image: string;
  category_id: number;
  description: string;
  content: string;
  status_id: number;
}

export interface UpdatePostInput extends CreatePostInput {}

export interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  status: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

