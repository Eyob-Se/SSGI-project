// scripts/createSuperAdmin.js
import bcrypt from "bcrypt";
import SuperAdmin from "../model/SuperAdmin.js";
import sequelize from "../../server/db.js";

async function createSuperAdmin() {
  try {
    await sequelize.authenticate();

    const existing = await SuperAdmin.findOne({ where: { username: "admin" } });

    if (existing) {
      console.log("✅ Super admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("securepassword123", 10);

    await SuperAdmin.create({
      username: "admin",
      password_hash: hashedPassword,
    });

    console.log("✅ Super admin created successfully.");
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  } finally {
    await sequelize.close();
  }
}

createSuperAdmin();
