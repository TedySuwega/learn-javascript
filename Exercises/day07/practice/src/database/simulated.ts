// Simulated in-memory database
import { User, Post, Comment, Category, PostCategory } from "../types/database";

// Simulated tables
export const tables = {
  users: [] as User[],
  posts: [] as Post[],
  comments: [] as Comment[],
  categories: [] as Category[],
  postsCategories: [] as PostCategory[],
};

// Auto-increment IDs
const nextIds = {
  users: 1,
  posts: 1,
  comments: 1,
  categories: 1,
  postsCategories: 1,
};

// Simulated database operations
export const db = {
  users: {
    insert(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
      const user: User = {
        id: nextIds.users++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      tables.users.push(user);
      return user;
    },

    findById(id: number): User | undefined {
      return tables.users.find((u) => u.id === id);
    },

    findByEmail(email: string): User | undefined {
      return tables.users.find((u) => u.email === email);
    },

    findAll(): User[] {
      return tables.users;
    },
  },

  posts: {
    insert(data: Omit<Post, "id" | "createdAt">): Post {
      // Check if user exists (foreign key constraint)
      const user = tables.users.find((u) => u.id === data.userId);
      if (!user) {
        throw new Error(
          `Foreign key violation: User ${data.userId} does not exist`,
        );
      }

      const post: Post = {
        id: nextIds.posts++,
        ...data,
        createdAt: new Date(),
      };
      tables.posts.push(post);
      return post;
    },

    findById(id: number): Post | undefined {
      return tables.posts.find((p) => p.id === id);
    },

    findByUserId(userId: number): Post[] {
      return tables.posts.filter((p) => p.userId === userId);
    },

    findAll(): Post[] {
      return tables.posts;
    },
  },

  comments: {
    insert(data: Omit<Comment, "id" | "createdAt">): Comment {
      // Check foreign keys
      const post = tables.posts.find((p) => p.id === data.postId);
      if (!post) {
        throw new Error(
          `Foreign key violation: Post ${data.postId} does not exist`,
        );
      }

      const user = tables.users.find((u) => u.id === data.userId);
      if (!user) {
        throw new Error(
          `Foreign key violation: User ${data.userId} does not exist`,
        );
      }

      const comment: Comment = {
        id: nextIds.comments++,
        ...data,
        createdAt: new Date(),
      };
      tables.comments.push(comment);
      return comment;
    },

    findByPostId(postId: number): Comment[] {
      return tables.comments.filter((c) => c.postId === postId);
    },
  },

  categories: {
    insert(data: Omit<Category, "id">): Category {
      const category: Category = {
        id: nextIds.categories++,
        ...data,
      };
      tables.categories.push(category);
      return category;
    },

    findById(id: number): Category | undefined {
      return tables.categories.find((c) => c.id === id);
    },

    findAll(): Category[] {
      return tables.categories;
    },
  },

  postsCategories: {
    // Link a post to a category
    link(postId: number, categoryId: number): PostCategory {
      // FK checks
      if (!tables.posts.find((p) => p.id === postId)) {
        throw new Error(`Post ${postId} does not exist`);
      }
      if (!tables.categories.find((c) => c.id === categoryId)) {
        throw new Error(`Category ${categoryId} does not exist`);
      }
      // Check if already linked (composite PK)
      const exists = tables.postsCategories.find(
        (pc) => pc.postId === postId && pc.categoryId === categoryId,
      );
      if (exists) {
        throw new Error(`Post ${postId} already has category ${categoryId}`);
      }
      const link: PostCategory = { postId, categoryId };
      tables.postsCategories.push(link);
      return link;
    },
    // Get all categories for a post
    findCategoriesByPostId(postId: number): Category[] {
      const categoryIds = tables.postsCategories
        .filter((pc) => pc.postId === postId)
        .map((pc) => pc.categoryId);
      return tables.categories.filter((c) => categoryIds.includes(c.id));
    },
    // Get all posts for a category (Exercise 3 requirement)
    findPostsByCategoryId(categoryId: number): Post[] {
      const postIds = tables.postsCategories
        .filter((pc) => pc.categoryId === categoryId)
        .map((pc) => pc.postId);
      return tables.posts.filter((p) => postIds.includes(p.id));
    },
  },
};
