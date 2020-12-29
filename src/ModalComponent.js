import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, AppBar, Tabs, Tab, Container } from '@material-ui/core';
import TabPanelComponent from './TabPanelComponent';
import RaceChartComponent from './RaceChartComponent';

const useStyles = makeStyles({
  modal: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    background: 'white',
    top: '50%',
    left: '50%',
    // transform: 'translate(-50%, -50%)',
    height: '60%',
    width: '50%',
    // display: 'flex',
    position: 'absolute',
    boxShadow: 'rgba(0, 0, 0, 0.28) 0px 8px 28px'
  },
})

const ModalComponent = (props) => {
  // const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const text = (
  //   <p>Hello World</p>
  // )
  return (
    <Modal
      className={classes.modal}
      open={props.open}
      onClose={props.onClose}
      BackdropProps={{
        invisible: true
      }}
    >
      <div>
        <AppBar position='static'>
          <Tabs value={value} onChange={handleChange}>
            <Tab label='Demographics'></Tab>
            <Tab label='Jobs'></Tab>
          </Tabs>
        </AppBar>
        <TabPanelComponent value={value} index={0} >
          <RaceChartComponent raceByCount={props.raceByCount} raceByPercent={props.raceByPercent} />
        </TabPanelComponent>
        <TabPanelComponent value={value} index={1}>
          Hello 2
        </TabPanelComponent>
      </div>
    </Modal>
  )
}

export default ModalComponent;