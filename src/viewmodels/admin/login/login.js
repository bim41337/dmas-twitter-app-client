import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules, validateTrigger} from 'aurelia-validation';
import TweeterService from '../../../services/tweeter-service';

@inject(TweeterService, EventAggregator, ValidationControllerFactory)
export class Login {

  email = 'admin@user.de';
  password = '';

  constructor(ts, ea, vcf) {
    this.service = ts;
    this.evtAgr = ea;
    this.valContr = vcf.createForCurrentScope();
    this.valContr.validateTrigger = validateTrigger.manual;
  }

  login(e) {
    this.valContr.validate().then(result => {
      if (result.valid) {
        console.log('Administration login');
        this.valContr.reset();
        this.service.admLogin(this.email, this.password);
      }
    });
  }

}

ValidationRules
  .ensure('email').email().required()
  .ensure('password').required()
  .on(Login);
