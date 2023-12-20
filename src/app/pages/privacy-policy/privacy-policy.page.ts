import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
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
  keypressOnBackbtn(event:KeyboardEvent):void{
    let elem:any;
    if(event.key == 'ArrowDown'){
     elem = document.getElementById('Cnt-info');
    }
    if(elem){
      event.stopPropagation();
      elem.focus();
      event.preventDefault();
    }
  }
  
  keypressOnContent(event: KeyboardEvent): void {    
    if(event.key == 'ArrowLeft'){
      let elem = document.getElementById('btnBackPolicy');
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
      let elem:any;
      
      elem = document.getElementById('btnBackPolicy');
      elem.focus();

      elem = document.getElementById('privacy-body');
      elem.focus();
      this.chRef.detectChanges();
    }, 300);
  
    this.fabButton.nativeElement.focus();
  }
  

  goToTop() {
    if (this.fabIcon === 'arrow-down') {
      this.fabIcon = 'arrow-down';
      this.content.scrollToBottom(500);
    } else {
      this.fabIcon = 'arrow-up';
      this.content.scrollToTop(500);
    }
  }

  ngOnDestroy() {
    this.chRef.detectChanges();
  }

}
