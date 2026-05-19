/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExpressValidatorWrapperFields {
    name: string,
    query?: boolean,
    param?: boolean,
    mandatory?: boolean,
    nullable?: boolean,
    ifCondition?: any,
    ifConditions?: any[],
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number,
    lengthAfterDecimal?: number,
    message: string,
    isHTML?: boolean,
    customValidators?: any[]
}

