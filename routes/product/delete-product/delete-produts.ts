import express, { NextFunction, Request, Response } from "express";
import { logger, parseQueryParams } from "../../../utils";
import { Product } from "../../../models/product";
import { deleteConsumerValidation } from "../delete-product/delete-product-validation";
import { responseHandler, validateRequest } from "../../../middleware";

const router = express.Router();

router.delete(
  "/v1/products/delete",
  responseHandler,
  deleteConsumerValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productIds }: { productIds: string[] } = req.body;

      const uniqueProductIds = [...new Set(productIds)];

      const foundProducts = await Product.findByIds(uniqueProductIds);

      const foundProductIds = foundProducts.map((p) => p.id);

      const notFoundIds = uniqueProductIds.filter(
        (id) => !foundProductIds.includes(id),
      );

      const deletedProducts = await Product.deleteByIds(foundProductIds);

      logger.info(
        {
          deletedCount: deletedProducts.length,
          deletedIds: foundProductIds,
        },
        "Products deleted successfully",
      );

      return res.sendResponse(
        {
          message: "Products deleted successfully",
          deletedProducts,
          notFoundIds,
        },
        200,
        {
          targetType: "Product",
          action: "delete",
          oldData: foundProducts,
        },
      );
    } catch (error: any) {
      logger.error(`Delete Product error: ${error.message}`);

      res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
  },
);

export default router;
