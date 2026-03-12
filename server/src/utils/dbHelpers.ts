import { getDb, saveDb } from '../config/database';

// sql.js helper: run query and return all rows as objects
export function queryAll(sql: string, params: any[] = []): any[] {
  const db = getDb();
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows: any[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// sql.js helper: run query and return first row as object
export function queryOne(sql: string, params: any[] = []): any | null {
  const db = getDb();
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

// sql.js helper: run INSERT/UPDATE/DELETE and save
export function execute(sql: string, params: any[] = []): void {
  const db = getDb();
  db.run(sql, params);
  saveDb();
}

// Get last inserted row id
export function lastInsertId(): number {
  const row = queryOne('SELECT last_insert_rowid() as id');
  return row?.id || 0;
}
