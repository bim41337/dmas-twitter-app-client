import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from '../../../services/tweeter-service';
import {AdministrationAction} from '../../../services/messages';

@inject(TweeterService, EventAggregator)
export class Users {

  allUsers = [];
  selectedUsers = [];

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;
  }

  attached() {
    if (this.allUsers.length === 0) {
      this.refreshUsers();
    }
  }

  removeSingleUser(userId, delayRefresh) {
    this.service.removeAllTweetsForUser(userId).then(res => {
      console.log('Removed all tweets for User-ID ' + userId);
      return this.service.removeUser(userId);
    }).then(res => {
      console.log('Successfully removed user with ID ' + userId);
      if (!delayRefresh) {
        this.refreshUsers();
        this.evtAgg.publish(new AdministrationAction('user'));
      }
    }).catch(err => {
      console.log('Error while cascading remove option for user with ID ' + userId);
      console.log(err);
    });
  }

  removeSelectedUsers() {
    for (let user of this.selectedUsers) {
      this.removeSingleUser(user._id, true);
    }
    this.refreshUsers();
    this.evtAgg.publish(new AdministrationAction('user'));
  }

  refreshUsers() {
    this.service.getAllUsers().then(res => {
      this.allUsers = res.content.filter(usr => usr._id !== this.service.userData._id);
      this.selectedUsers = [];
    });
  }

}
