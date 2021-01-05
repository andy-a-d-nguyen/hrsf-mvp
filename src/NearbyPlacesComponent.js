import React from 'react';
import styled from 'styled-components';
import { Spinner, CardGroup, CardDeck, Card, CardColumns, Form, Button, InputGroup } from 'react-bootstrap';
// import axios from 'axios';

const NearbyPlacesComponent = (props) => {
  const [places, setPlaces] = React.useState(props.placesOfInterest);
  // const [place, setPlace] = React.useState('library');
  // const [newPlaces, setNewPlaces] = React.useState([]);

  React.useEffect(() => {
    setPlaces(props.placesOfInterest);
  }, [props.placesOfInterest]);

  // const getNewPlaces = () => {
  //   axios({
  //     method: 'get',
  //     url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  //     params: {
  //       key: process.env.REACT_APP_GOOGLE_API_KEY,
  //       location: `${props.location.latitude},${props.location.longitude}`,
  //       radius: '1500',
  //       type: `${place}`
  //     }
  //   }).then(res => getNewPlacesDetails(res.data.results))
  //     .catch(err => console.log(err));
  // }

  // const getNewPlacesDetails = (places) => {
  //   let newPlaces = [];
  //   for (let i = 0; i < places.length; i++) {
  //     axios({
  //       method: 'get',
  //       url: 'https://maps.googleapis.com/maps/api/place/details/json',
  //       params: {
  //         key: process.env.REACT_APP_GOOGLE_API_KEY,
  //         place_id: places[i].place_id,
  //         fields: 'name,formatted_address,photo,url'
  //       }
  //     }).then(res => {
  //         newPlaces.push(storeNewPlacesDetails(res.data.result));
  //         // console.log(newPlaces);
  //       })
  //       .catch(err => console.log(err))
  //       // .then(() => console.log(newPlaces));
  //   }
  // }

  // const storeNewPlacesDetails = (place) => {
  //   let newPlace = {};
  //   newPlace.name = place.name;
  //   newPlace.address = place.formatted_address;
  //   newPlace.url = place.url;
  //   if (place && place.photos && place.photos.length > 0 && place.photos[0].photo_reference) {
  //     axios({
  //       method: 'get',
  //       url: 'https://maps.googleapis.com/maps/api/place/photo',
  //       params: {
  //         key: process.env.REACT_APP_GOOGLE_API_KEY,
  //         photoreference: place.photos[0].photo_reference,
  //         maxheight: '400',
  //       }
  //     }).then(res => {
  //         newPlace.photo = res.request.responseURL;
  //       })
  //       .catch(err => console.log(err))
  //       .then((newPlace) =>
  //         {if (Object.keys(newPlace).length > 0) {
  //           setNewPlaces(prevState => [...prevState, newPlace])
  //         }});

  //   }
  // }

  return (
    <React.Fragment>
      {/* <InputGroup>
        <Form.Control as='select' onChange={(event) => setPlace(event.target.value)}>
          <option value='library'>Library</option>
          <option value='art_gallery'>Art Gallery</option>
          <option value='bar'>Bar</option>
          <option value='museum'>Museum</option>
          <option value='night_club'>Night Club</option>
        </Form.Control>
        <InputGroup.Append>
          <Button onClick={getNewPlaces}>Search</Button>
        </InputGroup.Append>
      </InputGroup> */}
      {Object.keys(places).length ?
        <CardColumns>
          {places.map(place =>
            <a href={place.url} target='_blank' rel='noreferrer noopener'>
              <Card text='info'>
              <Card.Img variant='top' src={place.photo} />
              <Card.Body>
                <Card.Title>{place.name}</Card.Title>
                <Card.Text>{place.address}</Card.Text>
              </Card.Body>
              </Card>
            </a>
          )}
        </CardColumns>
        : <Spinner animation='border'/>
      }
    </React.Fragment>
  )
}

export default NearbyPlacesComponent;