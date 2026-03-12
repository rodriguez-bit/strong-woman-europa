import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from '../config/database';

export function runMigrations(): void {
  const db = getDb();

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.run(schema);

  const result = db.exec('SELECT COUNT(*) as count FROM collaborators');
  const count = result.length > 0 ? (result[0].values[0][0] as number) : 0;

  if (count === 0) {
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf-8');
      db.run(seed);
      saveDb();
      console.log('Database seeded with initial data');
    }
  }

  saveDb();
  console.log('Database migrations complete');
}
