import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExpenseChartProps {
  weeklyData: {
    [key: string]: {
      total: number;
      meals: {
        morning: any[];
        lunch: any[];
        evening: any[];
      };
    };
  };
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ weeklyData }) => {
  const prepareWeeklyData = () => {
    const dates = Object.keys(weeklyData).sort();
    const morningTotals = dates.map(date => 
      weeklyData[date].meals.morning.reduce((sum, exp) => sum + exp.amount, 0)
    );
    const lunchTotals = dates.map(date => 
      weeklyData[date].meals.lunch.reduce((sum, exp) => sum + exp.amount, 0)
    );
    const eveningTotals = dates.map(date => 
      weeklyData[date].meals.evening.reduce((sum, exp) => sum + exp.amount, 0)
    );

    return {
      labels: dates.map(date => format(new Date(date), 'EEE, MMM d')),
      datasets: [
        {
          label: 'Evening',
          data: eveningTotals,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.3)',
          tension: 0.4,
          fill: true,
          order: 1
        },
        {
          label: 'Lunch',
          data: lunchTotals,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.3)',
          tension: 0.4,
          fill: true,
          order: 2
        },
        {
          label: 'Morning',
          data: morningTotals,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.3)',
          tension: 0.4,
          fill: true,
          order: 3
        }
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        reverse: true,
      },
      title: {
        display: true,
        text: 'Weekly Expense Trend',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ₹${context.raw}`;
          },
          footer: (tooltipItems: any) => {
            const total = tooltipItems.reduce((sum: number, item: any) => sum + item.raw, 0);
            return `Total: ₹${total}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        stacked: true,
        title: {
          display: true,
          text: 'Amount (₹)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Trend</h3>
      <div className="h-[300px]">
        <Line options={options} data={prepareWeeklyData()} />
      </div>
    </div>
  );
};

export default ExpenseChart;