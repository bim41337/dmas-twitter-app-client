import {inject} from 'aurelia-framework';
import TweeterService from './../../services/tweeter-service';

@inject(TweeterService)
export class Logout {

  constructor(ts) {
    this.service = ts;
  }

  logout() {
    console.log('Logging out');
    this.service.logout();
  }

}
