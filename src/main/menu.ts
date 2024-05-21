import { dialog, Menu, shell, BrowserWindow } from 'electron';
import path from 'path';

import projectDb from '../db/project';
import syncSchema from '../db/project/schema';

async function onNewClick(): Promise<void> {
  const filePath: string | undefined = dialog.showSaveDialogSync({
    title: 'Create a new project',
    defaultPath: path.join(__dirname, '../my_project.unat'),
    filters: [{ name: 'UNAT Project', extensions: ['unat'] }],
  });

  if (filePath === undefined) {
    return;
  }

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
    this.onOpenClick = this.onOpenClick.bind(this);
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
            click: this.onOpenClick,
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

  onOpenClick(): void {
    // TODO: check the "promptToCreate" property. Potentially can use it in new file creation
    // TODO: Can New / Open methods be merged or at least some functionality be re-used?
    const files: string[] | undefined = dialog.showOpenDialogSync({
      title: 'Open a project',
      filters: [{ name: 'UNAT Project', extensions: ['unat'] }],
      properties: ['openFile'],
    });

    if (files === undefined) {
      return;
    }
    const filePath = files[0];

    projectDb.open(filePath);
    const db = projectDb.get();
    if (db === null) {
      console.error('Database is not initialized.');
    }

    this.mainWindow.webContents.send('app:project:loaded');
  }
}
