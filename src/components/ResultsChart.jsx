import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ResultsChart({ choices }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const labels = choices.map(c => c.text);
    const data = choices.map(c => c.votes || 0);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Votes', data }] },
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 250 } }
    });

    return () => chart.destroy();
  }, [choices]);

  return <div className="chart" style={{ height: 220 }}><canvas ref={canvasRef} /></div>;
}
