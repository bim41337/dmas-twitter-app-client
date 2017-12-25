/* eslint-disable indent */
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationRules, validateTrigger} from 'aurelia-validation';
import {Buffer} from 'buffer';
import TweeterService from './../../services/tweeter-service';
import * as moment from 'moment-timezone';
import {TweetUpdate} from '../../services/messages';

@inject(TweeterService, EventAggregator, ValidationControllerFactory)
export class Wall {

  userTweets = [];
  message = '';
  image = null;

  constructor(ts, ea, vcf) {
    this.service = ts;
    this.evtAgg = ea;
    this.valContr = vcf.createForCurrentScope();
    this.valContr.validateTrigger = validateTrigger.manual;

    this.evtAgg.subscribe(TweetUpdate, msg => {
      if (msg.tweetSection === this.service.USER_LABEL) {
        this.userTweets = this.service.userTweets;
      }
    });
  }

  attached() {
    this.userTweets = this.service.userTweets;
  }

  makeTweet(e) {
    this.valContr.validate().then(result => {
      if (result.valid) {
        let customFormData = {
          message: this.message,
          creation: moment.tz(),
          user: this.service.userData._id
        };

        if (this.image) {
          let imageInst = this.image.item(0);
          let fileReader = new FileReader();
          fileReader.onload = () => {
            customFormData.image = {
              data: Buffer.from(fileReader.result),
              contentType: imageInst.type
            };
            this.service.makeTweet(customFormData);
          };
          fileReader.readAsArrayBuffer(imageInst);
        } else {
          this.service.makeTweet(customFormData);
        }

        this.valContr.reset();
        this.clearTweetForm();
      }
    });
  }

  removeTweet(tweetId) {
    console.log(`Removing tweet ${tweetId}`);
    this.service.removeTweet(tweetId);
  }

  clearTweetForm() {
    this.message = '';
    this.image = null;
    this.fileInput.value = null;
  }

  refreshWall() {
    this.service.getUserTweets();
  }

}

ValidationRules
  .ensure('message').required().satisfies((value, obj) => {
  return value.trim().length <= 140;
})
  .ensure('image').satisfies((value, obj) => {
  if (value) {
    return value.length === 0 || value.item(0).size <= 524288;
  }
  return true;
}).on(Wall);
