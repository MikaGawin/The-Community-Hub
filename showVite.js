require('dotenv').config({ path: '.env.development' });

console.log(process.env.VITE_TEST_VAR)
console.log("pgdatabase:", process.env.PGDATABASE);
console.log("VITE_GOOGLE_API_KEY:", process.env.VITE_GOOGLE_API_KEY);
console.log("VITE_GOOGLE_CLIENT_ID:", process.env.VITE_GOOGLE_CLIENT_ID);
