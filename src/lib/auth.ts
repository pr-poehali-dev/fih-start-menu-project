const AUTH_API = 'https://functions.poehali.dev/b7206b81-5298-4fc2-9ee6-9b991a2a20ae';
const POSTS_API = 'https://functions.poehali.dev/698f6493-0d34-41fb-b635-8517ebf159d3';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar: string;
  is_creator: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Post {
  id: number;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  username: string;
  full_name: string;
  avatar: string;
  is_creator: boolean;
}

export const authService = {
  async register(username: string, email: string, password: string, full_name: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        username,
        email,
        password,
        full_name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        username,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  saveAuth(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },

  getAuth(): { user: User | null; token: string | null } {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: userStr ? JSON.parse(userStr) : null,
      token,
    };
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

export const postsService = {
  async getPosts(): Promise<Post[]> {
    const response = await fetch(POSTS_API, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to load posts');
    }

    return response.json();
  },

  async createPost(userId: number, content: string): Promise<{ id: number; message: string }> {
    const response = await fetch(POSTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        user_id: userId,
        content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }

    return response.json();
  },

  async likePost(postId: number): Promise<{ likes: number }> {
    const response = await fetch(POSTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'like',
        post_id: postId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to like post');
    }

    return response.json();
  },
};
