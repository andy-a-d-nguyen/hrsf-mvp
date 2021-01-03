import React from 'react';
import { ListGroup, Card, CardGroup, InputGroup, Form, FormControl, Button } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

const removeTags = (str) => {
  if ((str===null) || (str===''))
      return false;
  else
      str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace( /(<([^>]+)>)/ig, '');
}

const cleanStr = (str) => {
  str = str.replace(/Â/ig, '');
  str = str.replace(//ig, '\'');
  str = str.replace(//ig, '');
  return str;
}

const JobsComponent = (props) => {
  const [jobs, setJobs] = React.useState(props.jobs);
  const [input, setInput] = React.useState('');

  const findJobs = () => {
    axios({
      method: 'get',
      url: 'https://api.adzuna.com/v1/api/jobs/us/search/1',
      params: {
        app_id: process.env.REACT_APP_ADZUNA_API_ID,
        app_key: process.env.REACT_APP_ADZUNA_API_KEY,
        results_per_page: 10,
        where: props.zipCode,
        what: input
      }
    }).then(res => setJobs(res.data.results))
      .catch(err => console.log(err))
  }

  React.useEffect(() => {
    setJobs(props.jobs)
  }, [props.jobs])

  return (
    <React.Fragment>
      <InputGroup>
        <Form.Control placeholder='Search for Jobs' onChange={(event) => setInput(event.target.value)}/>
        <InputGroup.Append>
          <Button onClick={findJobs}>Search</Button>
        </InputGroup.Append>
      </InputGroup>
      {jobs.map(job =>
        <Card>
          <Card.Body>
            <Card.Title>{removeTags(job.title)}</Card.Title>
            <Card.Subtitle>{job.company.display_name}</Card.Subtitle>
            <Card.Link href={job.redirect_url} target='_blank'>Where to Apply</Card.Link>
          </Card.Body>
          <Card.Footer>{removeTags(cleanStr(job.description))}</Card.Footer>
        </Card>
      )}
    </React.Fragment>
  )
}

export default JobsComponent;