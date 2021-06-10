import { Injectable } from '@angular/core';
import { LocalNotification, LocalNotificationEnabledResult } from '@capacitor/core';
import { ElectronService } from 'ngx-electron';


export interface LocalNotificationID {
  id: number;
}

export interface LocalNotificationIDList {
  notifications: LocalNotificationID[];
}

enum NotificationPermissionState {
  denied ="denied",
  granted = "granted",
  prompt = "prompt"
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  protected pending: LocalNotification[] = [];

  constructor(
    private electronService: ElectronService
  ) { }

  async schedule(options: { notifications: LocalNotification[] }): Promise<LocalNotificationIDList> {
    if (!this.hasNotificationSupport()) {
      throw new Error('Notifications not supported in this browser.');
    }

    for (const notification of options.notifications) {
      this.sendNotification(notification);
    }

    return {
      notifications: options.notifications.map(notification => ({
        id: notification.id,
      })),
    };
  }

  async getPending(): Promise<LocalNotificationIDList> {
    return {
      notifications: this.pending,
    };
  }

  async cancel(pending: LocalNotificationIDList): Promise<void> {
    this.pending = this.pending.filter(
      notification =>
        !pending.notifications.find(n => n.id === notification.id),
    );
  }

  async areEnabled(): Promise<LocalNotificationEnabledResult> {
    const { display } = await this.checkPermissions();

    return {
      value: display === 'granted',
    };
  }

  async requestPermissions(): Promise<{ display: NotificationPermissionState }> {
    if (!this.hasNotificationSupport()) {
      throw new Error('Notifications not supported in this browser.');
    }

    const display = this.transformNotificationPermission(
      await Notification.requestPermission(),
    );

    return { display };
  }

  async checkPermissions(): Promise<{ display: NotificationPermissionState }> {
    if (!this.hasNotificationSupport()) {
      throw new Error('Notifications not supported in this browser.');
    }

    const display = this.transformNotificationPermission(
      Notification.permission,
    );

    return { display };
  }

  protected hasNotificationSupport = (): boolean => {
    if (!('Notification' in window) || !Notification.requestPermission) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      // don't test for `new Notification` if permission has already been granted
      // otherwise this sends a real notification on supported browsers
      try {
        new Notification('');
      } catch (e) {
        if (e.name == 'TypeError') {
          return false;
        }
      }
    }

    return true;
  };

  protected transformNotificationPermission(
    permission: NotificationPermission,
  ): NotificationPermissionState {
    switch (permission) {
      case 'granted':
        return NotificationPermissionState.granted;
      case 'denied':
        return NotificationPermissionState.denied;
      default:
        return NotificationPermissionState.prompt;
    }
  }

  protected sendPending(): void {
    const toRemove: LocalNotification[] = [];
    const now = new Date().getTime();

    for (const notification of this.pending) {
      if (
        notification.schedule?.at &&
        notification.schedule.at.getTime() <= now
      ) {
        this.createNotification(notification);
        toRemove.push(notification);
      }
    }

    this.pending = this.pending.filter(
      notification => !toRemove.find(n => n === notification),
    );
  }

  protected sendNotification(notification: LocalNotification): void {
    if (notification.schedule?.at) {
      const diff = notification.schedule.at.getTime() - new Date().getTime();

      this.pending.push(notification);
      setTimeout(() => {
        this.sendPending();
      }, diff);
      return;
    }
    this.createNotification(notification);
  }

  protected createNotification(notification: LocalNotification) {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.sendSync('notification', notification);
    } else {
      this.buildNotification(notification);
    }
  }

  protected buildNotification(
    notification: LocalNotification,
  ): Notification {
    const localNotification = new Notification(notification.title, {
      body: notification.body,
    });
    return localNotification;
  }
}
