import sqlite3 from 'sqlite3';

export default function syncSchema(db: sqlite3.Database): void {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS config (
      "key" TEXT(50) NOT NULL,
      value TEXT,
      CONSTRAINT config_pk PRIMARY KEY ("key")
    );`);

    const stmt = db.prepare('INSERT INTO config(key, value) VALUES (?, ?)');
    stmt.run('db_version', '1');
    stmt.finalize();

    db.run(`CREATE TABLE IF NOT EXISTS brokers (
      "code" TEXT(15) NOT NULL,
      name TEXT NOT NULL,
      CONSTRAINT brokers_pk PRIMARY KEY ("code")
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS securities (
      "code" TEXT(15) NOT NULL,
      name TEXT NOT NULL,
      scale INTEGER,
      CONSTRAINT securities_pk PRIMARY KEY ("code")
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS accounts (
      "code" TEXT(30) NOT NULL,
      "broker_code" TEXT(15) NOT NULL,
      "security_code" TEXT(15) NOT NULL,
      name TEXT NOT NULL,
      CONSTRAINT accounts_pk PRIMARY KEY ("code"),
      CONSTRAINT accounts_brokers_fk FOREIGN KEY (broker_code) REFERENCES brokers("code"),
      CONSTRAINT accounts_securities_fk FOREIGN KEY (security_code) REFERENCES securities("code")
    );`);

    // db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    //     console.log(row.id + ": " + row.info);
    // });
  });
}
