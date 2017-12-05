import {inject} from 'aurelia-framework';
import TweeterService from '../../services/tweeter-service';
import {ValidationControllerFactory, ValidationRules, validateTrigger} from 'aurelia-validation';

@inject(TweeterService, ValidationControllerFactory)
export class Signup {

  nickname = '';
  email = '';
  password = '';

  constructor(ts, vcf) {
    this.service = ts;
    this.valContr = vcf.createForCurrentScope();
    this.valContr.validateTrigger = validateTrigger.change;
  }

  register(e) {
    this.valContr.validate().then(result => {
      if (result.valid) {
        console.log(`New registration: ${this.email}`);
        this.service.register(this.nickname, this.email, this.password);
      }
    });
  }

}

ValidationRules
  .ensure('nickname').required()
  .ensure('email').email().required()
  .ensure('password').required()
  .on(Signup);
