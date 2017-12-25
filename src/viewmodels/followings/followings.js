import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from './../../services/tweeter-service';
import {FollowingsUpdate, TweetUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator)
export class Followings {

  followingsUsers = [];
  followingsTweets = [];

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;

    this.evtAgg.subscribe(TweetUpdate, msg => {
      if (msg.tweetSection === this.service.FOLLOWINGS_LABEL) {
        this.followingsTweets = this.service.followingsTweets;
      }
    });
    this.evtAgg.subscribe(FollowingsUpdate, msg => {
      this.followingsUsers = this.service.followingsUsers;
    });
  }

  viewUser(userId) {
    this.service.viewUser(userId);
  }

  attached() {
    this.refreshFollowings();
  }

  refreshFollowings() {
    this.service.getFollowingsUsers();
    this.service.getFollowingsTweets();
  }

}
