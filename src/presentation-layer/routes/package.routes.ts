import * as express from "express";
import { DICompositionFactory } from "../../dependency-inversion.factory";
import { auth } from "../middleware/auth.middleware";
import { permit } from "../middleware/permit.middleware";
import { asyncHandler } from "../utils/async-handler";

const router = express.Router();

/**
 * POST /packages/:packageType/price
 * Add a price to an existing package
 */
router.post(
  "/:packageType/price",
  auth(),
  permit("price:create"),
  asyncHandler(async (req, res) => {
    const packageController = DICompositionFactory.composePackageDependencies();
    const result = await packageController.addPackagePrice(req.body);
    res.status(201).json(result);
  })
);

/**
 * POST /packages
 * Create a new package with initial price
 */
router.post(
  "/",
  auth(),
  permit("package:create"),
  asyncHandler(async (req, res) => {
    const packageController = DICompositionFactory.composePackageDependencies();
    const result = await packageController.createPackage(req.body);
    res.status(201).json(result);
  })
);

export default router;
