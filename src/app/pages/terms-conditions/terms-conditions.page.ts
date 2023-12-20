import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {
  scrolledToTop: boolean = true;
  fabIcon: string = 'arrow-down'; 
  
  constructor(
    private chRef: ChangeDetectorRef
  ) { }

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('fabButton', { read: ElementRef }) fabButton: ElementRef;

  KeyPressFabIcon(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.goToTop(); 
    }
  }
  
  keypressOnContent(event: KeyboardEvent): void {    
    if(event.key == 'ArrowLeft'){
      let elem = document.getElementById('btnBack');
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
      this.chRef.detectChanges();
    }
  }


  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.content.scrollEvents = true;
  
    this.content.ionScroll.subscribe((event) => {
      if (event.detail.scrollTop === 0 ) {
        this.fabIcon = 'arrow-down';
      } else if (event.detail.scrollTop > 0 ) {
        this.fabIcon = 'arrow-up';
      }
      this.chRef.detectChanges();
    });
  
    setTimeout(() => {
      let elem = document.getElementById('btnBack');
      elem.focus();

      elem = document.getElementById('terms-body');
      elem.focus();
      this.chRef.detectChanges();
    }, 300);
  
    this.fabButton.nativeElement.focus();
  }
  

  

  goToTop() {
    if (this.fabIcon === 'arrow-down') {
      this.fabIcon = 'arrow-up';
      this.content.scrollToBottom(500);
    } else {
      this.fabIcon = 'arrow-down';
      this.content.scrollToTop(500);
    }
  }
  

  ngOnDestroy() {
    this.chRef.detectChanges();
  }

}
