import express from "express";
const app = express();
const PORT = 6000;
import loginRouter from "./routes/login.js";
/* import createRouter from "./routes/create.js";
import getRouter from "./routes/get_data.js";
import updateRoute from "./routes/update.js";
import deleteRoutr from "./routes/delete.js"; */

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});
app.use("/login", loginRouter);
/* app.use("/create", createRouter);
app.use("/get", getRouter);
app.use("/update", updateRoute);
app.use("/delete", deleteRoutr);
 */
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
