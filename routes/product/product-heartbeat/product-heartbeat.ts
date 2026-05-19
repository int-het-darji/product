import express, { NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { Product } from "../../../models/product";
import redis from "../../../config/redis";
import { responseHandler, validateRequest } from "../../../middleware"
import { productHeartBeatValidation } from "../product-heartbeat/product-heartbeat-validation"

const router = express.Router();

router.post(
  "/v1/heartbeat/:id",
  responseHandler,
  productHeartBeatValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
    
      const {userId} = req.body;

      logger.info({
        id,userId
      }, "ids")

      const data = await Product.findById(id)

      const redisKey =
        `product:${id}:viewers`;

      await redis.sadd(
        redisKey,
        userId
      )

      await redis.expire(
        redisKey,
        30
      );

      const viewers = await redis.scard(redisKey);

      res.status(200).json({
        success: true,
        productId: id,
        activeViewers: viewers
      });

    } catch (error: any) {
      logger.error(`Product hertbeat error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
  },
);

export default router;