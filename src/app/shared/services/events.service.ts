import { Injectable } from '@angular/core';

export type EventHandler = (...args: any[]) => any;
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private c = new Map<string, EventHandler[]>();

  constructor() {
  //   console.warn(`[DEPRECATION][Events]: The Events provider is deprecated and it will be removed in the next major release.
  // - Use "Observables" for a similar pub/sub architecture: https://angular.io/guide/observables
  // - Use "Redux" for advanced state management: https://ngrx.io`);
  }
  /**
   * Subscribe to an event topic. Events that get posted to that topic will trigger the provided handler.
   *
   * @param topic the topic to subscribe to
   * @param handler the event handler
   */
  subscribe(topic: any, ...handlers: EventHandler[]) {
    let topics = this.c.get(topic);
    if (!topics) {
      this.c.set(topic, topics = []);
    }
    topics.push(...handlers);
  }

  /**
   * Unsubscribe from the given topic. Your handler will no longer receive events published to this topic.
   *
   * @param topic the topic to unsubscribe from
   * @param handler the event handler
   *
   * @return true if a handler was removed
   */
  unsubscribe(topic: string, handler?: EventHandler): boolean {
    if (!handler) {
      return this.c.delete(topic);
    }

    const topics = this.c.get(topic);
    if (!topics) {
      return false;
    }

    // We need to find and remove a specific handler
    const index = topics.indexOf(handler);

    if (index < 0) {
      // Wasn't found, wasn't removed
      return false;
    }
    topics.splice(index, 1);
    if (topics.length === 0) {
      this.c.delete(topic);
    }
    return true;
  }

  /**
   * Publish an event to the given topic.
   *
   * @param topic the topic to publish to
   * @param eventData the data to send as the event
   */
  publish(topic: string, ...args: any[]): any[] | null {
    // if(topic=="refresh"){
    //   topic = topic+''+args
    // }
    // console.log(topic);
    const topics = this.c.get(topic);
    if (!topics) {
      return null;
    }
   
    return topics.map(handler => {
      try {
        return handler(...args);
      } catch (e) {
        console.error(e);
        return null;
      }
    });
  }

}
