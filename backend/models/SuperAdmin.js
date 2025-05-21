// models/SuperAdmin.js
import { DataTypes } from "sequelize";
import sequelize from "db.js";

const SuperAdmin = sequelize.define(
  "SuperAdmin",
  {
    username: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      defaultValue: "super_admin",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default SuperAdmin;
