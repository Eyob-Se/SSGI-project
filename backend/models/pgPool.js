// pgPool.js (for raw file uploads)
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pgPool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres123",
  database: "postgres",
});

export default pgPool;
