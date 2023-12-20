import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  timers = [];

  constructor() { }
  
  timer(name:string) {
    this.timers[name + '_start'] = (window as any).performance.now();
  }

  timerEnd(name:string) {
    if (!this.timers[name + '_start']) return undefined;
    var time = (window as any).performance.now() - this.timers[name + '_start'];
    var amount = this.timers[name + '_amount'] = this.timers[name + '_amount'] ? this.timers[name + '_amount'] + 1 : 1;
    var sum = this.timers[name + '_sum'] = this.timers[name + '_sum'] ? this.timers[name + '_sum'] + time : time;
    this.timers[name + '_avg'] = sum / amount;
    delete this.timers[name + '_start'];

    //log the log name, time to 3P logger. Ex: Datadog and etc..
    //TBD
    console.log(name+': '+time+' ms');
  }

}