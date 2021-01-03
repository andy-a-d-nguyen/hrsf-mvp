import React from 'react';
import styled from 'styled-components/macro';
import {
  XYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  DiscreteColorLegend,
} from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import { Spinner } from 'react-bootstrap';

const Wrapper = styled.div`
  display: inline-flex;
`;

const Header = styled.h2`
  text-align: center;
  color: skyblue;
`;

const GenderChartComponent = (props) => {
  let legendData = [];
  let chartData = [];
  const [count, setCount] = React.useState(props.genderByCount);
  const [percent, setPercent] = React.useState(props.genderByPercent);

  React.useEffect(() => {
    setCount(props.genderByCount)
  }, [props.genderByCount])

  React.useEffect(() => {
    setPercent(props.genderByPercent)
  }, [props.genderByPercent])

  if (Object.keys(count).length && Object.keys(percent).length) {
    count.field.map((field, index) => legendData.push({title: `${index + 1}-${field.description}`, color: 'skyblue'}))
    percent.field.map((field, index) => chartData.push({x: index + 1, y: parseFloat(field.value)}))
  }

  return (
    <React.Fragment>
      <Header>{props.genderByPercent.description}</Header>
      <Wrapper>
        {Object.keys(count).length && Object.keys(percent).length ?
          <React.Fragment>
            <XYPlot height={300} width={300}>
            <XAxis />
            <YAxis />
            <VerticalBarSeries data={chartData} color='skyblue'/>
            </XYPlot>
            <DiscreteColorLegend items={legendData}/>
          </React.Fragment>
          : <Spinner animation='border'/>
        }
      </Wrapper>
    </React.Fragment>
  )
};

export default GenderChartComponent;