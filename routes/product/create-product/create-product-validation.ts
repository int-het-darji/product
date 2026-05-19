import { body } from "express-validator";
import { ExpressValidatorWrapper } from "../../../utils";

export const createProductValidation = [
    ...ExpressValidatorWrapper.stringValidator([
        {
            name: "title",
            mandatory: true,
            minLength: 10,
            maxLength: 50,
            message: "Title must be a string between 2 and 50 characters."
        },
        {
            name: "desc",
            mandatory: false,
            minLength: 10,
            maxLength: 100,
            message: "Description must be a string between 2 and 50 characters."
        },
        {
            name: "brand",
            mandatory: true,
            minLength: 1,
            maxLength: 50,
            message: "Brand must be a string between 1 and 50 characters."
        }
    ]),
    ...ExpressValidatorWrapper.uuidValidator([
        {
            name: "categories_id",
            nullable: true,
            minLength: 1,
            message: "Categories ID must be a valid UUID."
        },
        {
            name: "attributes_id",
            nullable: true,
            minLength: 1,
            message: "Attributes ID must be a valid UUID."
        }
    ]),
    ...ExpressValidatorWrapper.numberValidator([
        {
            name: "rating",
            nullable: true,
            min: 1,
            max: 5,
            message: "rating Must be a number between 1 to 5"
        },
        {
            name: "discount_price",
            nullable: true,
            min: 1,
            max: 100,
            message: "Discount must be valid % from 1 to 100"
        },
        {
            name: "base_price",
            mandatory: true,
            min: 1,
            message: "Base Price must be valid Number More then 1"
        },
        {
            name: "stock",
            mandatory: true,
            min: 1,
            message: "Stock must be valid Number More then 1"
        },
    ]),
];
