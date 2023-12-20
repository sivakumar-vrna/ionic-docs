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

  keypressOnAddCardBtn(event: KeyboardEvent): void {    
    if(event.key == 'ArrowRight'){
      event.stopPropagation();
      let elem = document.getElementById('delCard-0');
      elem.focus();
    }  
  }
  keypressOnAddBtn(event: KeyboardEvent):void {
    if(event.key == 'ArrowRight' || event.key == 'ArrowLeft' || event.key == 'ArrowDown'){
      event.stopPropagation();
      event.preventDefault();
    } 
    if(event.key == 'ArrowUp'){
      let elem:any;
      elem = document.getElementById('delCard-0');
      if(!elem){
        elem = document.getElementById('tabCards');
      }
      if(elem){
        event.stopPropagation();
        elem.focus();
        event.preventDefault();
      }
    }
  }
  keypressOndeletedIcon(event:KeyboardEvent):void{
    if(event.key == 'ArrowRight' || event.key == 'ArrowLeft'){
      event.stopPropagation();
      event.preventDefault();
    } 
  }
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
