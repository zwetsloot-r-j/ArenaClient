import store from "../store/store"
import {MainState} from "../store/reducers/main_reducer"

class Subscriber {

  private previousState: any
  private unsubscribe: () => void

  constructor(
    private select: (state: any) => any,
    private callback: (state: any) => void
  ) {
    this.unsubscribe = store.subscribe(() => this.handleEvent());
  }

  handleEvent() : void {
    let state = this.select(<MainState>store.getState());
    if (this.previousState === state) {
      return;
    }
    let startTime = Date.now();
    this.previousState = state;
    this.callback(state);
    let time = Date.now() - startTime;

    if (time <= 5) {

    } else if (time < 25) {
      console.warn(`handling of subscriber took ${time}`);
      console.warn(JSON.stringify(this.select));
    } else {
      console.error(`handling of subscriber toor ${time}`);
      console.error(JSON.stringify(this.select));
    }
  }

  destroy() {
    this.unsubscribe();
    this.previousState = null;
    this.select = null;
    this.callback = null;
    this.unsubscribe = null;
  }

};

export default function subscribe(selector: (state: any) => any, callback: (state: any) => void) : () => void {
  let subscriber = new Subscriber(selector, callback);
  return () => subscriber.destroy();
};
