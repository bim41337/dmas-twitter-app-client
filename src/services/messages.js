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

export class ViewUserUpdate {
  constructor(userData) {
    this.userData = userData;
  }
}

export class TweetUpdate {
  constructor(section, tweets) {
    this.tweetSection = section;
    this.tweets = tweets;
  }
}

export class FollowingsUpdate {
  constructor() {
  }
}
