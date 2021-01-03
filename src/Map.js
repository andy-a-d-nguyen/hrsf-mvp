import React from 'react';
import styled from 'styled-components/macro';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
// import { Modal } from '@material-ui/core';
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
      ageByPercent: {},
      ageByCount: {},
      genderByPercent: {},
      genderByCount: {},
      raceByPercent: {},
      raceByCount: {},
      showModal: false,
      ip: '',
      jobs: [],
      placesOfInterest: [],
    }

    this.handleApiLoaded = this.handleApiLoaded.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.getIPAddress = this.getIPAddress.bind(this);
  }

  componentDidMount() {
    // this.getIPAddress();
  }

  getIPAddress() {
    axios({
      method: 'get',
      url: `https://api.ipdata.co?api-key=${process.env.REACT_APP_IPDATA_API_KEY}`,
    }).then(res => this.setState({
      ip: res.data.ip
    }))
      .catch(err => console.log(err))
  }

  handleModal(event) {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  handleApiLoaded(map, maps) {
    // console.log(maps);
    const geocoder = new maps.Geocoder();
    const service = new maps.places.PlacesService(map);
    map.addListener('click', (event) => {
      geocoder.geocode({
        'latLng': event.latLng
      }, (results, status) => {
        if (status === maps.GeocoderStatus.OK) {
          if (results[0]) {
            // console.log(results[0]);
            for (let i = 0; i < results[0].address_components.length; i++) {
              if (results[0].address_components[i].types[0] === 'postal_code') {
                this.setState({
                  zipCode: results[0].address_components[i].long_name,
                })
              }
            }
            const addressArr = results[0].formatted_address.split(' ');
            const reformattedAddrArr = addressArr.slice(0, addressArr.length - 1);
            const rejoinedAddr = reformattedAddrArr.join(' ');
            this.setState({
              address: rejoinedAddr.slice(0, rejoinedAddr.length - 1),
              country: addressArr[addressArr.length - 1],
              showModal: true
            })

            /* DEMOGRAPHICS */

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

            /* JOBS */

            // axios({
            //   method: 'get',
            //   url: 'https://api.adzuna.com/v1/api/jobs/us/search/1',
            //   params: {
            //     app_id: process.env.REACT_APP_ADZUNA_API_ID,
            //     app_key: process.env.REACT_APP_ADZUNA_API_KEY,
            //     results_per_page: 10,
            //     where: this.state.zipCode,
            //     // what: 'developer'
            //   }
            // }).then(res => this.setState({
            //   jobs: res.data.results
            // }))
            //   .catch(err => console.log(err));
          }
        }
      });
      // add code to get to search nearby attractions
      const nearbyRequest = {
        location: event.latLng,
        radius: '1500',
        type: ['tourist_attraction']
      };
      service.nearbySearch(nearbyRequest, (results, status) => {
        if (status === maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          for (let i = 0; i < results.length; i++) {
            const detailRequest = {
              placeId: results[i].place_id,
              fields: ['name', 'formatted_address', 'photo', 'url']
            }
            service.getDetails(detailRequest, (result, status) => {
              if (status === maps.places.PlacesServiceStatus.OK) {
                // console.log(result);
                // console.log(result.photos[0].getUrl({maxWidth: 400, maxHeight: 400}));
                this.setState({
                  placesOfInterest: [
                    ...this.state.placesOfInterest,
                    {
                      address: result.formatted_address,
                      name: result.name,
                      url: result.url,
                      photo: result.photos[0].getUrl({maxWidth: 400, maxHeight: 400}),
                    }
                  ]
                })
              }
            })
          }
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
          {this.state.showModal ?
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
            />
            : null}
        </GoogleMapReact>
      </Wrapper>
    )
  }
};



export default Map;