import express, { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils";
import { Product } from "../../../models/product";
import { createProductValidation } from "../update-product/update-product-validation";
import { responseHandler, validateRequest } from "../../../middleware";

const router = express.Router();

router.put(
  "/v1/product/:id",
  responseHandler,
  createProductValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const { title, desc, base_price, discount_price, brand, stock, rating } =
        req.body;

      const discounted_price = base_price - (base_price * discount_price) / 100;

      if (title) {
        const slug = await Product.generateUniqueSlug(title)
      }

      const product = await Product.findById(id);

      if (product == null) {
        res.sendResponse(
          {
            message: "product does not exist",
          },
          200,
        );
      }

      const update = {
        title: title || product.title,
        description: desc || product.description,
        base_price: base_price || product.base_price,
        discount_price: discounted_price || product.discount_price,
        brand: brand || product.brand,
        stock: stock || product.stock,
        rating: rating || product.rating,
      };

      const updatedProduct = await Product.updateById(id, update);

      res.sendResponse(
        {
          message: "Product Updated successfully",
          data: updatedProduct,
        },
        200,
      );
      logger.info(`update product: ${id}`);
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
