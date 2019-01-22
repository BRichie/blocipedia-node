const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isStandard() || this._isAdmin() || this._isPremium();
  }

  create() {
    return this.new();
  }

  edit() {
    return this._isStandard() || this._isAdmin() || this._isPremium();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
  private() {
    return this._isPremium() || this._isAdmin();
  }

  public() {
    return this.private();
  }

}