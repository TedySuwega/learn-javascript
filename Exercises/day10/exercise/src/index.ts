// Test Complete Repository
import { bookRepository } from "./repositories/bookRepository";
import { userRepository } from "./repositories/userRepository";
import { Book } from "./types/book";

async function main() {
    console.log("=== Day 10: Repository Layer Advanced ===\n");
    
    // // Show initial state
    console.log("--- Initial Users ---");
    const initialUsers = await userRepository.findAll();
    console.log(`Total users: ${initialUsers.length}`);
    initialUsers.forEach(u => console.log(`  ${u.id}: ${u.name}`));
    
    // Test CREATE
    console.log("\n--- TEST: Create User ---");
    const newUser = await userRepository.create({
        name: "Diana Prince",
        email: "diana@example.com",
        password: "hashed_wonder_password"
    });
    console.log("Created:", newUser);
    
    // Verify creation
    console.log("\n--- Verify Creation ---");
    const afterCreate = await userRepository.findAll();
    console.log(`Total users now: ${afterCreate.length}`);
    afterCreate.forEach(u => console.log(`  ${u.id}: ${u.name}`));

    // Test createMany
    console.log("\n--- TEST: Create Many Users ---");
    const manyUsers = await userRepository.createMany([
        { name: "Bruce Wayne", email: "bruce@example.com", password: "hashed_batman_password" },
        { name: "Clark Kent", email: "clark@example.com", password: "hashed_superman_password" },
        { name: "Barry Allen", email: "barry@example.com", password: "hashed_flash_password" }
    ]);
    console.log("Created many users:", manyUsers);

    // Verify create many users
    console.log("\n--- Verify Create Many Users ---");
    const afterCreateMany = await userRepository.findAll();
    console.log(`Total users after create many: ${afterCreateMany.length}`);
    afterCreateMany.forEach(u => console.log(`  ${u.id}: ${u.name}`));

    // Test findById
    console.log("\n--- TEST: Find User by ID ---");
    const foundUser = await userRepository.findById(newUser.id);
    console.log("Found:", foundUser);

    // Test find if isActive is false using filters
    console.log("\n--- TEST: Find False User ---");
    const falseUser = await userRepository.findAll({ isActive: false });
    console.log("False users:", falseUser);
    falseUser.forEach(u => console.log(`  ${u.id}: ${u.name}`));

    // Test findAllIncludingDeleted
    console.log("\n--- TEST: Find All Including Deleted ---");
    const allUsersIncludingDeleted = await userRepository.findAllIncludingDeleted();
    console.log("All users including deleted:", allUsersIncludingDeleted);
    allUsersIncludingDeleted.forEach(u => console.log(`  ${u.id}: ${u.name}`));

    // Test UPDATE
    console.log("\n--- TEST: Update User ---");
    const updatedUser = await userRepository.update(newUser.id, {
        name: "Diana Prince-Wayne",
        isActive: true
    });
    console.log("Updated:", updatedUser);
    
    // Test UPDATE non-existent
    console.log("\n--- TEST: Update Non-existent User ---");
    const notFound = await userRepository.update(999, { name: "Ghost" });
    console.log("Result:", notFound);
    
    // Test DELETE
    console.log("\n--- TEST: Delete User ---");
    const deleteResult = await userRepository.delete(newUser.id);
    console.log("Delete successful:", deleteResult);
    
    // Test DELETE non-existent
    console.log("\n--- TEST: Delete Non-existent User ---");
    const deleteNotFound = await userRepository.delete(999);
    console.log("Delete result:", deleteNotFound);

    // Test deleteMany
    console.log("\n--- TEST: Delete Many Users ---");
    const deleteManyResult = await userRepository.deleteMany([manyUsers[0].id, manyUsers[1].id, manyUsers[2].id]);
    console.log("Delete many successful:", deleteManyResult);

    // Verify delete many users
    console.log("\n--- Verify Delete Many Users ---");
    const afterDeleteMany = await userRepository.findAll();
    console.log(`Total users after delete many: ${afterDeleteMany.length}`);
    afterDeleteMany.forEach(u => console.log(`  ${u.id}: ${u.name}`));

    // Test softDelete
    console.log("\n--- TEST: Soft Delete User ---");
    const softDeleteResult = await userRepository.softDelete(4);
    console.log("Soft delete successful:", softDeleteResult);
    
    // Test softDelete non-existent
    console.log("\n--- TEST: Soft Delete Non-existent User ---");
    const softDeleteNotFound = await userRepository.softDelete(999);
    console.log("Soft delete result:", softDeleteNotFound);

    // Final state
    console.log("\n--- Final Users ---");
    const finalUsers = await userRepository.findAll();
    console.log(`Total users: ${finalUsers.length}`);
    finalUsers.forEach(u => console.log(`  ${u.id}: ${u.name}`));
    
    // Test exists helper
    console.log("\n--- TEST: Exists Helper ---");
    console.log("User 1 exists:", await userRepository.exists(1));
    console.log("User 999 exists:", await userRepository.exists(999));


    console.log("=== Test Book Repository    ===\n");

    // Show initial state
    console.log("--- Initial Books ---");
    const initialBooks = await bookRepository.findAll();
    console.log(`Total books: ${initialBooks.length}`);
    initialBooks.forEach((b: Book) => console.log(`  ${b.id}: ${b.title}`));

    // Test CREATE
    console.log("\n--- TEST: Create Book ---");
    const newBook = await bookRepository.create({
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "978-0547928227",
        publishedYear: 1937,
        genre: "Fantasy"
    });
    console.log("Created:", newBook);

    // Verify creation
    console.log("\n--- Verify Creation ---");
    const afterCreateBooks = await bookRepository.findAll();
    console.log(`Total books after create: ${afterCreate.length}`);
    afterCreateBooks.forEach((b: Book) => console.log(`  ${b.id}: ${b.title}`));
    
    // Test findById
    console.log("\n--- TEST: Find Book by ID ---");
    const foundBook = await bookRepository.findById(newBook.id);
    console.log("Found:", foundBook);

    // Test findByAuthor
    console.log("\n--- TEST: Find Book by Author ---");
    const foundBookByAuthor = await bookRepository.findByAuthor("J.R.R. Tolkien");
    console.log("Found:", foundBookByAuthor);

    // Test findByIsbn
    console.log("\n--- TEST: Find Book by ISBN ---");
    const foundBookByIsbn = await bookRepository.findByIsbn("978-0547928227");
    console.log("Found:", foundBookByIsbn);

    // Test update
    console.log("\n--- TEST: Update Book ---");
    const updatedBook = await bookRepository.update(newBook.id, {
        title: "The Hobbit - The Return of the King",
        author: "J.R.R. Tolkien",
        isbn: "978-0547928227",
        publishedYear: 1954,
        genre: "Fantasy"
    });
    console.log("Updated:", updatedBook);

    // Test delete
    console.log("\n--- TEST: Delete Book ---");
    const deleteBookResult = await bookRepository.delete(newBook.id);
    console.log("Delete successful:", deleteBookResult);

    // Test delete non-existent
    console.log("\n--- TEST: Delete Non-existent Book ---");
    const deleteBookNotFound = await bookRepository.delete(999);
    console.log("Delete result:", deleteBookNotFound);

    // Final state
    console.log("\n--- Final Books ---");
    const finalBooks = await bookRepository.findAll();
    console.log(`Total books: ${finalBooks.length}`);
    finalBooks.forEach((b: Book) => console.log(`  ${b.id}: ${b.title}`));
    
    console.log("\n=== All Tests Completed ===");
}

main().catch(console.error);
