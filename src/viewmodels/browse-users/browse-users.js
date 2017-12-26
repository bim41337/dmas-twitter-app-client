import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from '../../services/tweeter-service';
import {BrowseUsersUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator)
export class BrowseUsers {

  users = [];

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;

    this.evtAgg.subscribe(BrowseUsersUpdate, msg => {
      this.users = this.service.browseUsers;
    });
  }

  attached() {
    if (this.service.browseUsers.length === 0) {
      this.service.getBrowseUsers();
    } else {
      this.users = this.service.browseUsers;
    }
  }

  viewUser(userId) {
    this.service.viewUser(userId);
  }

  refreshUsers() {
    this.service.getBrowseUsers();
  }

}
