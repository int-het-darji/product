import { ExpressValidatorWrapper } from "../../../utils";

export const getAllConsumersValidation = [
    ...ExpressValidatorWrapper.numberValidator([
        {
            name: "page",
            query: true,
            min: 0,
            message: "Page must be a positive number"
        },
        {
            name: "limit",
            query: true,
            min: 0,
            max: 100,
            message: "Limit must be a positive number less than or equal to 100"
        }
    ]),
    ...ExpressValidatorWrapper.stringValidator([
        {
            name: "search",
            query: true,
            minLength: 0,
            maxLength: 255,
            message: "Search term must be a string with a maximum length of 255"
        },
        {
            name: "sortOrder",
            minLength: 3,
            maxLength: 4,
            query: true,
            message: "Sort order can be ascending or descending."
        },
        {
            name: "sortBy",
            query: true,
            minLength: 2,
            maxLength: 50,
            message: "Sort by must be string."
        },
        {
            // TODO: need to change this filter validation
            name: "filter",
            query: true,
            message: "Filter must be a valid objecj."
        }
    ])
];
