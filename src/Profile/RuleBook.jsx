import React from 'react';


function RuleBook({
    foundRule,
    handleRule1,
    handleRule2,
    handleRule3,
    handleRule4,
    handleRule5
}) {


    const rules = [
        { name: 'Rule 1', locate: foundRule[0].rule1, apply: handleRule1 },
        { name: 'Rule 2', locate: foundRule[0].rule2, apply: handleRule2 },
        { name: 'Rule 3', locate: foundRule[0].rule3, apply: handleRule3 },
        { name: 'Rule 4', locate: foundRule[0].rule4, apply: handleRule4 },
        { name: 'Rule 5', locate: foundRule[0].rule5, apply: handleRule5 },
    ]

    return (
        <div className='bg-white h-full w-[90%] sm:w-[60%] mx-auto text-center'>
            <h1 className='font-bold text-[15px] capitalize mt-4' >Update Invoice Terms and Conditions</h1>
            {rules.map((val, i) => (
                <div key={i} className="mb-4 md:mr-2 md:mb-0 mt-2">
                    <label
                        className="block mb-2 text-sm font-bold text-gray-700"
                    >
                        {val.name}
                    </label>
                    <div className='flex justify-between' >
                        <p
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        >{val.locate}</p>
                        <button onClick={val.apply} className='hover:bg-blue-100 hover:text-blue-600 bg-blue-600 text-white p-2 rounded-[10px] ml-2' >
                           U
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RuleBook