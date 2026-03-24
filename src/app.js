import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  express.static(path.join(__dirname,"public")),
);
console.log(__dirname);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
