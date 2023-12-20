import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent {
  @Input() hasNumber: boolean;
  @Input() hasUpper: boolean;
  @Input() hasLower: boolean;
  @Input() hasSpecialCharacter: boolean;
  @Input() hasMinCharacter: boolean;
  constructor() { }


}
