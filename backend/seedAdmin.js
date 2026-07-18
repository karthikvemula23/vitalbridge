import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/adminModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error(err));

const seedAdmin = async () => {
  try {
    await Admin.deleteMany({ email: "karthik@admin.com" });

    const admin = new Admin({
      name: "Vemula Karthik",
      email: "karthik@admin.com",
      password: "Vital@2026",
      role: "admin",
    });

    await admin.save();
    console.log("Admin seeded successfully ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();