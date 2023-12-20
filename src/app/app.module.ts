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
import { LocationStrategy, PathLocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';

// Import Firebase modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import firebase from 'firebase/compat/app';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
firebase.initializeApp(environment.firebase);



@NgModule({
    declarations: [
        AppComponent,
        
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        //firebase modules
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule, 
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
        // { provide: LocationStrategy, useClass: PathLocationStrategy },
        SocialSharing,
        FormBuilder,
        ReactiveFormsModule,
        DatePipe,
        NativeGeocoder,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
