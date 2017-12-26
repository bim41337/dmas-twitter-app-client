import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import Fixtures from './fixtures';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './messages';

@inject(HttpClient, Fixtures, EventAggregator)
export default class AsyncHttpClient {

  constructor(httpClient, fixtures, ea) {
    this.http = httpClient;
    this.http.configure(http => {
      http.withBaseUrl(fixtures.baseUrl);
    });
    this.evtAgg = ea;
  }

  authenticate(url, user, isAdmin) {
    return this.http.post(url, user).then(response => {
      const status = response.content;
      if (status.success) {
        localStorage.tweeter = JSON.stringify(response.content);
        this.http.configure(configuration => {
          configuration.withHeader('Authorization', 'bearer ' + response.content.token);
        });
      }
      this.evtAgg.publish(new LoginStatus(status, isAdmin));

      return response.content.userId;
    }).catch(error => {
      const status = {
        success: false,
        message: 'service not available'
      };
      this.evtAgg.publish(new LoginStatus(status));
    });
  }

  clearAuthentication() {
    localStorage.tweeter = null;
    this.http.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
  }

  isAuthenticated() {
    let authenticated = false;
    let tweeter = localStorage.tweeter;

    if (tweeter !== undefined && tweeter !== 'null') {
      authenticated = true;
      this.http.configure(http => {
        const auth = JSON.parse(tweeter);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
    }
    return authenticated;
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, obj) {
    return this.http.post(url, obj);
  }

  put(url, obj) {
    return this.http.put(url, obj);
  }

  delete(url) {
    return this.http.delete(url);
  }
}
