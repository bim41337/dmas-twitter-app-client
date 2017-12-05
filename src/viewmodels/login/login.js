import {inject} from 'aurelia-framework';
import TweeterService from '../../services/tweeter-service';
import {ValidationControllerFactory, ValidationRules, validateTrigger} from 'aurelia-validation';

@inject(TweeterService, ValidationControllerFactory)
export class Login {

  email = '';
  password = '';

  constructor(ts, vcf) {
    this.service = ts;
    this.valContr = vcf.createForCurrentScope();
    this.valContr.validateTrigger = validateTrigger.change;
  }

  login(e) {
    this.valContr.validate().then(result => {
      if (result.valid) {
        console.log(`Logging in: ${this.email}`);
        this.service.login(this.email, this.password);
      }
    });
  }

}

ValidationRules
  .ensure('email').email().required()
  .ensure('password').required()
  .on(Login);
