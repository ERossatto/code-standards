import * as express from "express";
import { DICompositionFactory } from "../../dependency-inversion.factory";
import { auth } from "../middleware/auth.middleware";
import { permit } from "../middleware/permit.middleware";
import { asyncHandler } from "../utils/async-handler";

const router = express.Router();

/**
 * POST /municipalities
 * Create a new municipality
 */
router.post(
  "/",
  auth(),
  permit("municipality:create"),
  asyncHandler(async (req, res) => {
    const municipalityController =
      DICompositionFactory.composeMunicipalityDependencies();
    const result = await municipalityController.createMunicipality(req.body);
    res.status(201).json(result);
  })
);

/**
 * GET /municipalities/:name
 * Get municipality by name
 */
router.get(
  "/:name",
  auth(),
  permit("municipality:read"),
  asyncHandler(async (req, res) => {
    const municipalityController =
      DICompositionFactory.composeMunicipalityDependencies();
    const result = await municipalityController.getMunicipalityByName({
      name: req.params.name,
    });
    res.status(200).json(result);
  })
);

export default router;
