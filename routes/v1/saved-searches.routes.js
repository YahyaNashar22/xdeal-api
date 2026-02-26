// routes/v1/saved-searches.router.js
import { Router } from "express";
import {
  createSavedSearch,
  getSavedSearches,
  deleteSavedSearch,
  clearSavedSearches,
} from "../../controllers/saved-searches.controller.js";

const savedSearchesRouter = Router();

// /api/v1/saved-searches
savedSearchesRouter.post("/", createSavedSearch);
savedSearchesRouter.get("/", getSavedSearches);
savedSearchesRouter.delete("/:id", deleteSavedSearch);
savedSearchesRouter.delete("/", clearSavedSearches);

export default savedSearchesRouter;