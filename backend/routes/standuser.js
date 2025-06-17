import express from "express";
import Users from "../models/userModel.js"; // Adjust path if needed
import { Op } from "sequelize"; // Ensure you import Op

const router = express.Router();

// GET all users by specific user types
router.get("/", async (req, res) => {
  try {
    // Define the user types you want to filter
    const allowedUserTypes = ["Standard"];

    const users = await Users.findAll({
      where: {
        usertype: {
          [Op.in]: allowedUserTypes, // Filter by allowed user types
        },
      },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new user
router.post("/", async (req, res) => {
  try {
    const { fname, lname, password, usertype, email } = req.body;
    const newUser = await Users.create({
      fname,
      lname,
      password,
      usertype,
      email,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update user by ID
router.put("/:id", async (req, res) => {
  try {
    const { fname, lname, password, usertype, email, isActive } = req.body;
    const [updated] = await Users.update(
      { fname, lname, password, usertype, email, isActive },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedUser = await Users.findOne({ where: { id: req.params.id } });
      return res.json(updatedUser);
    }
    res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (soft delete) user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy(); // With paranoid: true, this is a soft delete
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
