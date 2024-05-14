import sqlite3 from 'sqlite3';

let db: sqlite3.Database | null = null;

function open(path: string): void {
  db = new sqlite3.Database(path);
}

function get(): sqlite3.Database | null {
  return db;
}

function close(): void {
  if (db === null) {
    return;
  }

  db.close((err: Error | null) => {
    if (err !== null) {
      console.error(err);
    }
  });
}

export default { close, get, open };
