import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const sql = neon('postgresql://neondb_owner:npg_Bx1TcWvZwPX7@ep-dry-block-a1qgx4pt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
const db = drizzle(sql, {schema});

export default db;

