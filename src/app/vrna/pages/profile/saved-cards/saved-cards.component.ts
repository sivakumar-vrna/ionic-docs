import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddCardService } from '../../../../components/add-card/add-card.service';

@Component({
  selector: 'app-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.scss'],
})
export class SavedCardsComponent implements OnInit {

  @Input() cardData: any;
  @Output() onRefresh = new EventEmitter();

  constructor(
    public addCardModal: AddCardService
  ) { }

  ngOnInit() { }

  async onAddNewCard() {
    this.addCardModal.onAddNewCard().then(res => this.refresh());
  }

  refresh() {
    this.onRefresh.emit()
  }

  trackItems(index: number, itemObject: any) {
    return itemObject.stripeCardId;
  }
}
