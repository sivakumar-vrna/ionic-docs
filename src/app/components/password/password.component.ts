import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  @Input() hasNumber: boolean;
  @Input() hasUpper: boolean;
  @Input() hasLower: boolean;
  @Input() hasSpecialCharacter: boolean;
  @Input() hasMinCharacter: boolean;
  constructor() { }

  ngOnInit() {
    console.log(this.hasMinCharacter);
  }

}
