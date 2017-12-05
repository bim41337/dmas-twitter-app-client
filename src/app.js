import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
// import DonationService from './services/donation-service';

@inject(Aurelia, EventAggregator)
export class App {

  constructor(au, ea) {
    this.au = au;
    // this.ds = ds;
    ea.subscribe(LoginStatus, msg => {
      if (msg.status.success === true) {
        this.router.navigate('/', { replace: true, trigger: false });
        this.router.reset();
        au.setRoot('app');
      }
      /*
      if (msg.status === true) {
        au.setRoot('home');
      } else {
        au.setRoot('app');
      }
      */
    });
  }

  /*
  attached() {
    if (this.ds.isAuthenticated()) {
      this.au.setRoot('home').then(() => {
        this.router.navigateToRoute('dashboard');
      });
    }
  }
  */

  configureRouter(config, router) {
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'viewmodels/home/home', nav: true, title: 'Home' },
      { route: 'login', name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }
    ]);
    this.router = router;

    config.mapUnknownRoutes('');
    config.fallbackRoute('');
  }
}
