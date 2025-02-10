import mysql from 'mysql';
import "dotenv/config";

const connection = mysql.createConnection({
  host: process.env.DB_HOST||"'localhost'",
  user: process.env.DB_USER||'root',
  password: process.env.DB_PASS||'',
  database: process.env.DB_NAME||'codeyatra_rtx'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id', connection.threadId);
});

export default connection;