import {
  dialog,
  Menu,
  shell,
  BrowserWindow,
  SaveDialogReturnValue,
} from 'electron';
import path from 'path';

import projectDb from '../db/project';
import syncSchema from '../db/project/schema';

async function onNewClick(): Promise<void> {
  let result: SaveDialogReturnValue | null = null;
  try {
    result = await dialog.showSaveDialog({
      title: 'Create a new project',
      defaultPath: path.join(__dirname, '../assets/my_project.unat'),
      filters: [{ name: 'UNAT Project', extensions: ['unat'] }],
    });
  } catch (e) {
    console.error(e);
    return;
  }

  if (result.canceled || result.filePath === undefined) {
    return;
  }
  const { filePath } = result;

  projectDb.open(filePath);
  const db = projectDb.get();
  if (db === null) {
    console.error('Database is not initialized.');
    return;
  }
  syncSchema(db);
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
            click: onNewClick,
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
