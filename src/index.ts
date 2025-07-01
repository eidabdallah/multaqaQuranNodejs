import express, { Application } from "express";
import 'dotenv/config'
import { initApp } from "./app.router";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;
initApp(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});