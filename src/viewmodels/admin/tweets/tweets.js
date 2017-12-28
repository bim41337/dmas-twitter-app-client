import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from '../../../services/tweeter-service';
import {AdministrationAction} from '../../../services/messages';

@inject(TweeterService, EventAggregator)
export class Tweets {

  allTweets = [];
  selectedTweets = [];

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;
  }

  attached() {
    if (this.allTweets.length === 0) {
      this.refreshTweets();
    }
  }

  removeSingleTweet(tweetId) {
    this.service.removeTweet(tweetId).then(res => {
      console.log('Removed tweet with ID ' + tweetId);
      this.refreshTweets();
    });
  }

  removeSelectedTweets() {
    let promises = [];
    for (let tweet of this.selectedTweets) {
      promises.push(this.service.removeTweet(tweet._id));
    }
    Promise.all(promises).then(res => {
      console.log(`Bulk removed ${this.selectedTweets.length} tweets`);
      this.refreshTweets();
      this.evtAgg.publish(new AdministrationAction('tweet'));
    }).catch(err => {
      console.log('Error during tweet bulk removal');
      console.log(err);
    });
  }

  refreshTweets() {
    this.service.getAllTweets().then(res => {
      this.allTweets = res.content;
      this.selectedTweets = [];
    });
  }

}
