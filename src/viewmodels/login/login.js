import {inject} from 'aurelia-framework';
import TweeterService from '../../services/tweeter-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from '../../services/messages';

@inject(TweeterService, EventAggregator)
export class Login {

  email = '';
  password = '';
  hasErrors = false;
  formErrors = [];

  constructor(ts, ea) {
    this.service = ts;
    this.evtAgr = ea;

    this.evtAgr.subscribe(LoginStatus, msg => {
      let content = msg.status.message;
      if (msg.status.success === false) {
        this.formErrors.push(content);
        this.hasErrors = true;
      } else {
        this.hasErrors = false;
        this.formErrors = [];
      }
    });
  }

  login(e) {
    console.log(`Logging in: ${this.email}`);
    this.service.login(this.email, this.password);
  }

}
