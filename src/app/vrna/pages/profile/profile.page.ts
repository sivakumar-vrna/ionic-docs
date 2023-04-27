import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  activeTab: number = 1;
  personalData: any;
  profileInfoForm: FormGroup;
  userId: number;
  cardData: any;
  userImage: any;
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  constructor(
    private profileService: ProfileService,
    private toast: ToastWidget,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.userId = await this.userService.getUserId();

    await this.getProfileData();
  }

  async getProfileData() {
    (await this.profileService.getProfile()).subscribe(async (res) => {
      console.log(res);
      if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
        this.personalData = res.data.user_info;
        this.cardData = res.data.card_info;
        console.log(this.personalData);
        console.log(this.cardData);
      } else {
        await this.toast.onFail('Error in the request');
      }
    }, (err: any) => {
      this.toast.onFail('Network Error');
    });
  }

  onSelection(n) {
    this.activeTab = n;
  }

  onDeviceSelection(n) {
    if (this.activeTab === n) {
      this.activeTab = 0;
    } else {
      this.activeTab = n;
    }
    console.log(this.activeTab)
  }

  onRefresh(event) {
    console.log('Begin async operation');
    this.getProfileData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
