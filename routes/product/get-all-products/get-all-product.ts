import express, { NextFunction, Request, Response } from "express";
import { logger, parseQueryParams } from "../../../utils";
import { Product } from "../../../models/product";
import { getProductValidation } from "../get-product/get-product-price-validation";
import { responseHandler, validateRequest } from "../../../middleware";

const router = express.Router();

router.get(
  "/v1/products",
  responseHandler,
  getProductValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchableFields = [
        "title",
        "description",
        "slug",
        "base_price",
        "discount_price",
        "brand",
        "stock",
        "rating",
      ];
      req.query.sortBy = "title";
      const queryParams = parseQueryParams(req.query);
      const result = await Product.find({
        queryParams,
        searchableFields,
      });
      res.sendResponse(
        {
          data: result.data,
          pagination: {
            page: queryParams.page,
            limit: queryParams.limit,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount / queryParams.limit),
          },
          message:
            result.data.length > 0
              ? "Product retrieved successfully"
              : "No Product found.",
        },
        200,
      );
    } catch (error: any) {
      logger.error(`Get All Product error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
  },
);

export default router;
