export class LoginStatus {
  constructor(status) {
    this.status = status;
  }
}

export class UserUpdate {
  constructor(changedUser) {
    this.changedUser = changedUser;
  }
}

export class TweetUpdate {
  constructor(section) {
    this.tweetSection = section;
  }
}
