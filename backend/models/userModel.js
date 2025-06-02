import { Sequelize, BIGINT } from "sequelize";

import sequelize from "./db.js";

const { DataTypes } = Sequelize;

const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER, // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
      primaryKey: true, // Define the field as primary key
      autoIncrement: true, // Add auto-increment
    },
    username: {
      type: DataTypes.CHAR, // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },

    password_hash: {
      type: DataTypes.CHAR, // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    role: {
      type: DataTypes.TEXT, // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },

  {
    freezeTableName: true,
    paranoid: true,
  }
);

export const findOne = (query) => Users.findOne(query);

export default Users;
