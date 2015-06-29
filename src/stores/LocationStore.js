var alt = require('../alt');

var Immutable = require('immutable')
var makeImmutable = require('alt/utils/ImmutableUtil')

var LocationActions = require('../actions/LocationActions');
var LocationSource = require('../sources/LocationSource');
var FavoritesStore = require('./FavoritesStore');

class LocationStore {
  constructor() {
    this.state = Immutable.List([]);

    this.bindListeners({
      handleUpdateLocations: LocationActions.UPDATE_LOCATIONS,
      handleFetchLocations: LocationActions.FETCH_LOCATIONS,
      handleLocationsFailed: LocationActions.LOCATIONS_FAILED,
      setFavorites: LocationActions.FAVORITE_LOCATION
    });

    this.exportPublicMethods({
      getLocation: this.getLocation
    });

    this.exportAsync(LocationSource);
  }

  handleUpdateLocations(locations) {
    this.setState(Immutable.List(locations));
  }

  handleFetchLocations() {
    this.setState(Immutable.List([]));
  }

  handleLocationsFailed(errorMessage) {
    // this is noop for this example
  }

  resetAllFavorites() {
    this.setState(this.state.map((location) => {
        return {
          id: location.id,
          name: location.name,
          has_favorite: false
        };
      })
    );
  }

  setFavorites(location) {
    this.waitFor(FavoritesStore);

    var favoritedLocations = FavoritesStore.getState();

    this.resetAllFavorites();

    favoritedLocations.forEach((location) => {
      // find each location in the array
      for (var i = 0; i < this.state.size; i += 1) {
        // set has_favorite to true
        if (this.state.get(i).id === location.id) {
          var location = this.state.get(i);
          location.has_favorite = true;
          this.setState(this.state.set(i, location));

          break;
        }
      }
    });
  }

  getLocation(id) {
    return this.getState().find((location) => {
      return location.id === id;
    });
  }
}

module.exports = alt.createStore(makeImmutable(LocationStore), 'LocationStore');
