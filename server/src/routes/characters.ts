import { Router } from "express";
import { CHARACTER_LIBRARY } from "../data/characters.js";

export const charactersRouter = Router();

charactersRouter.get("/characters", (_req, res) => {
  res.json({ characters: CHARACTER_LIBRARY });
});
