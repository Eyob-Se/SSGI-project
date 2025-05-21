import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: false,
    timezone: "Africa/Nairobi", // timezone for East Africa (Kenya)
  }
);

// Sync all defined models to the database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Sequelize sync successful");
  })
  .catch((error) => {
    console.error("Sequelize sync error:", error);
  });

export default sequelize;
