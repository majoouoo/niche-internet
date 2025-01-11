import postgres from 'postgres';
import 'dotenv/config';

const connectionString: string = process.env.DATABASE_URL as string;

const sql = postgres(connectionString, { ssl: 'require' });

export { sql };
