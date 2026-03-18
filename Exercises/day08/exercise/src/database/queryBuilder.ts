// Simple SQL Query Builder (simulated)

interface WhereCondition {
    field: string;
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "IN";
    value: any;
    connector: "AND" | "OR";
}

interface QueryResult {
    sql: string;
    params: any[];
}

export class QueryBuilder {
    private table: string = "";
    private selectFields: string[] = ["*"];
    private whereConditions: WhereCondition[] = [];
    private orderByField: string = "";
    private orderDirection: "ASC" | "DESC" = "ASC";
    private limitCount: number = 0;

    from(table: string): QueryBuilder {
        this.table = table;
        return this;
    }

    select(...fields: string[]): QueryBuilder {
        this.selectFields = fields.length > 0 ? fields : ["*"];
        return this;
    }

    where(field: string, operator: WhereCondition["operator"], value: any): QueryBuilder {
        this.whereConditions.push({ field, operator, value, connector: "AND" });
        return this;
    }

    orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): QueryBuilder {
        this.orderByField = field;
        this.orderDirection = direction;
        return this;
    }
    
    limit(count: number): QueryBuilder {
        this.limitCount = count;
        return this;
    }

    orWhere(field: string, operator: WhereCondition["operator"], value: any): QueryBuilder {
        this.whereConditions.push({ field, operator, value, connector: "OR" });
        return this;
    }

    whereIn(field: string, values: any[]): QueryBuilder {
        this.whereConditions.push({ field, operator: "IN", value: values, connector: "AND" });
        return this;
    }

    buildSelect(): QueryResult {
        let sql = `SELECT ${this.selectFields.join(", ")} FROM ${this.table}`;
        const params: any[] = [];
        
        if (this.whereConditions.length > 0) {
            const clauseParts: string[] = [];

            for (const cond of this.whereConditions) {
                let clause: string;

                if (cond.operator === "IN") {
                    const placeholders = cond.value.map((_: any) => {
                        params.push(_);
                        return `$${params.length}`;
                    });
                    clause = `${cond.field} IN (${placeholders.join(", ")})`;
                } else {
                    params.push(cond.value);
                    clause = `${cond.field} ${cond.operator} $${params.length}`;
                }

                if (clauseParts.length === 0) {
                    clauseParts.push(clause);
                } else {
                    clauseParts.push(`${cond.connector} ${clause}`);
                }
            }

            sql += ` WHERE ${clauseParts.join(" ")}`;
        }
        
        if (this.orderByField) {
            sql += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
        }
        
        if (this.limitCount > 0) {
            sql += ` LIMIT ${this.limitCount}`;
        }
        
        return { sql, params };
    }

    reset(): QueryBuilder {
        this.table = "";
        this.selectFields = ["*"];
        this.whereConditions = [];
        this.orderByField = "";
        this.orderDirection = "ASC";
        this.limitCount = 0;
        return this;
    }
}

// INSERT query builder
export function buildInsert(table: string, data: Record<string, any>): QueryResult {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    
    const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
    
    return { sql, params: values };
}

// UPDATE query builder
export function buildUpdate(table: string, data: Record<string, any>, whereId: number): QueryResult {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setClauses = fields.map((field, i) => `${field} = $${i + 1}`);
    values.push(whereId);
    
    const sql = `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    
    return { sql, params: values };
}

// DELETE query builder
export function buildDelete(table: string, whereId: number): QueryResult {
    return {
        sql: `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
        params: [whereId]
    };
}