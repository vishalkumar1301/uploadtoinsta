const { IgApiClient } = require('instagram-private-api');

class InstagramService {
  constructor() {
    this.ig = new IgApiClient();
  }

  async login(username, password) {
    this.ig.state.generateDevice(username);
    await this.ig.account.login(username, password);
  }

  async uploadPhoto(imageBuffer, caption) {
    return this.ig.publish.photo({
      file: imageBuffer,
      caption: caption
    });
  }
}

module.exports = new InstagramService();