import React from 'react';
import founder from "../assets/images100266.png";
import twitter from "../assets/twitter.png";
import linkedin from "../assets/linkedin.png";
import instagram from "../assets/instagram.png";
import github from "../assets/github.png";

function BuildBy() {
    return (
        <div id="About" className='sm:flex sm:justify-evenly sm:w-[60%] mx-auto items-center mt-24'>
            <img src={founder} style={{ width: '300px', height: '300px',  alignSelf: 'center', alignItems: 'center' }} />

            <div className='items-center text-center'>
                <h1 className='my-4 font-bold text-[20px]'>Developer Info</h1>
                <p className='sm:w-[60%] mx-auto'>
                    Abhi Jain is full stack web developer who alone build this platform for
                    small indian businesses to easy their finance and rocket their growth.
                </p>
            </div>
            <div className='flex sm:flex-col justify-evenly w-full h-full'>
                <a href='https://twitter.com/abhiwd' >
                    <img src={twitter} style={{ width: '30px', height: '30px', marginTop: '20px' }} />
                </a>
                <a href='https://www.linkedin.com/in/abhi-jain-1b42421ba/' >
                    <img src={linkedin} style={{ width: '30px', height: '30px', marginTop: '20px' }} />
                </a>
                <a href='https://www.instagram.com/abhijain5403/' >
                    <img src={instagram} style={{ width: '30px', height: '30px', marginTop: '20px' }} />
                </a>
                <a href='https://github.com/abhijain2003' >
                    <img src={github} style={{ width: '30px', height: '30px', marginTop: '20px' }} />
                </a>
            </div>
        </div>
    )
}

export default BuildBy