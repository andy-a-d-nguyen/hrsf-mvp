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
      raceByPercent: [],
      raceByCount: [],
      isModalOpen: false,
      ip: '',
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
      isModalOpen: !this.state.isModalOpen
    })
  }

  handleApiLoaded(map, maps) {
    const geocoder = new maps.Geocoder();
    map.addListener('click', (event) => {
      geocoder.geocode({
        'latLng': event.latLng
      }, (results, status) => {
        if (status === maps.GeocoderStatus.OK) {
          if (results[0]) {
            console.log(results[0])
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
              isModalOpen: true
            })
            // axios({
            //   method: 'get',
            //   url: 'https://api.precisely.com/demographics-segmentation/v1/demographics/byaddress?',
            //   headers: {
            //     Authorization: `Bearer ${process.env.REACT_APP_PRECISELY_API_KEY}`,
            //     Accept: 'application/json'
            //   },
            //   params: {
            //     address: `${this.state.address}`,
            //     country: `${this.state.country}`,
            //     filter: 'raceAndEthnicityTheme',
            //     valueFormat: 'Both',
            //     variableLevel: 'Key'
            //   }
            // }).then(res => this.setState({
            //   raceByPercent: res.data.themes.raceAndEthnicityTheme.rangeVariable[0].field,
            //   raceByCount: res.data.themes.raceAndEthnicityTheme.rangeVariable[1].field,
            // }))
            //   .catch(err => console.log(err))
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
          {this.state.isModalOpen ?
            <ModalComponent
              open={this.state.isModalOpen}
              onClose={this.handleModal}
              raceByCount={this.state.raceByCount}
              raceByPercent={this.state.raceByPercent}
            >

            </ModalComponent>
            : null}
        </GoogleMapReact>
      </Wrapper>
    )
  }
};



export default Map;