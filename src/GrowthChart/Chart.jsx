import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



function BarChart({ data }) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Company Growth Data using Bar Chart',
            }
        },
    };

    return (
        <div className='w-[90%] mx-auto mt-24 sm:w-[700px]' >
            <Bar options={options} data={data} />
        </div>
    );
}


export default BarChart
