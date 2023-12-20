import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  //prod mode
  enableProdMode();

  console.warn('console output is disabled.');

  // Don't log to console in production environment.
  if((typeof window !== 'undefined')){
    (window as any).console.log = (window as any).console.warn = (window as any).console.error = (window as any).console.info
     = (window as any).console.time = (window as any).console.timeEnd = function(){
      // Don't log anything.
    };
  }
}



function bootstrap() {
     platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(
    // err => console.log(err)
  );
   };


if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

