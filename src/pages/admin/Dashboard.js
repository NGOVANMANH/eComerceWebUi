import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Ensure Chart.js is imported and registered
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCreditCard, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from 'react-bootstrap';
import ChartComponent from '../../components/ChartComponent'

const Dashboard = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Clean up the chart instance when the component unmounts
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className='container'>
            <div className='d-flex my-2'>
                <div className="card-body rounded border p-2 me-2">
                    <h5 className="font-weight-normal mb-3 d-flex">
                        <span className='me-auto'>Weekly Sales</span>
                        <FontAwesomeIcon icon={faDollarSign} />
                    </h5>
                    <h3 className="mb-4">$ 150,000</h3>
                    <h7 className="card-text">Increased by 60%</h7>
                </div>
                <div className="card-body rounded border p-2 me-2">
                    <h5 className="font-weight-normal mb-3 d-flex">
                        <span className='me-auto'>Weekly Orders</span>
                        <FontAwesomeIcon icon={faCreditCard} />
                    </h5>
                    <h3 className="mb-4">$ 150,000</h3>
                    <h7 className="card-text">Increased by 60%</h7>
                </div>
                <div className="card-body rounded border p-2">
                    <h5 className="font-weight-normal mb-3 d-flex">
                        <span className='me-auto'>Weekly Customers</span>
                        <FontAwesomeIcon icon={faUserTie} />
                    </h5>
                    <h3 className="mb-4">$ 150,000</h3>
                    <h7 className="card-text">Increased by 60%</h7>
                </div>
            </div>

            <div className='my-4 d-flex'>
                <FormControl placeholder='From...' className='me-2' />
                <FormControl placeholder='To...' />
                <button className="btn btn-primary ms-2">Filter</button>
            </div>

            <ChartComponent />
        </div>
    );
};

export default Dashboard;
