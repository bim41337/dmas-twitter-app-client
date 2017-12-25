import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from './../../services/tweeter-service';
import {TweetUpdate, ViewUserUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator)
export class ViewUser {

  viewUser = null;
  viewUserTweets = [];
  viewUserFollowingsCount = 0;
  isFollowedUser = undefined;

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;

    this.evtAgg.subscribe(TweetUpdate, msg => {
      if (msg.tweetSection === this.service.TWEETS_LABEL) {
        this.viewUserTweets = msg.tweets;
      }
    });
    this.evtAgg.subscribe(ViewUserUpdate, msg => {
      this.viewUser = msg.userData;
      this.viewUserFollowingsCount = this.viewUser.followings.length;
    });
  }

  isFollowedUser() {
    if (this.isFollowedUser === undefined) {
      this.isFollowedUser = this.service.followingsUsers.findIndex(usr => usr._id === this.service.viewUserId) !== -1;
    }
    return this.isFollowedUser;
  }

  doFollowingAction() {
    // check following status and (un-)subscribe
    console.log('Would do follwing action now ...');
  }

  attached() {
    let userId = this.service.viewUserId;
    this.service.getTweets(userId);
    this.service.getViewUser(userId);
  }

}
