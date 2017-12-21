import {inject, Aurelia} from 'aurelia-framework';
import TweeterService from './services/tweeter-service';

@inject(Aurelia, TweeterService)
export class Home {

  constructor(au, ts) {
    this.aurelia = au;
    this.service = ts;
  }

  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'home', 'wall'],
        name: 'home',
        moduleId: 'viewmodels/wall/wall',
        nav: true,
        title: 'Home',
        settings: { root: true }
      },
      {
        route: 'settings',
        name: 'settings',
        moduleId: 'viewmodels/settings/settings',
        nav: true,
        title: 'Settings',
        settings: { root: true }
      },
      {
        route: 'logout',
        name: 'logout',
        moduleId: 'viewmodels/logout/logout',
        nav: true,
        title: 'Logout',
        settings: { root: true }
      }
    ]);
    this.router = router;

    config.mapUnknownRoutes('home');
  }
}
