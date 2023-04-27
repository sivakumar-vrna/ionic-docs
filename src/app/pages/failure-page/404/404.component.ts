import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/shared/models/auth';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AlertController, isPlatform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { StatusBarService } from 'src/app/shared/services/status-bar/status-bar.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-404',
    templateUrl: './404.component.html',
    styleUrls: ['./404.component.scss'],
})
export class ErrorFourPage implements OnInit {
    constructor() { }

    ngOnInit() { }
}