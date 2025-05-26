"use client"
import dynamic from 'next/dynamic';
import React from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ResourceDashboard() {
  // داده‌های نمونه برای چارت‌ها
  const cpuData = {
    options: {
      chart: { id: 'cpu-usage' },
      xaxis: { categories: ['10s', '20s', '30s', '40s', '50s', '60s'] },
      title: { text: 'CPU Usage', align: 'center' as "center" },
    },
    series: [
      { name: 'CPU', data: [20, 40, 35, 50, 49, 60] },
    ],
  };
  const ramData = {
    options: {
      chart: { id: 'ram-usage' },
      xaxis: { categories: ['10s', '20s', '30s', '40s', '50s', '60s'] },
      title: { text: 'RAM Usage', align: 'center' as "center" },
    },
    series: [
      { name: 'RAM', data: [30, 32, 31, 35, 40, 45] },
    ],
  };
  const diskData = {
    options: {
      chart: { id: 'disk-usage' },
      xaxis: { categories: ['10s', '20s', '30s', '40s', '50s', '60s'] },
      title: { text: 'Hard Disk Usage', align: 'center' as "center" },
    },
    series: [
      { name: 'Hard Disk', data: [50, 55, 53, 60, 65, 70] },
    ],
  };
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>System Resource Management Dashboard</h1>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
          <Chart options={cpuData.options} series={cpuData.series} type="line" width={400} height={250} />
        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
          <Chart options={ramData.options} series={ramData.series} type="area" width={400} height={250} />
        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
          <Chart options={diskData.options} series={diskData.series} type="bar" width={400} height={250} />
        </div>
      </div>
      <div style={{ marginTop: 40, textAlign: 'center', color: '#888' }}>
        <p>System resource information is expandable in real time.</p>
      </div>
    </div>
  );
}
