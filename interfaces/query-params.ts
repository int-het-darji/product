import { FilterOptions } from "./filter-options";

export interface QueryParams {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: string;
    filter: FilterOptions;
}
