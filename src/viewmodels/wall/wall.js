import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from './../../services/tweeter-service';
import {TweetUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator)
export class Wall {

  userTweets = [];
  message = '';
  creation = null;
  image = null;

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;

    this.evtAgg.subscribe(TweetUpdate, msg => {
      if (msg.tweetSection === 'user') {
        this.userTweets = this.service.userTweets;
      }
    });
  }

  attached() {
    this.userTweets = this.service.userTweets;
  }

}
