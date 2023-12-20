  import { Injectable } from '@angular/core';
  import { Platform } from '@ionic/angular';
  import { BehaviorSubject } from 'rxjs';

  type PlatformType = 'tablet' | 'desktop' | 'mobile' | 'web' | 'tv';
  @Injectable({
    providedIn: 'root'
  })
  export class PlatformService {
    private platformStatusSubject: BehaviorSubject<PlatformType>;

    constructor(private platform: Platform) {
      const initialPlatform = this.getPlatformType();
      this.platformStatusSubject = new BehaviorSubject<PlatformType>(initialPlatform);

      window.addEventListener('resize', () => {
        const currentPlatform = this.getPlatformType();
        this.platformStatusSubject.next(currentPlatform);
      });

      const currentPlatform = this.getPlatformType();
      this.platformStatusSubject.next(currentPlatform);
    }

    get platformStatus$() {
      return this.platformStatusSubject.asObservable();
    }

    private getPlatformType(): PlatformType {
      const userAgent = navigator.userAgent.toLowerCase();
    
      if (this.platform.is('tablet')) {
        return 'tablet';
      } else if (this.platform.is('desktop')) {
        return 'desktop';
      } else if (this.platform.is('mobile')) {
        return 'mobile';
      } else if (
        userAgent.includes('smarttv') ||
        userAgent.includes('tizen') ||
        userAgent.includes('web0s') ||
        userAgent.includes('linux;') ||
        userAgent.includes('netcast')
      ) {
        return 'tv';
      } else {
        return 'web';
      }
    }
    
  }
