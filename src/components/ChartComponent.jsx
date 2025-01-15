import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then(response => {
        const data = response.data;
        const categories = data.map(item => `Activity ${item.id}`);
        const durations = data.map(item => item.duration_minutes);
        setChartData({ categories, durations });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getOption = () => ({
    title: {
      text: 'Activity Durations (Minutes)',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: chartData.categories || [],
    },
    yAxis: {
      type: 'value',
      name: 'Duration (minutes)',
    },
    series: [
      {
        data: chartData.durations || [],
        type: 'line', 
        smooth: false, 
        areaStyle: {  
          normal: {
            color: 'rgba(64, 158, 255, 0.3)',
          },
        },
        lineStyle: {
          color: '#409eff', 
          width: 2, 
        },
      },
    ],
  });  

  return (
    <ReactECharts option={getOption()} style={{ height: 400 }} />
  );
};

export default ChartComponent;
