import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules, validateTrigger} from 'aurelia-validation';
import TweeterService from '../../services/tweeter-service';
import {LoginStatus} from '../../services/messages';

@inject(TweeterService, EventAggregator, ValidationControllerFactory)
export class Login {

  email = '';
  password = '';

  constructor(ts, ea, vcf) {
    this.service = ts;
    this.evtAgr = ea;
    this.valContr = vcf.createForCurrentScope();
    this.valContr.validateTrigger = validateTrigger.change;

    this.evtAgr.subscribe(LoginStatus, msg => {
      if (!msg.status.success) {
        this.valContr.addError(msg.status.message);
      }
    });
  }

  login(e) {
    this.valContr.validate().then(result => {
      if (result.valid) {
        console.log(`Logging in: ${this.email}`);
        this.valContr.reset();
        this.service.login(this.email, this.password);
      }
    });
  }

}

ValidationRules
  .ensure('email').email().required()
  .ensure('password').required()
  .on(Login);
