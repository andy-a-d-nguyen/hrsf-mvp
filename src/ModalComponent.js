import React from 'react';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import RaceChartComponent from './RaceChartComponent';
import JobsComponent from './JobsComponent';

const ModalComponent = (props) => {
  const [show, setShow] = React.useState(props.show);
  const [key, setKey] = React.useState('demographics');

  return (
    <Modal show={show} onHide={props.onHide} size='lg'>
      <Tabs activeKey={key} onSelect={key => setKey(key)}>
        <Tab eventKey='demographics' title='Demographics'>
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