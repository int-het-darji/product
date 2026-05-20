import express, { NextFunction, Request, Response } from "express";
import { AppError, InternalServerError, logger } from "../../../utils";
import { Product } from "../../../models/product";
import { createProductValidation } from "../update-product/update-product-validation";
import { responseHandler, validateRequest } from "../../../middleware";
import { error } from "console";
import { ProductRow } from "../../../interfaces/product";

const router = express.Router();

router.put(
  "/v1/product/:id",
  responseHandler,
  createProductValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      let slug: any;
      let discounted_price: any;
      const { title, desc, base_price, discount_price, brand, stock, rating } =
        req.body;

      console.log(req.body, "req.body");

      const product = await Product.findById(id);

      console.log(product, "product");

      if (!product) {
        return res.sendResponse(
          {
            message: "product does not exist",
          },
          404,
        );
      }

      if (title) {
        slug = await Product.generateUniqueSlug(title);
        console.log(slug, "slug");
      }

      if (discount_price) {
        const finalBasePrice = base_price ?? product.base_price;
        console.log(finalBasePrice, "finalbaseprice");

        const finalDiscount = discount_price;
        console.log(finalDiscount, "final discount");
        discounted_price =
          finalBasePrice - (finalBasePrice * finalDiscount) / 100;

        console.log(discounted_price, discount_price, "discounted_price");
      }

      if (discount_price !== undefined && Number(discount_price) > 70) {
        throw new AppError("Discount cannot be more than 70 percent", 400);
      }

      const fieldsToCompare: Array<keyof ProductRow> = [
        "title",
        "description",
        "base_price",
        "discount_price",
        "brand",
        "stock",
        "rating",
        "slug",
      ];
      console.log(fieldsToCompare, "fieldsTocompare");
      const updateFields = getChangedFields(
        {
          title,
          description: desc,
          base_price,
          discount_price: discounted_price,
          brand,
          stock,
          rating,
          slug,
        },
        product,
        fieldsToCompare,
      );

      console.log(updateFields, "updateFields");

      if (Object.keys(updateFields).length === 0) {
        return res.sendResponse(
          {
            message: "No changes detected",
          },
          200,
        );
      }

      const updatedProduct = await Product.updateById(id, updateFields);

      if (!updatedProduct)
        throw new InternalServerError("failed to update product");

      logger.info(`update product: ${id}`);
      return res.sendResponse(
        {
          message: "Product updated successfully",
          data: updatedProduct,
          modifiedProperties: updateFields,
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

const getChangedFields = (
  newData: Partial<ProductRow>,
  existingData: ProductRow,
  fieldsToCompare: Array<keyof ProductRow>,
): Partial<ProductRow> => {
  const changedFields: Partial<ProductRow> = {};

  console.log(changedFields, "first time");

  for (const field of fieldsToCompare) {
    const newValue = newData[field];
    const oldValue = existingData[field];

    console.log(newValue, oldValue, field, "first time");

    if (newValue === undefined) continue;

    if (["base_price", "discount_price", "stock", "rating"].includes(field)) {
      if (Math.abs(Number(newValue) - Number(oldValue)) > 0.000001) {
        (changedFields as Record<string, any>)[field] = Number(newValue);
      }
      continue;
    }

    if (newValue !== oldValue) {
      (changedFields as Record<string, any>)[field] = newValue;
    }
  }
  console.log(changedFields, "final result");
  return changedFields;
};

export default router;
