import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';
import {
  LoginStatus, UserUpdate, TweetUpdate, FollowingsUpdate, ViewUserUpdate,
  BrowseUsersUpdate
} from './messages';

@inject(EventAggregator, AsyncHttpClient, Router)
export default class TweeterService {

  USER_LABEL = 'user';
  TWEETS_LABEL = 'tweets';
  FIREHOSE_LABEL = 'firehose';
  FOLLOWINGS_LABEL = 'followings';

  userData = null;
  userTweets = [];
  browseUsers = [];
  followingsUsers = [];
  followingsTweets = [];
  firehoseTweets = [];
  viewUserId = null;

  constructor(ea, ac, rt) {
    this.evtAgg = ea;
    this.httpClient = ac;
    this.router = rt;
  }

  makeTweet(formData) {
    this.httpClient.post('/api/tweets', formData).then(res => {
      this.getUserTweets();
    });
  }

  removeTweet(tweetId) {
    return this.httpClient.delete('/api/tweets/' + tweetId);
  }

  register(nickname, email, password) {
    const newUser = {
      nickname: nickname,
      email: email,
      password: password,
      followings: []
    };
    this.httpClient.post('/api/users', newUser).then(res => {
      console.log(res);
      this.router.navigate('login');
    });
  }

  getViewUserData(userId) {
    this.httpClient.get('/api/users/' + userId).then(res => {
      this.evtAgg.publish(new ViewUserUpdate(res.content));
    });
  }

  getUserData(userId, publish, withoutFetch) {
    this.httpClient.get('/api/users/' + userId).then(res => {
      console.log('Set active user: ' + res.content.user.nickname);
      this.userData = res.content.user;
      if (publish === true) {
        this.evtAgg.publish(new UserUpdate(this.userData.user));
      }
      if (!withoutFetch) {
        this.getUserTweets();
      }
    });
  }

  getBrowseUsers() {
    console.log('TS: Fetching users for browsing');
    this.httpClient.get('/api/users').then(res => {
      this.browseUsers = res.content.filter(usr => usr._id !== this.userData._id);
      this.evtAgg.publish(new BrowseUsersUpdate());
    });
  }

  getTweets(userId) {
    console.log('TS: Fetching tweets');
    this.httpClient.get('/api/tweets/user/' + userId).then(res => {
      this.evtAgg.publish(new TweetUpdate(this.TWEETS_LABEL, res.content));
    });
  }

  getUserTweets() {
    console.log('TS: Fetching user tweets');
    this.httpClient.get('/api/tweets/user/' + this.userData._id).then(res => {
      this.userTweets = res.content;
      this.evtAgg.publish(new TweetUpdate(this.USER_LABEL));
    });
  }

  getFollowingsUsers() {
    console.log('TS: Fetching followings users');
    this.httpClient.get(`/api/users/${this.userData._id}/followings`).then(res => {
      this.followingsUsers = res.content;
      this.evtAgg.publish(new FollowingsUpdate());
    });
  }

  getFollowingsTweets() {
    console.log('TS: Fetching followings tweets');
    this.httpClient.get(`/api/tweets/user/${this.userData._id}/followings`).then(res => {
      this.followingsTweets = res.content;
      this.evtAgg.publish(new TweetUpdate(this.FOLLOWINGS_LABEL));
    });
  }

  addFollowing() {
    console.log('TS: Adding following entry');
    this.httpClient.post(`/api/users/${this.userData._id}/followings`, { follId: this.viewUserId }).then(res => {
      this.router.navigate('followings');
    });
  }

  removeFollowing() {
    console.log('TS: Removing following entry');
    this.httpClient.put(`/api/users/${this.userData._id}/followings`, { follId: this.viewUserId }).then(res => {
      this.router.navigate('followings');
    });
  }

  getFirehoseTweets() {
    console.log('TS: Fetching firehose tweets');
    this.httpClient.get('/api/tweets').then(res => {
      this.firehoseTweets = res.content;
      this.evtAgg.publish(new TweetUpdate(this.FIREHOSE_LABEL));
    });
  }

  changeUserData(changedUser) {
    this.httpClient.put('/api/users/' + this.userData._id, changedUser).then(res => {
      this.userData = res.content;
      this.evtAgg.publish(new UserUpdate(this.userData));
      this.router.navigate('wall');
    });
  }

  viewUser(userId) {
    this.viewUserId = userId;
    this.router.navigate('view-user');
  }

  // ### ADMIN ONLY METHODS ###

  getAllUsers() {
    console.log('TS: Fetching all users for administration');
    return this.httpClient.get('/api/users');
  }

  getAllTweets() {
    console.log('TS: Fetching all tweets for administration');
    return this.httpClient.get('/api/tweets');
  }

  removeUser(userId) {
    return this.httpClient.delete('/api/users/' + userId);
  }

  removeAllTweetsForUser(userId) {
    return this.httpClient.delete('/api/tweets/user/' + userId);
  }

  getUserStats() {
    return this.httpClient.get('/api/stats/users');
  }

  getTweetsStats() {
    return this.httpClient.get('/api/stats/tweets');
  }

  getConnectionsStats() {
    return this.httpClient.get('/api/stats/connections');
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.httpClient.authenticate('/api/users/authenticate', user).then(res => {
      if (res) {
        this.getUserData(res, true);
      }
    });
  }

  admLogin(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.httpClient.authenticate('/api/users/authenticate', user, true).then(res => {
      if (res) {
        this.getUserData(res, false, true);
      }
    });
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.httpClient.clearAuthentication();
    this.userData = null;
    this.evtAgg.publish(new LoginStatus(status));
  }

  isAuthenticated() {
    return this.httpClient.isAuthenticated();
  }

}
