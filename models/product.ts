import { Database, TransactionClient } from "../config/database";
import {
  QueryParams,
  CreateProductInput,
} from "../interfaces";
import { ProductRow } from "../interfaces/product";

export class Product {
  static table = "products";

  static async create(
    product: CreateProductInput,
    transaction?: TransactionClient,
  ): Promise<CreateProductInput> {
    const fields = [
      "title",
      "description",
      "base_price",
      "discount_price",
      "brand",
      "stock",
      "rating",
      "slug",
    ];

    const values = fields.map(
      (f) => (product as unknown as Record<string, unknown>)[f] ?? null,
    );

    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO ${this.table} (${fields.join(
      ", ",
    )}) VALUES (${placeholders}) RETURNING * `;

    const result = await Database.query<CreateProductInput>(
      query,
      values,
      transaction,
    );

    return result.rows[0];
  }

  static async findById(id: string): Promise<ProductRow | null> {
    const query = `SELECT * FROM ${this.table} WHERE id = $1`;
    const result = await Database.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findSlug(slug: string): Promise<ProductRow | null> {
    const query = `SELECT * FROM ${this.table} WHERE slug = $1`;
    const result = await Database.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async generateUniqueSlug(
    title: string,
    count: number = 0,
  ): Promise<string> {
    const baseSlug = title.split(" ").join("-");
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    const existingSlug = await this.findSlug(slug);
    if (!existingSlug) {
      return slug;
    }
    return this.generateUniqueSlug(title, count + 1);
  }

  static async find({
    where = {},
    queryParams = {
      page: 1,
      limit: 10,
      sortBy: "title",
      sortOrder: "DESC",
    },
    searchableFields = [],
    selectFields = ["*"],
  }: {
    where?: Partial<ProductRow>;
    queryParams?: Partial<QueryParams>;
    searchableFields?: string[];
    selectFields?: string[];
  } = {}): Promise<{ data: ProductRow[]; totalCount: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "title",
      sortOrder = "DESC",
      filter = {},
    } = queryParams;
    const offset = (page - 1) * limit;

    console.log("query params", queryParams);

    // Modify selectFields to include feeder name if not already present
    let fieldsToSelect = selectFields.join(", ");

    let query = `SELECT ${fieldsToSelect} FROM ${this.table}`;
    let countQuery = `SELECT COUNT(*) FROM ${this.table}`;

    const queryParamsList: (string | number | Date | boolean | unknown)[] = [];
    const countParams: (string | number | Date | boolean | unknown)[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    const conditions: string[] = [];

    // Handle basic where conditions
    const whereKeys = Object.keys(where);
    if (whereKeys.length) {
      // conditions.push(...whereKeys.map((k, i) => `${k} = $${paramIndex + i}`));
      conditions.push(
        ...whereKeys.map((k, i) => {
          return `products.${k} = $${paramIndex + i}`;
        }),
      );
      queryParamsList.push(
        ...whereKeys.map(
          (k) => (where as unknown as Record<string, unknown>)[k],
        ),
      );
      countParams.push(
        ...whereKeys.map(
          (k) => (where as unknown as Record<string, unknown>)[k],
        ),
      );
      paramIndex += whereKeys.length;
    } else {
      conditions.push("1=1");
    }

    // Handle search (ILIKE)
    if (search && searchableFields.length) {
      const searchClause = searchableFields
        .map((field) => `products.${field} ILIKE $${paramIndex++}`)
        .join(" OR ");
      conditions.push(`(${searchClause})`);
      searchableFields.forEach(() => {
        queryParamsList.push(`%${search}%`);
        countParams.push(`%${search}%`);
      });
    }

    // Handle advanced filters

    // Combine conditions
    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add sorting and pagination
    query += ` ORDER BY products.${sortBy} ${sortOrder} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParamsList.push(limit, offset);

    console.log("Query", query);
    console.log("queryParamsList", queryParamsList);

    try {
      const [dataResult, countResult] = await Promise.all([
        Database.query<ProductRow>(query, queryParamsList),
        Database.query<{ count: string }>(countQuery, countParams),
      ]);

      return {
        data: dataResult.rows,
        totalCount: parseInt(countResult.rows[0].count, 10),
      };
    } catch (error: any) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async updateById(
    id: string,
    update: Partial<ProductRow>,
    transaction?: TransactionClient,
  ): Promise<ProductRow | null> {
    const keys = Object.keys(update);
    if (!keys.length) throw new Error("No update fields provided");
    const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = [
      id,
      ...keys.map((k) => (update as unknown as Record<string, unknown>)[k]),
    ];
    const query = `UPDATE ${this.table} SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await Database.query<ProductRow>(query, values, transaction);
    return result.rows[0] || null;
  }

  static async findByIds(ids: string[], selectFields: string[] = ['*'], transaction?: TransactionClient): Promise<ProductRow[]> {
    if (!ids || ids.length === 0) return [];
    
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");
    const inClause = `IN (${placeholders})`;
    const fields = selectFields.join(", ");
    
    const query = `SELECT ${fields} FROM ${this.table} WHERE id ${inClause}`;
    const result = await Database.query(query, ids, transaction);
    return result.rows;
  }

  static async deleteByIds(ids: string[], transaction?: TransactionClient): Promise<{id: string}[]> {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const query = `DELETE FROM ${this.table} WHERE id IN (${placeholders}) RETURNING id`;

    console.log("delete query", query);

    const result = await Database.query<{id: string}>(query, [...ids], transaction);
    return result.rows;
  }
}
