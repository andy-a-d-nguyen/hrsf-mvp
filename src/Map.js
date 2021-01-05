import React from 'react';
import styled from 'styled-components/macro';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import ModalComponent from './ModalComponent';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
`;

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 37.78783599306434,
        lng: -122.40748005707546
      },
      zoom: 11,
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      addressComponents: [],
      formattedAddress: '',
      location: {},
      ageByPercent: {},
      ageByCount: {},
      genderByPercent: {},
      genderByCount: {},
      raceByPercent: {},
      raceByCount: {},
      showModal: false,
      jobs: [],
      requestRadius: '1500',
      requestType: ['tourist_attraction'],
      placesOfInterestUnformatted: [],
      placesOfInterestFormatted: []
    }

    this.handleApiLoaded = this.handleApiLoaded.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.getDemographics = this.getDemographics.bind(this);
    this.getJobs = this.getJobs.bind(this);
  }

  handleModal(event) {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  getDemographics() {
    axios.interceptors.response.use((res) => {
      res.headers['access-control-allow-origin'] = '*';
      return res;
    }, (err) => {
      return Promise.reject(err);
    });

    axios({
      method: 'get',
      url: 'https://api.precisely.com/demographics-segmentation/v1/demographics/byaddress?',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PRECISELY_API_KEY}`,
        Accept: 'application/json'
      },
      params: {
        address: this.state.address,
        country: this.state.country,
        filter: 'raceAndEthnicityTheme,populationTheme',
        valueFormat: 'Both',
        variableLevel: 'Key'
      }
    })
      .then(res => this.setState({
        ageByPercent: res.data.themes.populationTheme.rangeVariable[0],
        ageByCount: res.data.themes.populationTheme.rangeVariable[1],
        genderByPercent: res.data.themes.populationTheme.rangeVariable[2],
        genderByCount: res.data.themes.populationTheme.rangeVariable[3],
        raceByPercent: res.data.themes.raceAndEthnicityTheme.rangeVariable[0],
        raceByCount: res.data.themes.raceAndEthnicityTheme.rangeVariable[1],
      }))
         // .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  getJobs() {
    axios.interceptors.response.use((res) => {
      res.headers['access-control-allow-origin'] = '*';
      return res;
    }, (err) => {
      return Promise.reject(err);
    });

    axios({
      method: 'get',
      url: 'https://api.adzuna.com/v1/api/jobs/us/search/1',
      params: {
        app_id: process.env.REACT_APP_ADZUNA_API_ID,
        app_key: process.env.REACT_APP_ADZUNA_API_KEY,
        results_per_page: 10,
        where: this.state.zipCode,
        // what: 'developer'
      }
    }).then(res => this.setState({
        jobs: res.data.results
      }))
      .catch(err => console.log(err));
  }

  handleApiLoaded(map, maps) {
    // console.log(maps);
    const geocoder = new maps.Geocoder();
    const service = new maps.places.PlacesService(map);
    map.addListener('click', (event) => {
      /* ADDRESS COMPONENTS */

      geocoder.geocode({
        'latLng': event.latLng
      }, (results, status) => {
        if (status === maps.GeocoderStatus.OK) {
          if (results[0]) {
            // console.log(results[0]);
            this.setState({
              addressComponents: results[0].address_components,
              formattedAddress: results[0].formatted_address,
              location: {
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng()
              }
            }, () => {
                if (this.state.addressComponents.length > 0) {
                  for (let i = 0; i < this.state.addressComponents.length; i++) {
                    if (this.state.addressComponents[i].types[0] === 'postal_code') {
                      this.setState({
                        zipCode: results[0].address_components[i].long_name,
                        address: results[0].formatted_address.slice(0, results[0].formatted_address.length - 5),
                        country: results[0].formatted_address.slice(results[0].formatted_address.length - 3),
                        showModal: true
                      })
                    }
                  }
                }
              }
            )
            /* DEMOGRAPHICS */

            this.getDemographics();

            /* JOBS */

            this.getJobs();
          }
        }
      })
      /* NEARBY PLACES OF INTEREST */

      const nearbyRequest = {
        location: event.latLng,
        radius: this.state.requestRadius,
        type: this.state.requestType,
      };
      service.nearbySearch(nearbyRequest, (results, status) => {
        if (status === maps.places.PlacesServiceStatus.OK) {
          // console.log(results);
          this.setState({
            placesOfInterestUnformatted: results,
            placesOfInterestFormatted: []
          }, () => {
            for (let i = 0; i < this.state.placesOfInterestUnformatted.length; i++) {
              const detailRequest = {
                placeId: this.state.placesOfInterestUnformatted[i].place_id,
                fields: ['name', 'formatted_address', 'photo', 'url']
              }
              service.getDetails(detailRequest, (result, status) => {
                if (status === maps.places.PlacesServiceStatus.OK) {
                  // console.log(result);
                  // console.log(result.photos[0].getUrl({maxWidth: 400, maxHeight: 400}));
                  if (!result || !result.photos || !result.photos[0]) {
                    return;
                  } else {
                      this.setState({
                        placesOfInterestFormatted: [
                          ...this.state.placesOfInterestFormatted,
                          {
                            address: result.formatted_address,
                            name: result.name,
                            url: result.url,
                            photo: result.photos[0].getUrl({maxWidth: 400, maxHeight: 400}),
                          }
                        ]
                      })
                    }
                  }
                }
              )
            }
          })
        }
      })
    })
  }

  render() {
    return (
      <Wrapper>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_API_KEY,
            libraries: ['places', 'geometry'],
          }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => this.handleApiLoaded(map, maps)}
        >
          {this.state.showModal && this.state.placesOfInterestFormatted.length ?
            <ModalComponent
              show={this.state.showModal}
              onHide={this.handleModal}
              ageByPercent={this.state.ageByPercent}
              ageByCount={this.state.ageByCount}
              genderByPercent={this.state.genderByPercent}
              genderByCount={this.state.genderByCount}
              raceByPercent={this.state.raceByPercent}
              raceByCount={this.state.raceByCount}
              jobs={this.state.jobs}
              zipCode={this.state.zipCode}
              placesOfInterest={this.state.placesOfInterestFormatted}
              location={this.state.location}
            />
            : null}
        </GoogleMapReact>
      </Wrapper>
    )
  }
};



export default Map;