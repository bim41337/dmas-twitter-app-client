import {inject, Aurelia} from 'aurelia-framework';
import TweeterService from './services/tweeter-service';

@inject(Aurelia, TweeterService)
export class Admin {

  constructor(au, ts) {
    this.aurelia = au;
    this.service = ts;
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'stats'],
        name: 'adm-stats',
        moduleId: 'viewmodels/admin/stats/stats',
        nav: true,
        title: 'Statistics',
        settings: { root: true }
      },
      {
        route: 'users',
        name: 'adm-users',
        moduleId: 'viewmodels/admin/users/users',
        nav: true,
        title: 'Manage Users',
        settings: { root: true }
      },
      {
        route: 'tweets',
        name: 'adm-tweets',
        moduleId: 'viewmodels/admin/tweets/tweets',
        nav: true,
        title: 'Manage Tweets',
        settings: { root: true }
      },
      {
        route: 'logout',
        name: 'adm-logout',
        moduleId: 'viewmodels/logout/logout',
        nav: true,
        title: 'Logout',
        settings: { root: true }
      }
    ]);
    this.router = router;

    config.mapUnknownRoutes('stats');
  }
}
