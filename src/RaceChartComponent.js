import React from 'react';
// import {VictoryPie, VictoryContainer, VictoryLegend, VictoryChart, VictoryBar} from 'victory';
// import {PieChart, Pie} from 'recharts';
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
  display: inline-flex;
`;

const ChartWrapper = styled.div`
  width: 50%;
`;

const LegendWrapper = styled.div`
  flex-grow: 1;
`;

const RaceChartComponent = (props) => {
  let chartData = [];
  props.raceByPercent.map((field, index) => chartData.push({x: index + 1, y: parseFloat(field.value)}));
  // console.log(data);
  let legendData = [];
  props.raceByCount.map((field, index) => legendData.push({title: `${index + 1}-${field.description}`, color: 'skyblue'}))
  return (
    <Wrapper>
      <XYPlot height={300} width={300}>
      <XAxis />
      <YAxis />
      <VerticalBarSeries data={chartData} color='skyblue'/>
      </XYPlot>
      <DiscreteColorLegend items={legendData}/>
    </Wrapper>

  )
}

export default RaceChartComponent;