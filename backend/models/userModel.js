import { Sequelize, BIGINT } from "sequelize";

import { define } from "./db.js";

const { DataTypes } = Sequelize;

const Users = define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER, // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
      primaryKey: true, // Define the field as primary key
      autoIncrement: true, // Add auto-increment
    },
    fname: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    lname: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    email: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    password: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    phone: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    usertype: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },
    gender: {
      type: DataTypes.STRING(100), // Change datatype to character varying with length 100
      allowNull: true,
      unique: false,
    },

    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },

  {
    freezeTableName: true,
    paranoid: true,
  }
);

export default Users;
