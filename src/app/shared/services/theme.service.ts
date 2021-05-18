import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

enum Cache {
  noValue = 'noValue',
  light = 'light',
  dark = 'dark'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = false;
  isDark = new BehaviorSubject<boolean>(this.darkMode);
  private cacheKey = 'mode';
  private cacheValue: Cache = Cache.noValue;

  constructor(private plt: Platform) {
    this.plt.ready().then( async() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      const { value } = await Storage.get( { key: this.cacheKey });
      if (value) {
        if (value === Cache.dark) {
          this.cacheValue = Cache.dark;
        } else {
          this.cacheValue = Cache.light;
        }
        this.setAppTheme(this.cacheValue === Cache.dark);
      }
      prefersDark.addListener((mediaQuery) => {
        this.setAppTheme(mediaQuery.matches);
      });
    });
  }

  setAppTheme(dark: boolean) {
    this.darkMode = dark;
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    this.setCache(dark);
    this.isDark.next(dark);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.setAppTheme(this.darkMode);
  }

  setCache(dark: boolean) {
    if (dark) {
      this.cacheValue = Cache.dark;
    }else {
      this.cacheValue = Cache.light;
    }
    Storage.set( {
      key: this.cacheKey,
      value: this.cacheValue
    });
  }
}
