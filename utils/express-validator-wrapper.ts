/* eslint-disable no-prototype-builtins */
import { body, ValidationChain, query, param } from "express-validator";
import { IsFloatOptions, MinMaxOptions } from "express-validator/lib/options";
import { ExpressValidatorWrapperFields } from "../interfaces";
import { urlValidation, isIPAddress, restrictSpacesAfterPeriod } from "./common-custom-validators";

export class ExpressValidatorWrapper {
    // String Validator
    static stringValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else if (field.param) {
                validator = param(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            // Added isString
            if (field.isHTML) {
                validator = validator.isString().trim().withMessage(field.message).bail();
            } else {
                validator = validator.isString().trim().blacklist("<>").withMessage(field.message).bail();
            }

            // Added minLength and maxLength
            if (field.hasOwnProperty("minLength") || field.hasOwnProperty("maxLength")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("minLength")) {
                    minMaxOptions.min = field.minLength;
                }
                if (field.hasOwnProperty("maxLength")) {
                    minMaxOptions.max = field.maxLength;
                }
                validator = validator.isLength(minMaxOptions);
            }

            validator = validator.withMessage(field.message);

            // Custom validator
            (field.customValidators || []).forEach(customValidator => {
                validator = validator.custom(customValidator).withMessage(field.message).bail();
            });
            validations.push(validator);

        });
        return validations;
    };

    static numberValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else if (field.param) {
                validator = param(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            // Added isInt option with min max
            if (field.hasOwnProperty("min") || field.hasOwnProperty("max")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("min")) {
                    minMaxOptions.min = field.min;
                }
                if (field.hasOwnProperty("max")) {
                    minMaxOptions.max = field.max;
                }

                validator = validator.isInt(minMaxOptions);
            } else {
                validator = validator.isInt();
            }
            validator = validator.withMessage(field.message).bail().toInt();

            // Added minLength and maxLength
            if (field.hasOwnProperty("minLength") || field.hasOwnProperty("maxLength")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("minLength")) {
                    minMaxOptions.min = field.minLength;
                }
                if (field.hasOwnProperty("maxLength")) {
                    minMaxOptions.max = field.maxLength;
                }
                validator = validator.isLength(minMaxOptions);
            }

            validator = validator.withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static floatValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else if (field.param) {
                validator = param(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.toFloat();

            // Added isInt option with min max
            if (field.hasOwnProperty("min") || field.hasOwnProperty("max")) {
                const minMaxOptions: IsFloatOptions = {};
                if (field.hasOwnProperty("min")) {
                    minMaxOptions.min = field.min;
                }
                if (field.hasOwnProperty("max")) {
                    minMaxOptions.max = field.max;
                }

                validator = validator.isFloat(minMaxOptions);
            } else {
                validator = validator.isFloat();
            }
            validator = validator.withMessage(field.message).bail().isFloat();

            // Added minLength and maxLength
            if (field.hasOwnProperty("minLength") || field.hasOwnProperty("maxLength")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("minLength")) {
                    minMaxOptions.min = field.minLength;
                }
                if (field.hasOwnProperty("maxLength")) {
                    minMaxOptions.max = field.maxLength;
                }
                validator = validator.isLength(minMaxOptions);
            }

            validator = validator.custom((value) => restrictSpacesAfterPeriod(value, field.lengthAfterDecimal));
            validator = validator.withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static emailValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            // Added isString
            validator = validator.isString().trim().blacklist("<>").withMessage(field.message).bail();

            // Added minLength and maxLength
            if (field.hasOwnProperty("minLength") || field.hasOwnProperty("maxLength")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("minLength")) {
                    minMaxOptions.min = field.minLength;
                }
                if (field.hasOwnProperty("maxLength")) {
                    minMaxOptions.max = field.maxLength;
                }
                validator = validator.isLength(minMaxOptions);
            }

            validator = validator.isEmail().normalizeEmail({
                gmail_remove_subaddress: false,
                outlookdotcom_remove_subaddress: false,
                yahoo_remove_subaddress: false,
                icloud_remove_subaddress: false
            }).withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static urlValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            // Added isString
            validator = validator.isString().trim().blacklist("<>").withMessage(field.message).bail();

            // Added minLength and maxLength
            if (field.hasOwnProperty("minLength") || field.hasOwnProperty("maxLength")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("minLength")) {
                    minMaxOptions.min = field.minLength;
                }
                if (field.hasOwnProperty("maxLength")) {
                    minMaxOptions.max = field.maxLength;
                }
                validator = validator.isLength(minMaxOptions);
            }

            // validator = validator.isURL().withMessage(field.message);
            validator = validator.custom(urlValidation).withMessage(field.message).bail();
            validator = validator.custom((value) => !isIPAddress(value)).withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static booleanValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.isBoolean({ loose: false }).toBoolean().withMessage(field.message);
            // Custom validator
            (field.customValidators || []).forEach(customValidator => {
                validator = validator.custom(customValidator).withMessage(field.message).bail();
            });
            validations.push(validator);

        });
        return validations;
    };

    static mobileNumberValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.isMobilePhone("en-IN").withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static dateValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.isISO8601().withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static zipValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.isPostalCode("IN").withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static arrayValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            // Added minLength and maxLength
            if (field.hasOwnProperty("minLength") || field.hasOwnProperty("maxLength")) {
                const minMaxOptions: MinMaxOptions = {};
                if (field.hasOwnProperty("minLength")) {
                    minMaxOptions.min = field.minLength;
                }
                if (field.hasOwnProperty("maxLength")) {
                    minMaxOptions.max = field.maxLength;
                }
                validator = validator.isArray(minMaxOptions);
            } else {
                validator = validator.isArray();
            }
            validator = validator.withMessage(field.message).bail();
            // Custom validator
            (field.customValidators || []).forEach(customValidator => {
                validator = validator.custom(customValidator).withMessage(field.message).bail();
            });

            validator = validator.withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static uuidValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            if (field.query) {
                validator = query(field.name);
            } else if (field.param) {
                validator = param(field.name);
            } else {
                validator = body(field.name);
            }

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.isUUID().withMessage(field.message);
            validations.push(validator);

        });
        return validations;
    };

    static ipAddressValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            validator = body(field.name);

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validator = validator.isIP().withMessage(field.message);
            validations.push(validator);
        });
        return validations;
    };

    static fieldExistsValidator = (fields: ExpressValidatorWrapperFields[] = [], validations: ValidationChain[] = []) => {
        fields.forEach(field => {
            let validator: ValidationChain;
            validator = body(field.name);

            // If condition
            (field.ifConditions || []).forEach(ifCondition => {
                validator = validator.if(ifCondition);
            });

            // Custom validator
            (field.customValidators || []).forEach(customValidator => {
                validator = validator.custom(customValidator).withMessage(field.message).bail();
            });

            // Optional and mandatory validation
            if (field.mandatory) {
                validator = validator.exists().bail();
            } else {
                if (field.nullable) {
                    validator = validator.optional({ nullable: true });
                } else {
                    validator = validator.optional();
                }
            }

            validations.push(validator);
        });
        return validations;
    };
}
