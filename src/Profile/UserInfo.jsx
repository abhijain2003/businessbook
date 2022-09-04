import React from 'react';

function UserInfo({ found }) {



    return (
        <div className='sm:w-[60%] w-[90%] mx-auto overflow-y-auto mb-2'>
            <div className='flex justify-between w-full' >
                <h1 className='font-medium my-4' >User Profile</h1>
                <h1 className='font-medium my-4' >Joined on {found[0].DateOfJoin}</h1>
            </div>
            <div className='flex mb-4 items-center justify-center mx-auto' >
                <img src={found[0].businessLogo} style={{ width: '100px', height: '100px', position: 'relative', borderRadius: '50%' }} />
            </div>

            <div className='userProfile' >
                <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Company Name
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].companyName.split("-").join(" ").charAt(0).toUpperCase() + found[0].companyName.split("-").join(" ").slice(1)}</p>
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Company Contact Number
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].companyNumber}</p>
                </div>
                <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Company Mail
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].companyMail}</p>
                </div>
                <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Bank Account Name
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].bankName}</p>
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Company Address
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].companyAddress}</p>
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Bank Account Number
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].accountNumber}</p>
                </div>
                <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        Bank Branch Name
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].branchName}</p>
                </div>
                <div className="md:ml-2">
                    <label
                        className="block mb-2 text-sm font-bold uppercase text-gray-700"
                    >
                        IFSC Code
                    </label>
                    <p
                        className="w-full px-3 py-2 text-[12px] leading-tight bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >{found[0].ifscCode}</p>
                </div>
            </div>
        </div>
    )
}

export default UserInfo