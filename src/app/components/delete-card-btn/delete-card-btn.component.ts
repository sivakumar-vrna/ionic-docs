import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from '@capacitor/dialog';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { ToastWidget } from 'src/app/widgets/toast.widget';

@Component({
  selector: 'app-delete-card-btn',
  templateUrl: './delete-card-btn.component.html',
  styleUrls: ['./delete-card-btn.component.scss'],
})
export class DeleteCardBtnComponent implements OnInit {
  @Input() cardDetail: any;
  @Output() cardDeleted = new EventEmitter();

  constructor(
    private cardService: PaymentService,
    private toast: ToastWidget
  ) { }

  ngOnInit() { }

  async onDelete() {
    const deleteCardData = {
      "stripeCustId": this.cardDetail.stripeCustId,
      "stripeCardId": this.cardDetail.stripeCardId,
    }
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Are you sure you'd like to press the red button?`,
    });

    if (value) {
      (await this.cardService.deleteCard(deleteCardData)).subscribe(
        (res: any) => {
          console.log(res);
          if (res.status.toLowerCase() === 'success' && res.statusCode == 200) {
            this.cardDeleted.emit();
            this.toast.onSuccess(res.message);
          } else {
            this.toast.onFail('Failed to delete card');
          }
        }, (err: any) => {
          this.toast.onFail('network error in delete card');
        }
      )
    }
  };
}
