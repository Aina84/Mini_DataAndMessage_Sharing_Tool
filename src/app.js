import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const __dirname = path.dirname("MiniDataSharingTool/src");
app.use(
  express.static(path.join("D:/DEV ESSAIS PROJETS/MiniDataSharingTool/public")),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
