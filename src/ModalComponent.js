import React from 'react';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import AgeChartComponent from './AgeChartComponent';
import GenderChartComponent from './GenderChartComponent';
import RaceChartComponent from './RaceChartComponent';
import JobsComponent from './JobsComponent';

const ModalComponent = (props) => {
  const [show, setShow] = React.useState(props.show);
  const [key, setKey] = React.useState('gender-demographics');

  return (
    <Modal show={show} onHide={props.onHide} size='lg'>
      <Tabs activeKey={key} onSelect={key => setKey(key)}>
        {/* <Tab eventKey='age-demographics' title='Age Demographics'>
          <AgeChartComponent ageByCount={props.ageByCount} ageByPercent={props.ageByPercent}/>
        </Tab> */}
        <Tab eventKey='gender-demographics' title='Gender Demographics'>
          <GenderChartComponent genderByCount={props.genderByCount} genderByPercent={props.genderByPercent}/>
        </Tab>
        <Tab eventKey='race-demographics' title='Race Demographics'>
          <RaceChartComponent raceByCount={props.raceByCount} raceByPercent={props.raceByPercent} />
        </Tab>
        <Tab eventKey='jobs' title='Jobs'>
          <JobsComponent jobs={props.jobs} zipCode={props.zipCode}/>
        </Tab>
      </Tabs>
    </Modal>
  )
}

export default ModalComponent;