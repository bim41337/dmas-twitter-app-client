/* eslint-disable indent */
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweeterService from '../../../services/tweeter-service';
import {AdministrationAction} from '../../../services/messages';

@inject(TweeterService, EventAggregator)
export class Stats {

  usersCount = undefined;
  tweetsCount = undefined;
  connectionsCount = undefined;

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgg = ea;

    this.evtAgg.subscribe(AdministrationAction, msg => {
      switch (msg.section) {
        case 'tweet':
          this.refreshTweetsStats();
          break;
        case 'user':
          this.refreshView();
          break;
        default:
          // Ignore
          break;
      }
    });
  }

  attached() {
    if (this.usersCount === undefined) {
      this.refreshView();
    }
  }

  refreshUserStats() {
    this.service.getUserStats().then(res => {
      this.usersCount = res.content.count;
    });
    this.service.getConnectionsStats().then(res => {
      this.connectionsCount = res.content.count;
    });
  }

  refreshTweetsStats() {
    this.service.getTweetsStats().then(res => {
      this.tweetsCount = res.content.count;
    });
  }

  refreshView() {
    this.refreshUserStats();
    this.refreshTweetsStats();
  }

}
