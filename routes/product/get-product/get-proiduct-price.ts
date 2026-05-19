import express, { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { Product } from "../../../models/product";
import redis from "../../../config/redis";
import { getProductValidation } from "../get-product/get-product-price-validation"
import { responseHandler, validateRequest } from "../../../middleware"

const router = express.Router();

router.get(
  "/v1/getprice/:id",
  responseHandler,
  getProductValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const maxViewrs = 1;
      let dsPrice: number;
      logger.info(
        {
          id,
        },
        "Product Id",
      );
      const data = await Product.findById(id);
      if(data == null) {
        res.sendResponse({
          message: "Product does not exist"
        }, 400)
      }
      const redisKey = `product:${id}:viewers`;
      const viewers = await redis.scard(redisKey);
      if (viewers > maxViewrs) {
        dsPrice = data.discount_price * 1.1;
      }
      if (data.stock < 100 && viewers > maxViewrs) {
        dsPrice = data.discount_price * 1.2;
      }
      res.sendResponse({
        message: "Product Fetch successfully",
        data: data,
        baseprice: dsPrice,
      }, 201)
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
