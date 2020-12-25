import React from 'react';
import styled from 'styled-components/macro';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';

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
      raceByPercent: [],
      raceByCount: [],
    }

    this.handleApiLoaded = this.handleApiLoaded.bind(this);
  }

  handleApiLoaded(map, maps) {
    const geocoder = new maps.Geocoder();
    map.addListener('click', (event) => {
      geocoder.geocode({
        'latLng': event.latLng
      }, (results, status) => {
        if (status === maps.GeocoderStatus.OK) {
          if (results[0]) {
            this.setState({
              address: results[0].formatted_address
            })
            axios({
              method: 'get',
              url: 'https://api.precisely.com/demographics-segmentation/v1/demographics/byaddress?',
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_PRECISELY_API_KEY}`,
                Accept: 'application/json'
              },
              params: {
                address: `${results[0].formatted_address}`,
                country: 'USA',
                filter: 'raceAndEthnicityTheme',
                valueFormat: 'Both',
                variableLevel: 'Key'
              }
            }).then(res => this.setState({
              raceByPercent: res.data.themes.raceAndEthnicityTheme.rangeVariable[0].field,
              raceByCount: res.data.themes.raceAndEthnicityTheme.rangeVariable[1].field,
            }))
              .catch(err => console.log(err))
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
        </GoogleMapReact>
      </Wrapper>
    )
  }
};



export default Map;