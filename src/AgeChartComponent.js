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

const Wrapper = styled.div`
  display: block;
`;

const AgeChartComponent = (props) => {
  let legendData = [];
  let chartData = [];
  const [count, setCount] = React.useState(props.ageByCount);
  const [percent, setPercent] = React.useState(props.ageByPercent);

  React.useEffect(() => {
    setCount(props.ageByCount)
  }, [props.ageByCount])

  React.useEffect(() => {
    setPercent(props.ageByPercent)
  }, [props.ageByPercent])

  if (Object.keys(count).length && Object.keys(percent).length) {
    count.field.map((field, index) => legendData.push({title: `${index + 1}-${field.description}`, color: 'skyblue'}))
    percent.field.map((field, index) => chartData.push({x: index + 1, y: parseFloat(field.value)}))
  }

  return (
    <React.Fragment>
      <h4>{props.ageByPercent.description}</h4>
      <Wrapper>
        {Object.keys(count).length && Object.keys(percent).length ?
          <React.Fragment>
            <XYPlot height={300} width={300}>
            <XAxis />
            <YAxis />
            <VerticalBarSeries data={chartData} color='skyblue' barWidth='0.2'/>
            </XYPlot>
            <DiscreteColorLegend items={legendData}/>
          </React.Fragment>
          : 'Loading...'
        }
      </Wrapper>
    </React.Fragment>
  )
}

export default AgeChartComponent;