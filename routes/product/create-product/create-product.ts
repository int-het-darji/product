import express, { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { Product } from "../../../models/product";
import { createProductValidation } from "../create-product/create-product-validation"
import { validateRequest, responseHandler } from "../../../middleware"
const router = express.Router();

router.post(
  "/v1/create-product",
  responseHandler,
  createProductValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, desc, base_price, discount_price, brand, stock, rating } =
        req.body;
      const discounted_price = base_price - (base_price * discount_price) / 100;

      const slug = await Product.generateUniqueSlug(title)

      const product = await Product.create({
        title,
        description: desc,
        base_price,
        discount_price: discounted_price,
        brand,
        stock,
        rating,
        slug,
      });
      logger.info(
        {
          title,
          brand,
          stock,
        },
        "the product created",
      );
      res.sendResponse(
        {
          message: "Product Created successfully"
        },
        201,
        {
          targetType: "Product",
          action: "create",
          newData: product,
        }
      )
    } catch (error: any) {
      logger.error(`Create Product error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
  },
);

export default router;
