import Database from "better-sqlite3";

const db = new Database("neurolearn.db");

// Check users table
console.log("=== Users in database ===");
const users = db.prepare("SELECT id, username, email, role, password FROM users").all();
console.log(users);

// Test login
console.log("\n=== Testing login ===");
const testEmail = "student@neurolearn.com";
const testRole = "student";
const testPassword = "password123";

const user = db.prepare("SELECT * FROM users WHERE email = ? AND role = ?").get(testEmail, testRole);
console.log(`Looking for: ${testEmail}, ${testRole}`);
console.log("Found:", user);

if (user && user.password === testPassword) {
  console.log("✅ Login successful!");
} else if (!user) {
  console.log("❌ User not found");
} else {
  console.log("❌ Password mismatch");
}
