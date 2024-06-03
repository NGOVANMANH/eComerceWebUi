import React, { useRef, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Button } from 'react-bootstrap';

Chart.register(...registerables);

const ChartComponent = () => {
    const chartRef = useRef(null);
    const [chartType, setChartType] = useState('bar'); // Default chart type
    const [chartData, setChartData] = useState({
        title: '',
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
            {
                label: "Population (millions)",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: [2478, 5267, 734, 784, 433]
            }
        ]
    });

    const options = {
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Predicted world population (millions) in 2050"
            }
        }
    };

    const updateChartData = (type) => {
        // Logic to update chart data based on type (e.g., revenue, orders, customers)
        let newData;
        switch (type) {
            case 'revenue':
                newData = [1000, 2000, 3000, 4000, 5000]; // Example data
                break;
            case 'orders':
                newData = [150, 300, 450, 600, 750]; // Example data
                break;
            case 'customers':
                newData = [50, 100, 150, 200, 250]; // Example data
                break;
            default:
                newData = [2478, 5267, 734, 784, 433]; // Default data
        }

        setChartData({
            title: type,
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [
                {
                    label: type.charAt(0).toUpperCase() + type.slice(1) + " Data",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: newData
                }
            ]
        });
    };

    const ChartComponent = () => {
        switch (chartType) {
            case 'line':
                return <Line ref={(chartInstance) => { chartRef.current = chartInstance?.chartInstance; }} data={chartData} options={options} />;
            case 'pie':
                return <div className='w-50'><Pie ref={(chartInstance) => { chartRef.current = chartInstance?.chartInstance; }} data={chartData} options={options} /></div>;
            default:
                return <Bar ref={(chartInstance) => { chartRef.current = chartInstance?.chartInstance; }} data={chartData} options={options} />;
        }
    };

    return (
        <div>
            <div className='mb-2'>
                <Button variant='outline-primary' active={chartType === 'bar'} onClick={() => setChartType('bar')}>Bar Chart</Button>
                <Button variant='outline-primary' className='ms-2' active={chartType === 'line'} onClick={() => setChartType('line')}>Line Chart</Button>
                <Button variant='outline-primary' className='ms-2' active={chartType === 'pie'} onClick={() => setChartType('pie')}>Pie Chart</Button>
            </div>
            <div className='mb-2'>
                <Button active={chartData.title === 'revenue'} onClick={() => updateChartData('revenue')}>Revenue</Button>
                <Button active={chartData.title === 'orders'} className='ms-2' onClick={() => updateChartData('orders')}>Orders</Button>
                <Button active={chartData.title === 'customers'} className='ms-2' onClick={() => updateChartData('customers')}>Customers</Button>
                <Button active={chartData.title === 'products'} className='ms-2' onClick={() => updateChartData('products')}>Products</Button>
            </div>
            <ChartComponent />
        </div>
    );
};

export default ChartComponent;
