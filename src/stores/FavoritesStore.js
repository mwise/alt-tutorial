var alt = require('../alt');

var Immutable = require('immutable')
var makeImmutable = require('alt/utils/ImmutableUtil')

var LocationActions = require('../actions/LocationActions');

class FavoritesStore {
  constructor() {
    this.state = Immutable.List([]);

    this.bindListeners({
      addFavoriteLocation: LocationActions.FAVORITE_LOCATION
    });
  }

  addFavoriteLocation(location) {
    this.setState(this.state.push(location));
  }
}

module.exports = alt.createStore(makeImmutable(FavoritesStore), 'FavoritesStore');
