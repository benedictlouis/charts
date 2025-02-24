import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const App = () => {
  const [durationsData, setDurationsData] = useState([]);
  const [durationsByCategoryData, setDurationsByCategoryData] = useState([]);
  const [averageDurations, setAverageDurations] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobsPerPicData, setJobsPerPicData] = useState([]);
  const [picPercentageData, setPicPercentageData] = useState([]);
  const [statusDistributionData, setStatusDistributionData] = useState([]);
  const [jobsPerMonthData, setJobsPerMonthData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/durations')
      .then(response => setDurationsData(response.data))
      .catch(error => console.error('Error fetching durations:', error));

    axios.get('http://localhost:3000/durations-by-category')
      .then(response => setDurationsByCategoryData(response.data))
      .catch(error => console.error('Error fetching durations by category:', error));

    axios.get('http://localhost:3000/average-durations')
      .then(response => setAverageDurations(response.data))
      .catch(error => console.error('Error fetching average durations:', error));

    axios.get('http://localhost:3000/job-categories')
      .then(response => setJobCategories(response.data))
      .catch(error => console.error('Error fetching job categories:', error));

    axios.get('http://localhost:3000/jobs-per-pic')
      .then(response => setJobsPerPicData(response.data))
      .catch(error => console.error('Error fetching jobs per PIC:', error));
      
    axios.get('http://localhost:3000/jobs-per-pic-percentage')
      .then(response => setPicPercentageData(response.data))
      .catch(error => console.error('Error fetching PIC percentage:', error));

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
        return `${name}<br>Duration: ${parseFloat(value).toFixed(2)} minutes`;
      },
    },
    xAxis: { 
      type: 'category', 
      data: durationsData.map(d => `Task ${d.id}`),
    },
    yAxis: { type: 'value', name: 'Duration (minutes)' },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    series: [{
      data: durationsData.map(d => d.duration_minutes),
      type: 'line',
      smooth: false,
      areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
    }],
  };

  const durationsByCategoryChartOption = {
    title: { text: 'Average Duration by Job Category', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Avg Duration: ${parseFloat(value).toFixed(2)} minutes`;
      },
    },
    xAxis: {
      type: 'category',
      data: durationsByCategoryData.map(d => d.kategori_pekerjaan),
    },
    yAxis: { 
      type: 'value', 
      name: 'Avg Duration (minutes)' 
    },
    series: [{
      data: durationsByCategoryData.map(d => d.avg_duration_minutes), 
      type: 'bar',
      smooth: false,
      color: '#FF7043',
      label: {
        show: true,
        position: 'top',
        formatter: '{c} min',
      },
    }],
  };
  
  const averageDurationsChartOption = {
    title: { text: 'Average Task Durations', left: 'center' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { name, value } = params[0];
        return `${name}<br>Average Duration: ${parseFloat(value).toFixed(2)} minutes`;
      },
    },
    xAxis: {
      type: 'category',
      data: averageDurations.map(d => `Year ${d.year}, Week ${d.week}`),
    },
    yAxis: { type: 'value', name: 'Avg Duration (minutes)' },
    series: [{
      data: averageDurations.map(d => d.avg_duration_minutes),
      type: 'bar',
      color: '#409EFF',
    }],
    dataZoom: [
      {
        type: 'slider',  
        show: true,
        xAxisIndex: [0],
        start: 0,  
        end: 100, 
      },
      {
        type: 'inside',  
        xAxisIndex: [0],
      }
    ],
  };

  const jobCategoriesChartOption = {
    title: {
      text: 'Job Categories Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} jobs ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Job Categories',
        type: 'pie',
        radius: '50%',
        data: jobCategories.map(cat => ({
          value: cat.total_jobs,
          name: cat.kategori_pekerjaan,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
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

  const generateGaugeOptions = (name, percentage) => {
    // Pastikan percentage adalah angka, jika tidak, ubah menjadi 0
    const value = typeof percentage === 'number' ? percentage : parseFloat(percentage) || 0;
  
    return {
      title: {
        text: `${name} Jobs Percentage`,
        left: 'center',
      },
      series: [
        {
          type: 'gauge',
          radius: '80%',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: '#4caf50', 
            },
          },
          axisLine: {
            lineStyle: {
              width: 10,
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          data: [
            {
              value: value,
              name: `${value.toFixed(2)}%`, 
            },
          ],
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 16,
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '10%'],
            formatter: '{value}%',
          },
        },
      ],
    };
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
    tooltip: { trigger: 'axis' },
    xAxis: { 
      type: 'category', 
      data: jobsPerMonthData.map(d => d.month_year),
    },
    yAxis: { 
      type: 'value', 
      name: 'Jobs' 
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: Math.min(100, (10 / jobsPerMonthData.length) * 100),
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: Math.min(100, (10 / jobsPerMonthData.length) * 100),
      },
    ],
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
      <ReactECharts option={durationsByCategoryChartOption} style={{ height: 400 }} />
      <ReactECharts option={averageDurationsChartOption} style={{ height: 400 }} />
      <ReactECharts option={jobCategoriesChartOption} style={{ height: 400 }} />
      <ReactECharts option={jobsPerPicChartOption} style={{ height: 400 }} />
      <ReactECharts option={statusDistributionChartOption} style={{ height: 400 }} />
      <ReactECharts option={jobsPerMonthChartOption} style={{ height: 400 }} />

      <div style={{ marginBottom: '20px' }}>
      <h2>Jobs Per PIC Percentage</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {picPercentageData.map((picData, index) => (
          <div key={index} style={{ flex: '1 1 30%', minWidth: '250px' }}>
            <ReactECharts
              option={generateGaugeOptions(picData.pic_name, picData.percentage)}
              style={{ height: 300 }}
            />
          </div>
        ))}
      </div>
    </div>

    </div>
  );
};

export default App;
