import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from './../../services/tweeter-service';
import {TweetUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator)
export class Firehose {

  firehoseTweets = [];

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;

    this.evtAgg.subscribe(TweetUpdate, msg => {
      if (msg.tweetSection === this.service.FIREHOSE_LABEL) {
        this.firehoseTweets = this.service.firehoseTweets;
      }
    });
  }

  attached() {
    this.refreshFirehose();
  }

  refreshFirehose() {
    this.service.getFirehoseTweets();
  }

}
