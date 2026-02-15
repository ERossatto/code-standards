import * as express from "express";
import { DICompositionFactory } from "../../dependency-inversion.factory";
import { auth } from "../middleware/auth.middleware";
import { permit } from "../middleware/permit.middleware";
import { asyncHandler } from "../utils/async-handler";

const router = express.Router();

/**
 * GET /prices/history
 * Get price history for a package type
 */
router.get(
  "/history",
  auth(),
  permit("price:read"),
  asyncHandler(async (req, res) => {
    // each compose...Dependencies() already memoizes with static fields, so controllers are created only once per process and reused.
    const priceController = DICompositionFactory.composePriceDependencies();
    const result = await priceController.getPriceHistory({
      packageType: String(req.query.packageType),
      year: Number(req.query.year),
      municipalityId: req.query.municipalityId
        ? String(req.query.municipalityId)
        : undefined,
    });
    res.status(200).json(result);
  })
);

/**
 * GET /prices/current
 * Get current price for a package type
 */
router.get(
  "/current",
  auth(),
  permit("price:read"),
  asyncHandler(async (req, res) => {
    const priceController = DICompositionFactory.composePriceDependencies();
    const result = await priceController.getCurrentPrice({
      packageType: String(req.query.packageType),
      municipalityId: req.query.municipalityId
        ? String(req.query.municipalityId)
        : undefined,
    });
    res.status(200).json(result);
  })
);

/**
 * GET /prices/package/:packageType
 * Get all prices for a specific package type
 */
router.get(
  "/package/:packageType",
  auth(),
  permit("price:read"),
  asyncHandler(async (req, res) => {
    const priceController = DICompositionFactory.composePriceDependencies();
    const result = await priceController.getAllPricesForPackageType({
      packageType: req.params.packageType,
    });
    res.status(200).json(result);
  })
);

/**
 * POST /prices
 * Create a new price
 */
router.post(
  "/",
  auth(),
  permit("price:create"),
  asyncHandler(async (req, res) => {
    const priceController = DICompositionFactory.composePriceDependencies();
    const result = await priceController.createPrice(req.body);
    res.status(201).json(result);
  })
);

export default router;
