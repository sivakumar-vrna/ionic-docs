import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-btn-text',
  templateUrl: './btn-text.component.html',
  styleUrls: ['./btn-text.component.scss'],  
})
export class ButtonTextComponent implements OnInit {
  
  @Input() btnName: string = '';
  @Input() btnIdName: string = '';  
  @Input() btnDesc: string = '';  
  @Input() btnValue: boolean = false;
  @Input() movieId:number;
  @Input() uniquePageId:any; 

  isClicked: boolean = false;  
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    console.log("btnName>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+this.btnName);
    console.log("btnDesc>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+this.btnDesc);
    console.log("btnValue>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+this.btnValue);
   }
   
   changeIcon(elem){      
      var id = this.btnName + "-btn";
      var iconId = this.btnName;
      console.log(id);
      console.log(iconId);
      if(this.btnName === 'duplicate-outline'){        
        this.btnName = 'trash-outline';
        this.isClicked = true;
        //document.getElementById(id).style.background = "linear-gradient(90deg, rgba(161, 3, 3, 0.822) 20%, rgba(104, 0, 0, 0.842) 50%, rgba(151, 0, 0, 0.829) 100%)";
      }
      else if(this.btnName === 'trash-outline'){        
        this.btnName = 'duplicate-outline';
        this.isClicked = false;
        //document.getElementById(id).style.background = "linear-gradient(90deg, rgba(20, 20, 20, 0.637) 20%, rgba(12, 12, 12, 0.404) 50%, rgba(39, 39, 39, 0.473) 100%)";
      }
      else if(this.btnName === 'thumbs-down-outline'){        
        this.btnName = 'thumbs-down-sharp';
        this.isClicked = false;
        //document.getElementById(id).style.background = "linear-gradient(90deg, rgba(161, 3, 3, 0.822) 20%, rgba(104, 0, 0, 0.842) 50%, rgba(151, 0, 0, 0.829) 100%)";
      }
      else if(this.btnName === 'thumbs-down-sharp'){        
        this.btnName = 'thumbs-down-outline';
        this.isClicked = false;
        //document.getElementById(id).style.background = "linear-gradient(90deg, rgba(20, 20, 20, 0.637) 20%, rgba(12, 12, 12, 0.404) 50%, rgba(39, 39, 39, 0.473) 100%)";
      }
      else if(this.btnName === 'thumbs-up-outline'){        
        this.btnName = 'thumbs-up-sharp';
        this.isClicked = false;
        //document.getElementById(id).style.background = "linear-gradient(90deg, rgba(161, 3, 3, 0.822) 20%, rgba(104, 0, 0, 0.842) 50%, rgba(151, 0, 0, 0.829) 100%)";        
      }
      else if(this.btnName === 'thumbs-up-sharp'){        
        this.btnName = 'thumbs-up-outline';
        this.isClicked = false;
        //document.getElementById(id).style.background = "linear-gradient(90deg, rgba(20, 20, 20, 0.637) 20%, rgba(12, 12, 12, 0.404) 50%, rgba(39, 39, 39, 0.473) 100%)";
      }
    }

    
  
}
