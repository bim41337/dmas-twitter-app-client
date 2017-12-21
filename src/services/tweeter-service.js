import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';
import {LoginStatus} from './messages';

@inject(EventAggregator, AsyncHttpClient, Router)
export default class TweeterService {

  userData = null;
  userTweets = [];
  followingsTweets = [];
  firehoseTweets = [];

  constructor(ea, ac, rt) {
    this.evtAgg = ea;
    this.httpClient = ac;
    this.router = rt;
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

  getUserData(userId) {
    this.httpClient.get('/api/users/' + userId).then(res => {
      this.userData = res.content;
      console.log('Set active user: ' + res.content.nickname);
    });
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.httpClient.authenticate('/api/users/authenticate', user).then(res => {
      if (res) {
        this.getUserData(res);
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
