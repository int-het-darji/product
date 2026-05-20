import express, { NextFunction, Request, Response } from "express";
import { Product } from "../../../models";
import { validateRequest } from "../../../middleware/validate-request";
import { updateProductByIdValidation } from "./update-product-by-id.validation";
import { AppError, InternalServerError, NotFoundError, snakeToCamel, logger, FLOAT_TOLERANCE } from "./utils";
import { Products, Product_attributes } from "../../../interfaces";
 
const router = express.Router();
 
router.put(
    "/v1/update-product/:id",
    updateProductByIdValidation,
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
 
            const {
                title, description, slug, basePrice, discountPrice, discountPercent, currency, brand, categoryId, stock, ratingValue, totalRatings, totalReviews, highlights, isActive, isDeleted, attributes
            } = req.body;
 
            const existingProduct = await Product.findById(id);
 
            if (!existingProduct) {
                throw new NotFoundError("Product not found.");
            }
 
            if (slug) {
                const existingSlug = await Product.findOne({ slug });
 
                if (existingSlug && existingSlug.id !== id) {
                    throw new AppError("Slug already exists.", 400);
                }
            }
 
            if (
                discountPrice !== undefined &&
                basePrice !== undefined &&
                Number(discountPrice) > Number(basePrice)
            ) {
                throw new AppError("Discount price cannot be greater than base price.",400);
            }
 
            const fieldsToCompare: Array<keyof Products> = [
                "title", "description", "slug", "base_price", "discount_price","discount_percent", "currency", "brand", "category_id", "stock","rating_value", "total_ratings", "total_reviews", "highlights","is_active", "is_deleted", "attributes"
            ];
 
             const updateFields = getChangedFields(
                {
                    title,
                    description,
                    slug,
                    base_price: basePrice,
                    discount_price: discountPrice,
                    discount_percent: discountPercent,
                    currency,
                    brand,
                    category_id: categoryId,
                    stock,
                    rating_value: ratingValue,
                    total_ratings: totalRatings,
                    total_reviews: totalReviews,
                    highlights,
                    is_active: isActive,
                    is_deleted: isDeleted,
                    attributes
                },
                existingProduct,
                fieldsToCompare
            );
 
            if (Object.keys(updateFields).length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "No changes detected.",
                    data: snakeToCamel(existingProduct)
                });
            }
 
            const updatedProduct = await Product.updateProduct(id, updateFields);
 
            if (!updatedProduct) {
                throw new InternalServerError(
                    "Failed to update product."
                );
            }
 
            return res.status(200).json({
                success: true,
                message: "Product updated successfully.",
                data: snakeToCamel(updatedProduct),
                modifiedProperties: snakeToCamel(updateFields)
            });
 
        } catch (error: any) {
            logger.error("Update Product Error:", error.message);
 
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            return next(error);
        }
    }
);
 
// Sort Object Keys
const sortObjectProperties = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map((item) => sortObjectProperties(item));
    } else if (obj && typeof obj === "object") {
        const sorted: any = {};
        Object.keys(obj).sort().forEach((key) => {
                sorted[key] = sortObjectProperties(obj[key]);
            });
        return sorted;
    }
    return obj;
};
 
// Compare Objects
const compareObjects = (newValue: any, oldValue: any): boolean => {
    if (!newValue && !oldValue) return true;
    if (!newValue || !oldValue) return false;
 
    const sortedNew = sortObjectProperties(newValue);
    const sortedOld = sortObjectProperties(oldValue);
 
    let parsedExisting = oldValue;
    if (typeof oldValue === 'string') {
        try {
            parsedExisting = JSON.parse(oldValue);
        } catch {
            return false;
        }
    }
 
    return JSON.stringify(sortedNew) === JSON.stringify(sortedOld);
};
 
// Compare Attributes
const compareAttributes = (newAttributes: Product_attributes[], oldAttributes: Product_attributes[]): boolean => {
    if (!newAttributes && !oldAttributes) return true;
    if (!newAttributes || !oldAttributes) return false;
 
    const normalize = (arr: Product_attributes[]) =>
        arr.map((item) => ({
                attribute_id: item.attribute_id,
                attribute_value_id: item.attribute_value_id
            }))
            .sort((a, b) =>
                a.attribute_id.localeCompare(b.attribute_id)
            );
    return (
        JSON.stringify(normalize(newAttributes)) === JSON.stringify(normalize(oldAttributes))
    );
};
 
const getChangedFields = (
    newData: Partial<Products>,
    existingData: Products,
    fields: Array<keyof Products>
): Partial<Products> => {
 
    const changes: Partial<Products> = {};
 
    for (const field of fields) {
 
        const newValue = newData[field];
        const oldValue = existingData[field];
 
        if (newValue === undefined) continue;
 
        if (["base_price", "discount_price", "discount_percent", "rating_value"].includes(field)) {
            if (
                Math.abs(Number(newValue) - Number(oldValue)) >
                FLOAT_TOLERANCE
            ) {
                changes[field] = Number(newValue) as any;
            }
            continue;
        }
 
        if (["stock", "total_ratings", "total_reviews"].includes(field)) {
            if (Number(newValue) !== Number(oldValue)) {
                changes[field] = Number(newValue) as any;
            }
            continue;
        }
 
        if (field === "highlights") {
            if (!compareObjects(newValue, oldValue)) {
                changes[field] = newValue as any;
            }
            continue;
        }
 
        if (field === "attributes") {
            if (!compareAttributes(newValue as Product_attributes[], oldValue as Product_attributes[])) {
                changes[field] = newValue as any;
            }
            continue;
        }
 
        if (newValue !== oldValue) {
            changes[field] = newValue as any;
        }
    }
    return changes;
};
 
export { router as updateProductByIdV1Router };