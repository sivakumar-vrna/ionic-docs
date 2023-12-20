import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title, 
    private meta: Meta,
    @Inject(DOCUMENT) private doc: any
  ) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateUrl(url: string) {
    this.meta.updateTag({ name: 'og:url', content: url });
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc });
  }

  updateCustomMetaTag(name:string, desc: string) {
    this.meta.updateTag({ name: name, content: desc });
  }

  updateCanonicalLink(url: string){

    const canonicalLink = this.doc.querySelector('link[rel="canonical"]');
    if(canonicalLink){
      canonicalLink.parentNode.removeChild( canonicalLink );
    }

    let link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    link.setAttribute('href', url);
  }
}
