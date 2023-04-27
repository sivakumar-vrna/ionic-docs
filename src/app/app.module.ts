import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/services/auth/auth.service';
import { themeService } from './shared/services/theme/theme.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthLoginGuard } from './guards/auth-login.guard';
import { AuthGuard } from './guards/auth.guard';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        UserService,
        AuthService,
        themeService,
        AuthLoginGuard,
        AuthGuard,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { useClass: HashLocationStrategy, provide: LocationStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
