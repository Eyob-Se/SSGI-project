import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  "postgres",
  "postgres",
  "postgres123", // Database name, username, password
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
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
