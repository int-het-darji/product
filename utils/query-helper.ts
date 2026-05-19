/* eslint-disable @typescript-eslint/no-explicit-any */
import { validFilterFields, validSortFields } from "../enums";
import { VALID_SORT_ORDERS } from "../enums";
import { FilterOptions, QueryParams } from "../interfaces";
import { VALID_ACTIONS, VALID_METHODS } from "./constants";
import { AppError } from "./error";

export function parseQueryParams(query: any): QueryParams {
    const {
        page = '1',
        limit = '10',
        search = '',
        sortBy = 'title',
        sortOrder = 'DESC',
        filter = '{}',
    } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) throw new AppError('Page must be a positive integer.', 400);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) throw new AppError('Limit must be between 1 and 100.', 400);

    const sortByValue = validSortFields[sortBy as keyof typeof validSortFields] || 'created_at';
    const sortOrderValue = VALID_SORT_ORDERS.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Parse and validate filter
    let filterObj: FilterOptions = {};
    try {
        filterObj = typeof filter === 'string' ? JSON.parse(filter) : filter || {};
        if (typeof filterObj !== 'object' || Array.isArray(filterObj)) {
            throw new AppError('Invalid filter format. Must be a valid JSON object.', 400);
        }

        // Validate filter fields
        const invalidKeys = Object.keys(filterObj).filter(key => !validFilterFields.includes(key));
        if (invalidKeys.length) {
            throw new AppError(`Invalid filter fields: ${invalidKeys.join(', ')}.`, 400);
        }

        if (filterObj.installationStartDate) {
            const d = new Date(filterObj.installationStartDate);
            if (isNaN(d.getTime())) throw new AppError('Invalid installationStartDate date.', 400);
            filterObj.installationStartDate = d;
        }

        if (filterObj.installationEndDate) {
            const d = new Date(filterObj.installationEndDate);
            if (isNaN(d.getTime())) throw new AppError('Invalid installationEndDate date.', 400);
            filterObj.installationEndDate = d;
        }

        if (filterObj.installationDate) {
            const d = new Date(filterObj.installationDate);
            if (isNaN(d.getTime())) throw new AppError(`Invalid installationDate`, 400);
            filterObj.installationDate = d;
        }

        if (filterObj.startDate) {
            const d = new Date(filterObj.startDate);
            if (isNaN(d.getTime())) throw new AppError(`Invalid startDate`, 400);
            filterObj.startDate = d;
        }

        if (filterObj.endDate) {
            const d = new Date(filterObj.endDate);
            if (isNaN(d.getTime())) throw new AppError(`Invalid endDate`, 400);
            filterObj.endDate = d;
        }

        if (filterObj.isSolarPanelInstalled !== undefined && typeof filterObj.isSolarPanelInstalled !== 'boolean') {
            throw new AppError('isSolarPanelInstalled must be a boolean.', 400);
        }

        if (filterObj.numberOfConsumers !== undefined && typeof filterObj.numberOfConsumers !== 'number') {
            throw new AppError('numberOfConsumers must be a number.', 400);
        }
        if (filterObj.city !== undefined && typeof filterObj.city !== 'string') {
            throw new AppError('city must be a string.', 400);
        }

        if (filterObj.state !== undefined && typeof filterObj.state !== 'string') {
            throw new AppError('state must be a string.', 400);
        }

        if (filterObj.method && !VALID_METHODS.includes(filterObj.method as string)) {
            throw new AppError(`Invalid method. Must be one of: ${VALID_METHODS.join(', ')}.`, 400);
        }

        if (filterObj.action && !VALID_ACTIONS.includes(filterObj.action as string)) {
            throw new AppError(`Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}.`, 400);
        }
    } catch (error: any) {
        console.log(error)
        throw new AppError(`Invalid filter format: ${error.message}`, 400);
    }

    return {
        page: pageNum,
        limit: limitNum,
        search: search.trim(),
        sortBy: sortByValue,
        sortOrder: sortOrderValue,
        filter: filterObj,
    };
};
