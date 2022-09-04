import React from 'react';
import main_logo from '../assets/main_logo.png';


function Button({
    handleSignOut,
}) {

    return (
        <div className='sm:w-[95%] mx-auto mt-4' >
            <div className="flex justify-between px-2">
                <div></div>
                <img src={main_logo} style={{ width: '300px', height: '75px', position: 'relative' }} />
                <button onClick={handleSignOut} className='sm:block hidden h-[40px] text-white mt-2 bg-blue-600 px-4 py-2 hover:bg-blue-100 hover:text-blue-600 rounded-[10px] cursor-pointer' >Logout</button>
            </div>
        </div>
    )
}

export default Button