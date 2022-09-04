import React from 'react';

function UpdateProfile({
    setnewComAddress, 
    setnewComMail,  
    setnewComNumber,
    handleAddress,
    handleMail,
    handleNumber
}) {
    return (
        <div style={{ border: '1px solid black' }} className="p-8 bg-white h-[90%] w-[70%] mx-auto items-center" >
        <h1 className='font-bold uppercase text-center text-[20px]' >Update Profile</h1>
            <div className="mb-4 md:mr-2 md:mb-0">
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                >
                    Enter New Company Number
                </label>
                <div className='flex justify-between' >
                    <input onChange={(e) => setnewComNumber(e.target.value)}
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                    <button onClick={handleNumber} className='bg-blue-600 text-white p-2 rounded-[10px] ml-2' >ok</button>
                </div>
            </div>
            <div className="mb-4 md:mr-2 md:mb-0">
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                >
                    Enter New Company Mail
                </label>
                <div className='flex justify-between' >
                    <input onChange={(e) => setnewComMail(e.target.value)}
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                    <button onClick={handleMail} className='bg-blue-600 text-white p-2 rounded-[10px] ml-2' >ok</button>
                </div>
            </div>
            <div className="mb-4 md:mr-2 md:mb-0">
                <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                >
                    Enter New Company Address
                </label>
                <div className='flex justify-between' >
                    <input onChange={(e) => setnewComAddress(e.target.value)}
                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    />
                    <button onClick={handleAddress} className='bg-blue-600 text-white p-2 rounded-[10px] ml-2' >ok</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfile
