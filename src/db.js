import pg from 'pg';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from "./config.js";
const { Pool } = pg;
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

pool.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch(err => console.error('Error al conectar a la base de datos:', err.stack));

export default pool;