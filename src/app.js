import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
import TweeterService from './services/tweeter-service';

@inject(Aurelia, TweeterService, EventAggregator)
export class App {

  constructor(au, ts, ea) {
    this.au = au;
    this.service = ts;

    ea.subscribe(LoginStatus, msg => {
      this.router.reset();
      this.router.navigate('', { replace: true, trigger: false });
      if (msg.status.success === true) {
        au.setRoot(msg.isAdmin ? 'admin' : 'home');
      } else {
        au.setRoot('app');
      }
    });
  }

  attached() {
    if (this.service.isAuthenticated()) {
      let userId = JSON.parse(localStorage.tweeter).userId;
      this.service.getUserData(userId);
      this.au.setRoot('home').then(() => {
        this.router.navigateToRoute('yourtweets');
      });
    }
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'welcome'],
        name: 'home',
        moduleId: 'viewmodels/welcome/welcome',
        nav: true,
        title: 'Welcome',
        settings: { root: true }
      },
      {
        route: 'login',
        name: 'login',
        moduleId: 'viewmodels/login/login',
        nav: true,
        title: 'Login',
        settings: { root: true }
      },
      {
        route: 'signup',
        name: 'signup',
        moduleId: 'viewmodels/signup/signup',
        nav: true,
        title: 'Signup',
        settings: { root: true }
      },
      {
        route: 'adm-login',
        name: 'adm-login',
        moduleId: 'viewmodels/admin/login/login',
        nav: false,
        title: 'Administration login',
        settings: { root: false }
      }
    ]);
    this.router = router;

    config.mapUnknownRoutes('');
  }
}
