import { body } from "express-validator";
import { ExpressValidatorWrapper } from "../../../utils";

export const getProductValidation = [
    ...ExpressValidatorWrapper.uuidValidator([
        {
            name: "id",
            nullable: true,
            minLength: 36,
            message: "Product ID must be a valid UUID."
        },
    ]),
];
