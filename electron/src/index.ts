import { app, ipcMain, ipcRenderer } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron";
import { Connection, createConnection, Repository } from 'typeorm';
import { ToDo } from '../app/assets/models/ToDo';
import { DbCalendarEvent } from '../app/assets/models/dbCalendarEvent';


// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.


export interface LocalNotificationSchema {
  /**
   * The title of the notification.
   *
   * @since 1.0.0
   */
  title: string;
  /**
   * The body of the notification, shown below the title.
   *
   * @since 1.0.0
   */
  body: string;
  /**
   * Sets a multiline text block for display in a big text notification style.
   *
   * @since 1.0.0
   */
  largeBody?: string;
  /**
   * Used to set the summary text detail in inbox and big text notification styles.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  summaryText?: string;
  /**
   * The notification identifier.
   *
   * @since 1.0.0
   */
  id: number;
  /**
   * Name of the audio file to play when this notification is displayed.
   *
   * Include the file extension with the filename.
   *
   * On iOS, the file should be in the app bundle.
   * On Android, the file should be in res/raw folder.
   *
   * Recommended format is `.wav` because is supported by both iOS and Android.
   *
   * Only available for iOS and Android 26+.
   *
   * @since 1.0.0
   */
  sound?: string;
  /**
   * Set a custom status bar icon.
   *
   * If set, this overrides the `smallIcon` option from Capacitor
   * configuration.
   *
   * Icons should be placed in your app's `res/drawable` folder. The value for
   * this option should be the drawable resource ID, which is the filename
   * without an extension.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  smallIcon?: string;
  /**
   * Set a large icon for notifications.
   *
   * Icons should be placed in your app's `res/drawable` folder. The value for
   * this option should be the drawable resource ID, which is the filename
   * without an extension.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  largeIcon?: string;
  /**
   * Set the color of the notification icon.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  iconColor?: string;
  /**
   * Associate an action type with this notification.
   *
   * @since 1.0.0
   */
  actionTypeId?: string;
  /**
   * Set extra data to store within this notification.
   *
   * @since 1.0.0
   */
  extra?: any;
  /**
   * Used to group multiple notifications.
   *
   * Sets `threadIdentifier` on the
   * [`UNMutableNotificationContent`](https://developer.apple.com/documentation/usernotifications/unmutablenotificationcontent).
   *
   * Only available for iOS.
   *
   * @since 1.0.0
   */
  threadIdentifier?: string;
  /**
   * The string this notification adds to the category's summary format string.
   *
   * Sets `summaryArgument` on the
   * [`UNMutableNotificationContent`](https://developer.apple.com/documentation/usernotifications/unmutablenotificationcontent).
   *
   * Only available for iOS 12+.
   *
   * @since 1.0.0
   */
  summaryArgument?: string;
  /**
   * Used to group multiple notifications.
   *
   * Calls `setGroup()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  group?: string;
  /**
   * If true, this notification becomes the summary for a group of
   * notifications.
   *
   * Calls `setGroupSummary()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * Only available for Android when using `group`.
   *
   * @since 1.0.0
   */
  groupSummary?: boolean;
  /**
   * Specifies the channel the notification should be delivered on.
   *
   * If channel with the given name does not exist then the notification will
   * not fire. If not provided, it will use the default channel.
   *
   * Calls `setChannelId()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * Only available for Android 26+.
   *
   * @since 1.0.0
   */
  channelId?: string;
  /**
   * If true, the notification can't be swiped away.
   *
   * Calls `setOngoing()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  ongoing?: boolean;
  /**
   * If true, the notification is canceled when the user clicks on it.
   *
   * Calls `setAutoCancel()` on
   * [`NotificationCompat.Builder`](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
   * with the provided value.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  autoCancel?: boolean;
  /**
   * Sets a list of strings for display in an inbox style notification.
   *
   * Up to 5 strings are allowed.
   *
   * Only available for Android.
   *
   * @since 1.0.0
   */
  inboxList?: string[];
}

let connection: Connection;
let _calendarRepo: Repository<DbCalendarEvent>;
let _todoRepo: Repository<ToDo>;


async function get<T>(repo: Repository<T>) {
  return await repo.find();
}

async function add<T>(repo: Repository<T>, _item: T) {
  await repo.save(_item);
  return await get<T>(repo);
}

async function deleteItem<T>(repo: Repository<T>, _item: T) {
  const item = await repo.findOne(_item);
  if (item)
    await repo.remove(item);
  return await get<T>(repo);
}

app.on("ready", () => {
  myCapacitorApp.init();

  createConnection({
    type: 'sqlite',
    database: './src/assets/data/database.sqlite',
    synchronize: true,
    entities: [
      DbCalendarEvent,
      ToDo
    ]
  }).then(conn => {
    console.log('DB loaded');
    connection = conn;
    _calendarRepo = connection.getRepository(DbCalendarEvent);
    _todoRepo = connection.getRepository(ToDo);
  }, err => {
    console.error('Db Connection failed');
    console.log(err);
  })

  ipcMain.on('get', async (event: any, ...args: any[]) => {
    try {
      event.returnValue = await get<DbCalendarEvent>(_calendarRepo);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('add', async (event: any, _item: DbCalendarEvent) => {
    try {
      event.returnValue = await add<DbCalendarEvent>(_calendarRepo, _item);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('delete', async (event: any, _item: DbCalendarEvent) => {
    try {
      event.returnValue = await deleteItem<DbCalendarEvent>(_calendarRepo, _item);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('get-todo', async (event: any, ...args: any[]) => {
    try {
      event.returnValue = await get<DbCalendarEvent>(_calendarRepo);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('add-todo', async (event: any, _item: DbCalendarEvent) => {
    try {
      event.returnValue = await add<DbCalendarEvent>(_calendarRepo, _item);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('delete-todo', async (event: any, _item: DbCalendarEvent) => {
    try {
      event.returnValue = await deleteItem<DbCalendarEvent>(_calendarRepo, _item);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('notification', async(event: any, _noti: LocalNotificationSchema) => {
    new Notification(_noti.title, {
      body: _noti.body,
    });
  })
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) myCapacitorApp.init();
});

// Define any IPC or other custom functionality below here
