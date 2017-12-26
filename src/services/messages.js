export class LoginStatus {
  constructor(status, isAdmin) {
    this.status = status;
    this.isAdmin = isAdmin;
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

export class BrowseUsersUpdate {
  constructor() {
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

export class AdministrationAction {
  USER_ACTION = 'user';
  TWEET_ACTION = 'tweet';
  constructor(section) {
    this.section = section;
  }
}
