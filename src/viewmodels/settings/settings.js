import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules, validateTrigger} from 'aurelia-validation';
import TweeterService from '../../services/tweeter-service';
import {UserUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator, ValidationControllerFactory)
export class Settings {

  userData = null;

  constructor(ts, ea, vcf) {
    this.service = ts;
    this.evtAgg = ea;
    this.valContr = vcf.createForCurrentScope();
    this.valContr.validateTrigger = validateTrigger.change;

    this.evtAgg.subscribe(UserUpdate, msg => {
      this.userData = msg.changedUser;
    });
  }

  attached() {
    this.userData = this.service.userData;
  }

  changeSettings(e) {
    this.valContr.validate().then(result => {
      if (result.valid) {
        this.valContr.reset();
        this.service.changeUserData(this.userData);
      }
    });
  }

}

ValidationRules
  .ensure('userData.nickname').required()
  .ensure('userData.email').email().required()
  .ensure('userData.password').required()
  .on(Settings);
