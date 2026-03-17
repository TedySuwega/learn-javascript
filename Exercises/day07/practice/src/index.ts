// Test database concepts
import { db, tables } from "./database/simulated";

console.log("=== Day 07: Database Fundamentals ===\n");

// Create users
console.log("--- Creating Users ---");
const alice = db.users.insert({
  name: "Alice",
  email: "alice@example.com",
  password: "hashed_password",
  isActive: true,
});
console.log("Created:", alice);

const bob = db.users.insert({
  name: "Bob",
  email: "bob@example.com",
  password: "hashed_password",
  isActive: true,
});
console.log("Created:", bob);

// Create posts (with foreign key to users)
console.log("\n--- Creating Posts ---");
const post1 = db.posts.insert({
  userId: alice.id, // Foreign key reference
  title: "My First Post",
  content: "Hello World!",
  isPublished: true,
});
console.log("Created:", post1);

const post2 = db.posts.insert({
  userId: alice.id,
  title: "Second Post",
  content: "More content here",
  isPublished: false,
});
console.log("Created:", post2);

// Try to create post with non-existent user
console.log("\n--- Foreign Key Violation Test ---");
try {
  db.posts.insert({
    userId: 999, // User doesn't exist!
    title: "Invalid Post",
    content: "This should fail",
    isPublished: false,
  });
} catch (error) {
  console.log("Error caught:", (error as Error).message);
}

// Create comments
console.log("\n--- Creating Comments ---");
const comment1 = db.comments.insert({
  postId: post1.id,
  userId: bob.id,
  text: "Great post!",
});
console.log("Created:", comment1);

// Query relationships
console.log("\n--- Querying Relationships ---");
console.log(
  "All users:",
  db.users.findAll().map((u) => u.name),
);
console.log(
  "Alice's posts:",
  db.posts.findByUserId(alice.id).map((p) => p.title),
);
console.log(
  "Comments on post 1:",
  db.comments.findByPostId(post1.id).map((c) => c.text),
);

// Create categories
const techCategory = db.categories.insert({ name: "Tech", description: "Technology posts" });
const tutorialCategory = db.categories.insert({ name: "Tutorial", description: "How-to guides" });

// Assign categories to posts
db.postsCategories.link(post1.id, techCategory.id);
db.postsCategories.link(post1.id, tutorialCategory.id);
db.postsCategories.link(post2.id, techCategory.id);

console.log("\n--- Querying Posts by Category ---");
console.log("Tech posts:", db.postsCategories.findPostsByCategoryId(techCategory.id).map(p => p.title));
console.log("Tutorial posts:", db.postsCategories.findPostsByCategoryId(tutorialCategory.id).map(p => p.title));


// Show table structure
console.log("\n--- Current Database State ---");
console.log("Users table:", tables.users.length, "rows");
console.log("Posts table:", tables.posts.length, "rows");
console.log("Comments table:", tables.comments.length, "rows");
console.log("Categories table:", tables.categories.length, "rows");
console.log("Posts_Categories table:", tables.postsCategories.length, "rows");

