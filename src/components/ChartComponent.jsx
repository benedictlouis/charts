import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ChartContainer = ({ title, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(options);

    // Cleanup untuk menghindari memory leak
    return () => {
      chartInstance.dispose();
    };
  }, [options]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
      <div ref={chartRef} className="w-full h-[300px]"></div>
    </div>
  );
};

export default ChartContainer;
