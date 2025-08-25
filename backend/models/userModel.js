import { Sequelize } from "sequelize";
import sequelize from "./db.js";

const { DataTypes } = Sequelize;

const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },

    // ─────────── identity ───────────
    fname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // ─────────── auth / role ───────────
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    usertype: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // ─────────── status flag ───────────
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    paranoid: true, // adds deletedAt (soft-delete)
    timestamps: true, // createdAt + updatedAt
    updatedAt: false, // remove updatedAt if you don’t need it
  }
);

export const findOne = (query) => Users.findOne(query);
export default Users;
