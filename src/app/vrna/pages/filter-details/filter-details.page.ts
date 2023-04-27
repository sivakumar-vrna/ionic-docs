import { Component, OnInit, Input } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-filter-details',
    templateUrl: './filter-details.page.html',
    styleUrls: ['./filter-details.page.scss'],
})
export class FilterDetailsPage implements OnInit {
    @Input() model_title: string;
    @Input() data: any;
    @Input() type: any;
    searchResult: any;
    domainUrl: any;
    constructor(
        private modalController: ModalController, private searchService: SearchService,
    ) { }
    ngOnInit() {
        if (isPlatform('capacitor')) {
            this.domainUrl = environment.capaciorUrl;
        } else {
            this.domainUrl = window.location.origin;
        }

        this.getFilteredItems()
    }
    async closeModel() {
        const close: string = "Modal Removed";
        await this.modalController.dismiss(close);
    }

    async getFilteredItems() {
        let params = {}
        if (this.data) params[this.type] = this.data.genreId;
        this.searchService.onSearchfiltered(params).subscribe((res) => {
            this.searchResult = res.data
            console.log(this.searchResult)
            this.searchResult.map(result => result['posterurl'] = this.domainUrl + '/images' + result.posterurl)
        })
        console.log(params);
    }
}