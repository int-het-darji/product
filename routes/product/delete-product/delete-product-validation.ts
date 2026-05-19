import { ExpressValidatorWrapper } from "../../../utils";
import { body } from "express-validator";

export const deleteConsumerValidation = [
    ...ExpressValidatorWrapper.arrayValidator([
        {
            name: "productIds",
            mandatory: true,
            minLength: 1,
            maxLength: 100,
            message: "Product IDs must be a non-empty array of valid UUIDs"
        }
    ]),
    ...ExpressValidatorWrapper.uuidValidator([
        {
            name: "ProductIds.*",
            ifConditions: [body("ProductIds").exists()],
            mandatory: true,
            message: "Each Product ID must be a valid UUID."
        }
    ])
];
