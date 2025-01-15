import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const App = () => {
  const [durationsData, setDurationsData] = useState([]);
  const [jobsPerPicData, setJobsPerPicData] = useState([]);
  const [statusDistributionData, setStatusDistributionData] = useState([]);
  const [jobsPerMonthData, setJobsPerMonthData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/durations')
      .then(response => setDurationsData(response.data))
      .catch(error => console.error('Error fetching durations:', error));

    axios.get('http://localhost:3000/jobs-per-pic')
      .then(response => setJobsPerPicData(response.data))
      .catch(error => console.error('Error fetching jobs per PIC:', error));

    axios.get('http://localhost:3000/job-status-distribution')
      .then(response => setStatusDistributionData(response.data))
      .catch(error => console.error('Error fetching job status distribution:', error));

    axios.get('http://localhost:3000/jobs-per-month')
      .then(response => setJobsPerMonthData(response.data))
      .catch(error => console.error('Error fetching jobs per month:', error));
  }, []);

  // Chart options
  const durationsChartOption = {
    title: { text: 'Durations (Minutes)', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Duration: ${value} minutes`;
      },
    },
    xAxis: { type: 'category', data: durationsData.map(d => `Task ${d.id}`) },
    yAxis: { type: 'value', name: 'Duration (minutes)' },
    series: [{
      data: durationsData.map(d => d.duration_minutes),
      type: 'line',
      smooth: false,
      areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
    }],
  };  

  const jobsPerPicChartOption = {
    title: { text: 'Jobs per PIC', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Total Jobs: ${value}`;
      },
    },
    xAxis: { type: 'category', data: jobsPerPicData.map(d => d.pic_name) },
    yAxis: { type: 'value', name: 'Jobs' },
    series: [{
      data: jobsPerPicData.map(d => d.total_jobs),
      type: 'bar',
      color: '#67C23A',
    }],
  };  

  const statusDistributionChartOption = {
    title: { text: 'Job Status Distribution', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 10, left: 'center' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: statusDistributionData.map(d => ({
        value: d.total_jobs,
        name: d.status_kerja,
      })),
    }],
  };

  const jobsPerMonthChartOption = {
    title: { text: 'Jobs per Month', left: 'center' },
    xAxis: { type: 'category', data: jobsPerMonthData.map(d => d.bulan) },
    yAxis: { type: 'value', name: 'Jobs' },
    series: [{
      data: jobsPerMonthData.map(d => d.total_jobs),
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(255, 140, 0, 0.3)' },
      lineStyle: { color: '#FF8C00' },
    }],
  };

  return (
    <div>
      <h1>Data Visualization Dashboard</h1>
      <ReactECharts option={durationsChartOption} style={{ height: 400 }} />
      <ReactECharts option={jobsPerPicChartOption} style={{ height: 400 }} />
      <ReactECharts option={statusDistributionChartOption} style={{ height: 400 }} />
      <ReactECharts option={jobsPerMonthChartOption} style={{ height: 400 }} />
    </div>
  );
};

export default App;
