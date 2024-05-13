import {
  app,
  dialog,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import path from 'path';

import sqlite3 from 'sqlite3';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template = this.buildDefaultTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&New',
            accelerator: 'Ctrl+N',
            click: () => {
              dialog
                .showSaveDialog({
                  title: 'Create a new project',
                  defaultPath: path.join(
                    __dirname,
                    '../assets/my_portfolio.unat',
                  ),
                  filters: [{ name: 'UNAT Project', extensions: ['unat'] }],
                })
                .then((result) => {
                  if (result.canceled) {
                    return null;
                  }
                  const { filePath } = result;
                  const db = new sqlite3.Database(filePath);
                  db.serialize(() => {
                    db.run(`CREATE TABLE IF NOT EXISTS config (
                      "key" TEXT(50) NOT NULL,
                      value TEXT,
                      CONSTRAINT config_pk PRIMARY KEY ("key")
                    );`);

                    const stmt = db.prepare("INSERT INTO config(key, value) VALUES (?, ?)");
                    stmt.run("db_version", "1");
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

                  db.close();
                  return null;
                })
                .catch((e) => {
                  console.error(e);
                });
            },
          },
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Website',
            click() {
              shell.openExternal('https://github.com/ignytis/unat');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
