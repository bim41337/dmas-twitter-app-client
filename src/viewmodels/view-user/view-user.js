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
      this.viewUser = msg.userData.user;
      this.viewUserFollowingsCount = msg.userData.followersCount;
    });
  }

  calcFollowedUser() {
    this.isFollowedUser = this.service.followingsUsers.findIndex(usr => usr._id === this.service.viewUserId) !== -1;
  }

  doFollowingAction() {
    if (this.isFollowedUser) {
      this.service.removeFollowing();
    } else {
      this.service.addFollowing();
    }
  }

  attached() {
    let userId = this.service.viewUserId;
    this.service.getTweets(userId);
    this.service.getViewUserData(userId);
    this.calcFollowedUser();
  }

}
