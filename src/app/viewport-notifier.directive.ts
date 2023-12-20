import { AfterViewInit, Directive, ElementRef, EventEmitter, Host, OnDestroy, Output } from "@angular/core";

@Directive({
  selector: '[viewportNotifier]'
})
export class ViewportNotifierDirective implements AfterViewInit, OnDestroy{

  @Output() visibilityChange: EventEmitter<string> = new EventEmitter<string>();

  private _observer: IntersectionObserver;

  constructor(@Host() private _elementRef: ElementRef) {  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.0
    };

    this._observer = new IntersectionObserver(this._callback, options);

    this._observer.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy() {
    this._observer.disconnect();
  }

  private _callback = (entries, observer) => {
    entries.forEach(entry => {
      //console.log(entry.isIntersecting ? 'I am visible' : 'I am not visible');
      this.visibilityChange.emit(entry.isIntersecting ? 'VISIBLE' : 'HIDDEN');
      // Each entry describes an intersection change for one observed
      // target element:
      //   entry.boundingClientRect
      //   entry.intersectionRatio
      //   entry.intersectionRect
      //   entry.isIntersecting
      //   entry.rootBounds
      //   entry.target
      //   entry.time
    });
  };

}
