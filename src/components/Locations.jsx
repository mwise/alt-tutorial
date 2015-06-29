var React = require('react');

var alt = require('../alt')

var AltContainer = require('alt/AltContainer');
var LocationStore = require('../stores/LocationStore');
var FavoritesStore = require('../stores/FavoritesStore');
var LocationActions = require('../actions/LocationActions');

var Favorites = React.createClass({
  render() {
    return (
      <ul>
        {this.props.locations.map((location, i) => {
          return (
            <li key={i}>{location.name}</li>
          );
        }).toArray()}
      </ul>
    );
  }
});

var AllLocations = React.createClass({
  addFave(ev) {
    var location = LocationStore.getLocation(
      Number(ev.target.getAttribute('data-id'))
    );
    LocationActions.favoriteLocation(location);
  },

  render() {
    if (this.props.errorMessage) {
      return (
        <div>{this.props.errorMessage}</div>
      );
    }

    if (LocationStore.isLoading()) {
      return (
        <div>
          <img src="ajax-loader.gif" />
        </div>
      )
    }

    return (
      <ul>
        {this.props.locations.map((location, i) => {
          var faveButton = (
            <button onClick={this.addFave} data-id={location.id}>
              Favorite
            </button>
          );

          return (
            <li key={i}>
              {location.name} {location.has_favorite ? '<3' : faveButton}
            </li>
          );
        }).toArray()}
      </ul>
    );
  }
});

var Locations = React.createClass({
  getInitialState() {
    return {
      snapshot: null
    }
  },

  componentDidMount() {
    LocationStore.fetchLocations();
  },

  render() {
    return (
      <div>
        <div>
          <button onClick={this.takeSnapshot}>Take snapshot</button>
          <button onClick={this.restoreSnapshot}>restore snapshot</button>
        </div>
        <h1>Locations</h1>
        <AltContainer stores={{
          locations: function(props) {
            return {
              store: LocationStore,
              value: LocationStore.getState()
            }
          }
        }}>
          <AllLocations />
        </AltContainer>

        <h1>Favorites</h1>
        <AltContainer stores={{
          locations: function(props) {
            return {
              store: FavoritesStore,
              value: FavoritesStore.getState()
            }
          }
        }}>
          <Favorites />
        </AltContainer>
      </div>
    );
  },

  restoreSnapshot() {
    if (this.state.snapshot) {
      alt.bootstrap(this.state.snapshot);
    }
  },

  takeSnapshot() {
    var snapshot = alt.takeSnapshot();
    this.setState({ snapshot: snapshot });
    console.log(snapshot);
  }
});

module.exports = Locations;
