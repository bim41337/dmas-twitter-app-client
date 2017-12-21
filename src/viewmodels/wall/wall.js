import {inject} from 'aurelia-framework';
import TweeterService from './../../services/tweeter-service';

@inject(TweeterService)
export class Wall {

  constructor(ts) {
    this.service = ts;
  }

}
