import React from 'react';
import numWords from "num-words";


function SalesInvoiceTemplate({
    componentRef,
    clientAddress,
    clientGST,
    clientName,
    times,
    ship,
    billType,
    ownerName,
    foundUser,
    foundRule,
    sumDue,
    sumTax,
    sumTaxable,
    foundSale
}) {

    var date = new Date();
    var dueDate = new Date();
    dueDate.setMonth(date.getMonth() + 1);

    if (foundUser.length !== 0) {
        return (
            <div>
                <div
                    ref={componentRef}
                    className="printView  mb-4 bg-white w-[70%] min-h-min mx-auto"
                >
                    {/* owner heading */}
                    <div className="grid grid-cols-2 font-medium">
                        <div className="flex items-center mt-2 justify-evenly">
                        <img src={foundUser[0].businessLogo} style={{ width: '100px', height: '100px', position: 'relative', borderRadius: '50%', overflow: 'hidden' }} />
                            <h1
                                className="text-[25px]"
                                style={{ fontFamily: "Roboto Condensed, sans-serif" }}
                            >
                                {ownerName}
                            </h1>
                        </div>
                        <div className="flex items-center mt-2 justify-between w-[90%] mx-auto">
                            <p></p>
                            <h1
                                className="text-[20px]"
                                style={{ fontFamily: "Roboto Condensed, sans-serif" }}
                            >
                                Tax Invoice
                            </h1>
                        </div>
                    </div>
                    {/* supplier info */}
                    <div className="grid" style={{ gridTemplateColumns: "45% 5% 50%" }}>
                        <div className="flex flex-col ml-4 mt-4">
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                    Supplier Name
                                </p>
                                <p className="font-bold text-[15px] mt-[2px]">{ownerName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                    Supplier Number
                                </p>
                                <p className="font-medium text-[15px] mt-[2px]">
                                    {foundUser[0].companyNumber}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                    Supplier GST
                                </p>
                                <p className="font-medium text-[15px] mt-[2px]">
                                    {foundUser[0].GST}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                    Supplier Address
                                </p>
                                <p className="font-medium text-[15px] mt-[2px]">
                                    {foundUser[0].companyAddress}
                                </p>
                            </div>
                        </div>
                        <div></div>
                        <div className="flex flex-col">
                            <div className="flex justify-between text-white font-bold w-[90%] mx-auto bg-[#06283D] p-2">
                                <h2>Amount Due</h2>
                                <h2>{sumDue}</h2>
                            </div>
                            <div className="flex flex-col mr-4 mt-4">
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        Bill no.
                                    </p>
                                    <p className="font-medium mt-[2px] text-[15px] ">
                                        {foundSale.length + 1}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        Bill To
                                    </p>
                                    <p className="font-bold mt-[2px]  text-[15px] uppercase">
                                        {clientName}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        Bill Type
                                    </p>
                                    <p className="font-bold mt-[2px]  text-[15px] uppercase">
                                        {billType}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        Client GST
                                    </p>
                                    <p className="font-medium mt-[2px] text-[15px] ">
                                        {clientGST}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        Bill Date
                                    </p>
                                    <p className="font-medium mt-[2px] text-[15px] ">
                                        {date.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        Due Date
                                    </p>
                                    <p className="font-medium mt-[2px] text-[15px] ">
                                        {dueDate.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-bold text-[#06283D] text-[12px] mt-[2px] uppercase">
                                        place of supply
                                    </p>
                                    <p className="font-medium mt-[2px] text-[15px] ">
                                        {clientAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* product detail */}
                    <div className="w-full">
                        <div
                            className="uppercase grid w-full mt-4 mx-auto text-white font-bold bg-[#06283D] text-center"
                            style={{
                                gridTemplateColumns: "20% 8% 8% 8% 10% 7% 7% 7% 10% 15%",
                                borderTop: "1px solid black",
                                borderBottom: "1px solid black",
                            }}
                        >
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                Product Name
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                HSN CODE
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                QTN
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                AMT
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                Taxable Amt.
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                CGST
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                SGST
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                IGST
                            </h1>
                            <h1
                                style={{
                                    borderRight: "1px solid white",
                                    width: "100%",
                                    wordBreak: "break-word",
                                }}
                                className="p-2 text-[13px]"
                            >
                                Total tax
                            </h1>
                            <h1 className="p-2 text-[12px]">Total After Tax</h1>
                        </div>
                        {times.map((data, i) => (
                            <div key={i}
                                className="uppercase grid w-full mx-auto text-center"
                                style={{
                                    gridTemplateColumns: "20% 8% 8% 8% 10% 7% 7% 7% 10% 15%",
                                    borderBottom: "1px solid black",
                                }}
                            >
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.descrip}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.hsn}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.qtn}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.amt}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {Number(data.qtn) * Number(data.amt)}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.cgst}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.sgst}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {data.igst}
                                </p>
                                <p
                                    style={{ borderRight: "1px solid black", workBreak: 'break-all' }}
                                    className="p-2 text-[15px]"
                                >
                                    {Number(data.cgst) + Number(data.sgst) + Number(data.igst)}
                                </p>
                                <p className="p-2">
                                    {Number(data.cgst) +
                                        Number(data.sgst) +
                                        Number(data.igst) +
                                        Number(data.qtn) * Number(data.amt)}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* total values */}
                    <div className="grid grid-cols-2">
                        <div className="flex flex-col mr-4 mt-4">
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] mt-[2px] text-[12px] uppercase">
                                    Bank Name
                                </p>
                                <p className="font-bold  text-[15px] mt-[2px] uppercase">
                                    {foundUser[0].bankName}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] mt-[2px] text-[12px] uppercase">
                                    Account Number
                                </p>
                                <p className="font-medium text-[15px]  mt-[2px]">
                                    {foundUser[0].accountNumber}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] mt-[2px] text-[12px] uppercase">
                                    Branch Name
                                </p>
                                <p className="font-medium text-[15px]  mt-[2px]">
                                    {foundUser[0].branchName}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-bold text-[#06283D] mt-[2px] text-[12px] uppercase">
                                    IFSC code
                                </p>
                                <p className="font-medium text-[15px]  mt-[2px] uppercase ml-20">
                                    {foundUser[0].ifscCode}
                                </p>
                            </div>
                        </div>
                        <div
                            className="flex flex-col pr-4 pt-4"
                            style={{
                                borderLeft: "1px solid black",
                                borderBottom: "1px solid black",
                            }}
                        >
                            <div className="grid grid-cols-2">
                                <p
                                    style={{
                                        borderRight: "1px solid black",
                                        borderBottom: "1px solid black",
                                    }}
                                    className="font-bold text-[#06283D] mt-[2px] uppercase text-[13px]"
                                >
                                    Total Taxable Amount
                                </p>
                                <p
                                    className="font-bold mt-[2px] text-center text-[14px]"
                                    style={{ borderBottom: "1px solid black" }}
                                >
                                    {sumTaxable}
                                </p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p
                                    style={{
                                        borderRight: "1px solid black",
                                        borderBottom: "1px solid black",
                                    }}
                                    className="font-bold text-[#06283D] mt-[2px] uppercase text-[13px]"
                                >
                                    Total Tax
                                </p>
                                <p
                                    className="font-medium mt-[2px] text-center text-[14px]"
                                    style={{ borderBottom: "1px solid black" }}
                                >
                                    {sumTax}
                                </p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p
                                    style={{
                                        borderRight: "1px solid black",
                                        borderBottom: "1px solid black",
                                    }}
                                    className="font-bold text-[#06283D] mt-[2px] uppercase text-[13px]"
                                >
                                    Shipping Charges
                                </p>
                                <p
                                    className="font-medium mt-[2px] text-center text-[14px]"
                                    style={{ borderBottom: "1px solid black" }}
                                >
                                    {ship}
                                </p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p
                                    style={{
                                        borderRight: "1px solid black",
                                        borderBottom: "1px solid black",
                                    }}
                                    className="font-bold text-[#06283D] mt-[2px] uppercase text-[13px]"
                                >
                                    Grand Total
                                </p>
                                <p
                                    className="font-medium mt-[2px] text-center text-[14px]"
                                    style={{ borderBottom: "1px solid black" }}
                                >
                                    {sumDue}
                                </p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p
                                    style={{ borderRight: "1px solid black" }}
                                    className="font-bold text-[#06283D] mt-[2px] uppercase text-[13px]"
                                >
                                    Total Amount in Words
                                </p>
                                <p className="font-medium mt-[2px] uppercase ml-10 text-[14px]">
                                    {numWords(sumDue)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* terms and conditions */}
                    <hr
                        style={{
                            marginTop: "10px",
                            height: "2px",
                            border: "none",
                            position: "relative",
                            bottom: "50px",
                            top: "10px",
                            background: "[#06283D]",
                        }}
                    />

                    <div className="grid grid-cols-2 mt-4">
                        {foundRule.map((data, i) => (
                            <div key={i}
                                className="flex flex-col p-2 m-2"
                                style={{ border: "1px solid black" }}
                            >
                                <h1 className="text-[16px] font-medium">Terms & Conditions</h1>
                                <p className="font-medium text-[13px]">1. {data.rule1}</p>
                                <p className="font-medium text-[13px]">2. {data.rule2}</p>
                                <p className="font-medium text-[13px]">3. {data.rule3}</p>
                                <p className="font-medium text-[13px]">4. {data.rule4}</p>
                                <p className="font-medium text-[13px]">5. {data.rule5}</p>
                            </div>
                        ))}
                        <div className="flex flex-col justify-center items-center">
                            <div
                                className="w-[300px] h-[100px]"
                                style={{ borderBottom: "1px solid #06283D" }}
                            ></div>
                            <p className="uppercase font-medium text-[#06283D]">
                                providing signature
                            </p>
                        </div>
                    </div>
                    {/* bill ends */}
                </div>
            </div>
        )
    }
}

export default SalesInvoiceTemplate
