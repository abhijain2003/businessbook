import React, { useState, useEffect } from 'react';
import BarChart from './Chart';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



function GrowthData() {

    const route = useParams();
    const location = useLocation();
    const Fdata = location.state.final;
    const Sdata = location.state.sale;
    const Pdata = location.state.purchase;

    const [SalesData, setSalesData] = useState([]);
    const [PurchaseData, setPurchaseData] = useState([]);
    const [Ydata, setYdata] = useState([]);
    const [labels, setlabels] = useState([]);


    // for filtering fixed/period wise
    const [filterTime, setfilterTime] = useState("");
    const [yearVal, setyearVal] = useState("");
    const [monVal, setmonVal] = useState("");
    const [filterType, setfilterType] = useState("");
    const [periodType, setperiodType] = useState("");
    const [fromVal, setfromVal] = useState("");
    const [toVal, settoVal] = useState("");
    const [xAxisScale, setxAxisScale] = useState("");
    const [yAxisScale, setyAxisScale] = useState("");
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const years = useMemo(() => {
        return [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]
    }, []);
    const [totalTradeVal, settotalTradeVal] = useState(0);
    const [totalTaxPaid, settotalTaxPaid] = useState(0);

    useEffect(() => {
        let finalData = Fdata.filter((val) => {
            if (val.user === route.user) {
                return val
            }
        });
        let data = [];
        finalData.filter((val) => {
            if (val.netLoss !== 0) {
                data.push(val.netLoss * (-1))
            } else {
                data.push(val.netProfit)
            }
        })

        setYdata(data);
        setlabels(years)

        setSalesData(Sdata.filter((val) => {
            if (val.user === route.user) {
                return val
            }
        }));

        setPurchaseData(Pdata.filter((val) => {
            if (val.user === route.user) {
                return val
            }
        }));
    }, [Sdata, Pdata, Fdata, route.user, years]);

    function handleTimeFilter() {
        if (fromVal === "" || toVal === "") {
            setmessage("All Options should be selected.")
        } else {
            setmessage("");

            if (filterType === 'p' && filterTime === 't' && periodType === 'm') {
                let filterData = PurchaseData.filter((val) => {
                    return new Date(val.billDate).getMonth() >= months.indexOf(fromVal) &&
                        new Date(val.billDate).getMonth() <= months.indexOf(toVal)
                })

                let filteredMonth = months.slice(months.indexOf(fromVal), months.indexOf(toVal) + 1);
                if (filterData.length !== 0) {
                    let data = [];
                    let pur = 0;
                    let tax = 0;

                    filteredMonth.map((mon) => {
                        let monWiseData = filterData.filter((item) => {
                            return months.indexOf(mon) === new Date(item.billDate).getMonth();
                        })

                        if (monWiseData.length === 0) {
                            data.push(0)
                        } else {
                            let billPur = 0
                            let billTax = 0;
                            monWiseData.map((val) => {
                                billPur += (val.TaxAmt);
                                billTax += (val.CGST + val.IGST + val.SGST);
                            })
                            data.push(billPur + billTax)
                            pur += billPur;
                            tax += billTax;
                        }
                    })
                    setlabels(filteredMonth);
                    setYdata(data);
                    settotalTradeVal(pur);
                    settotalTaxPaid(tax);
                    setxAxisScale("Months");
                    setyAxisScale("Amount");

                } else {
                    setlabels([]);
                    setYdata([]);
                }

            } else if (filterType === 's' && filterTime === 't' && periodType === 'm') {
                let filterData = SalesData.filter((val) => {
                    return new Date(val.billDate).getMonth() >= months.indexOf(fromVal) &&
                        new Date(val.billDate).getMonth() <= months.indexOf(toVal)
                })

                let filteredMonth = months.slice(months.indexOf(fromVal), months.indexOf(toVal) + 1);
                if (filterData.length !== 0) {
                    let data = [];
                    let sale = 0;
                    let tax = 0;
                    filteredMonth.map((mon) => {
                        let monWiseData = filterData.filter((val) => {
                            return months.indexOf(mon) === new Date(val.billDate).getMonth();
                        })


                        if (monWiseData === 0) {
                            data.push(0);
                        } else {
                            let product = [];
                            let billsale = 0;
                            let billtax = 0;
                            monWiseData.map((val) => {
                                product.push(...val.product);
                            });

                            product.map((item) => {
                                billsale += (Number(item.amt) * Number(item.qtn));
                                billtax += (Number(item.cgst) + Number(item.igst) + Number(item.sgst))
                            })
                            data.push(billsale + billtax)
                            sale += billsale
                            tax += billtax
                        }
                    })
                    setlabels(filteredMonth);
                    setYdata(data);
                    settotalTradeVal(sale);
                    settotalTaxPaid(tax);
                    setxAxisScale("Months");
                    setyAxisScale("Amount")

                } else {
                    setlabels([]);
                    setYdata([]);
                }

            } else if (filterType === 'p' && filterTime === 't' && periodType === 'y') {
                let filterData = PurchaseData.filter((val) => {
                    return new Date(val.billDate).getFullYear() >= fromVal &&
                        new Date(val.billDate).getFullYear() <= toVal
                })

                let filteredYears = years.slice(years.indexOf(Number(fromVal)), years.indexOf(Number(toVal)) + 1);

                if (filterData.length !== 0) {
                    let data = [];
                    let pur = 0;
                    let tax = 0;

                    filteredYears.map((yer) => {
                        let yearWiseData = filterData.filter((item) => {
                            return yer === new Date(item.billDate).getFullYear();
                        })

                        if (yearWiseData.length === 0) {
                            data.push(0)
                        } else {
                            let billPur = 0
                            let billTax = 0;
                            yearWiseData.map((val) => {
                                billPur += (val.TaxAmt);
                                billTax += (val.CGST + val.IGST + val.SGST);
                            })
                            data.push(billPur + billTax)
                            pur += billPur;
                            tax += billTax;
                        }
                    })
                    setlabels(filteredYears);
                    setYdata(data);
                    settotalTradeVal(pur);
                    settotalTaxPaid(tax);
                    setxAxisScale("years");
                    setyAxisScale("Amount");

                } else {
                    setlabels([]);
                    setYdata([]);
                }

            } else if (filterType === 's' && filterTime === 't' && periodType === 'y') {
                let filterData = SalesData.filter((val) => {
                    return new Date(val.billDate).getFullYear() >= fromVal &&
                        new Date(val.billDate).getFullYear() <= toVal
                })

                let filteredYears = years.slice(years.indexOf(Number(fromVal)), years.indexOf(Number(toVal)) + 1);

                if (filterData.length !== 0) {
                    let data = [];
                    let sale = 0;
                    let tax = 0;
                    filteredYears.map((yer) => {
                        let yearWiseData = filterData.filter((val) => {
                            return yer === new Date(val.billDate).getFullYear();
                        })


                        if (yearWiseData === 0) {
                            data.push(0);
                        } else {
                            let product = [];
                            let billsale = 0;
                            let billtax = 0;
                            yearWiseData.map((val) => {
                                product.push(...val.product);
                            });

                            product.map((item) => {
                                billsale += (Number(item.amt) * Number(item.qtn));
                                billtax += (Number(item.cgst) + Number(item.igst) + Number(item.sgst))
                            })
                            data.push(billsale + billtax)
                            sale += billsale
                            tax += billtax
                        }
                    })
                    setlabels(filteredYears);
                    setYdata(data);
                    settotalTradeVal(sale);
                    settotalTaxPaid(tax);
                    setxAxisScale("Years");
                    setyAxisScale("Amount")

                } else {
                    setlabels([]);
                    setYdata([]);
                }
            }
        }
    }

    const [message, setmessage] = useState("");

    function handleFilter() {
        let day = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        if (filterType === 'p' && filterTime === 'f') {
            let filterData = PurchaseData.filter((val) => {
                return new Date(val.billDate).getMonth() === months.indexOf(monVal) &&
                    new Date(val.billDate).getFullYear() === Number(yearVal)
            })

            console.log(filterData);
            if (filterData.length !== 0) {
                let data = [];
                let pur = 0;
                let tax = 0;

                day.map((val) => {
                    let dayWiseData = filterData.filter((item) => {
                        return val === new Date(item.billDate).getDay();
                    })


                    if (dayWiseData.length === 0) {
                        data.push(0)
                    } else {
                        let billPur = 0;
                        let billTax = 0;

                        dayWiseData.map((obj) => {
                            billPur += (obj.TaxAmt);
                            billTax += (obj.CGST + obj.IGST + obj.SGST);
                        });

                        pur += billPur;
                        tax += billTax;
                        data.push(billPur + billTax);
                    }
                })
                setlabels(day);
                setYdata(data);
                settotalTradeVal(pur);
                settotalTaxPaid(tax);
                setxAxisScale("days");
                setyAxisScale("Amount")
            } else {
                setlabels([]);
                setYdata([]);
            }
        } else if (filterType === 's' && filterTime === 'f') {
            let filterData = SalesData.filter((val) => {
                return new Date(val.billDate).getMonth() === months.indexOf(monVal) &&
                    new Date(val.billDate).getFullYear() === Number(yearVal)
            });

            if (filterData.length !== 0) {
                let data = [];
                let sale = 0;
                let tax = 0;

                day.map((val) => {
                    let dayWiseData = filterData.filter((item) => {
                        return val === new Date(item.billDate).getDay();
                    });

                    if (dayWiseData.length === 0) {
                        data.push(0);
                    } else {
                        let product = [];
                        let billSale = 0;
                        let billTax = 0;
                        dayWiseData.map((obj) => {
                            product.push(...obj.product);
                        });

                        product.map((val) => {
                            billSale += (Number(val.amt) * Number(val.qtn));
                            billTax += (Number(val.cgst) + Number(val.sgst) + Number(val.igst));
                        });
                        sale += billSale;
                        tax += billTax;
                        data.push(billSale + billTax);

                    }
                })
                setlabels(day);
                setYdata(data);
                settotalTradeVal(sale);
                settotalTaxPaid(tax);
                setxAxisScale("days");
                setyAxisScale("Amount")
            } else {
                setlabels([]);
                setYdata([]);
            }
        }
    }


    const data = {
        labels,
        datasets: [
            {
                label: (filterType === 's' || filterType === 'p') && filterTime === 'f' && Ydata.length !== 0 ? monVal :
                    (filterType === 's' || filterType === 'p') && filterTime === 't' && Ydata.length !== 0 ? fromVal + "-" + toVal : 'Profit Data',
                data: Ydata,
                backgroundColor: filterType !== 's' || filterType !== 'p' ? Ydata.map((val) => {
                    if (val < 0) {
                        return 'red'
                    } else {
                        return 'green'
                    }
                }) : 'rgba(105, 99, 132, 0.5)',
            }
        ]
    };


    return (
        <div className='flex justify-center w-full items-center h-[100vh] bg-[#D3CEDF]'>
            <div className='w-full h-[95%] m-auto bg-white sm:grid sm:grid-cols-[20%_80%]'>
                <div className='w-full h-full border-2 border-black h-[95vh] overflow-y-auto scroll'>
                    <h1 className='text-[20px] font-medium text-center'>Filters</h1>
                    <div>
                        <h2 className='my-4 font-bold ml-2' >Data Type</h2>
                        <div className='flex justify-between mx-auto w-[70%] font-medium mt-4'>
                            <input type={'radio'} name='type' value='s' onChange={(e) => setfilterType(e.target.value)} />
                            <p>Sales</p>
                        </div>
                        <div className='flex justify-between mx-auto w-[70%] mt-2 font-medium'>
                            <input type={'radio'} name='type' value='p' onChange={(e) => setfilterType(e.target.value)} />
                            <p>Purchase</p>
                        </div>
                    </div>
                    <div>
                        <h2 className='my-4 font-bold ml-2' >FIlter Type</h2>
                        <div className='flex justify-between mx-auto w-[70%] font-medium mt-4'>
                            <input type={'radio'} name='check' value='f' onChange={(e) => setfilterTime(e.target.value)} />
                            <p>Fixed Month/Year</p>
                        </div>
                        <div className='flex justify-between mx-auto w-[70%] mt-2 font-medium'>
                            <input type={'radio'} name='check' value='t' onChange={(e) => setfilterTime(e.target.value)} />
                            <p>Time Period</p>
                        </div>
                    </div>
                    {
                        filterType !== "" && filterTime === 'f' ? (
                            <div className='w-full flex flex-col mt-8'>
                                <div className='w-full flex flex-col' >
                                    <label className='w-[70%] mx-auto font-medium mt-2'>Select the Year</label>
                                    <select onChange={(e) => setyearVal(e.target.value)} className="bg-slate-200 w-[70%] mx-auto p-2 rounded-[8px]">
                                        <option value="">Year</option>
                                        {years.map((yer, i) => (
                                            <option key={i} value={yer}>{yer}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-full flex flex-col mt-2' >
                                    <label className='w-[70%] mx-auto font-medium mt-2'>Select the Month</label>
                                    <select onChange={(e) => setmonVal(e.target.value)} className="bg-slate-200 w-[70%] mx-auto p-2 rounded-[8px]">
                                        <option value="">Months</option>
                                        {months.map((mon, i) => (
                                            <option key={i} value={mon}>{mon}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className='text-[12px] mt-2 text-center text-red-500' >{message}</p>
                                <button onClick={handleFilter} className="bg-green-400 hover:bg-green-200 mt-2 font-medium w-[70%] mx-auto p-2 rounded-[8px]">Apply</button>
                            </div>
                        ) : filterType !== '' && filterTime === 't' ? (
                            <div>
                                <h2 className='my-4 font-bold ml-2' >Period Type</h2>
                                <div className='flex justify-between mx-auto w-[70%] font-medium mt-4'>
                                    <input type={'radio'} name='periodcheck' value='m' onChange={(e) => setperiodType(e.target.value)} />
                                    <p>Monthy</p>
                                </div>
                                <div className='flex justify-between mx-auto w-[70%] mt-2 font-medium'>
                                    <input type={'radio'} name='periodcheck' value='y' onChange={(e) => setperiodType(e.target.value)} />
                                    <p>Yearly</p>
                                </div>
                            </div>
                        ) : null
                    }
                    {
                        filterType !== '' && filterTime === 't' && periodType === 'm' ? (
                            <div className='w-full flex flex-col my-8'>
                                <div className='w-full flex flex-col' >
                                    <label className='w-[70%] mx-auto font-medium mt-2'>From</label>
                                    <select onChange={(e) => setfromVal(e.target.value)} className="bg-slate-200 w-[70%] mx-auto p-2 rounded-[8px]">
                                        <option value="">Months</option>
                                        {months.map((mon, i) => (
                                            <option key={i} value={mon}>{mon}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-full flex flex-col mt-2' >
                                    <label className='w-[70%] mx-auto font-medium mt-2'>To</label>
                                    <select onChange={(e) => settoVal(e.target.value)} className="bg-slate-200 w-[70%] mx-auto p-2 rounded-[8px]">
                                        <option value="">Months</option>
                                        {months.map((mon, i) => (
                                            <option key={i} value={mon}>{mon}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className='text-[12px] mt-2 text-center text-red-500' >{message}</p>
                                <button onClick={handleTimeFilter} className="bg-green-400 hover:bg-green-200 mt-2 font-medium w-[70%] mx-auto p-2 rounded-[8px]">Apply</button>
                            </div>
                        ) : filterType !== '' && filterTime === 't' && periodType === 'y' ? (
                            <div className='w-full flex flex-col my-8'>
                                <div className='w-full flex flex-col' >
                                    <label className='w-[70%] mx-auto font-medium mt-2'>From</label>
                                    <select onChange={(e) => setfromVal(e.target.value)} className="bg-slate-200 w-[70%] mx-auto p-2 rounded-[8px]">
                                        <option value="">Years</option>
                                        {years.map((yer, i) => (
                                            <option key={i} value={yer}>{yer}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-full flex flex-col mt-2' >
                                    <label className='w-[70%] mx-auto font-medium mt-2'>To</label>
                                    <select onChange={(e) => settoVal(e.target.value)} className="bg-slate-200 w-[70%] mx-auto p-2 rounded-[8px]">
                                        <option value="">Years</option>
                                        {years.map((yer, i) => (
                                            <option key={i} value={yer}>{yer}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className='text-[12px] mt-2 text-center text-red-500' >{message}</p>
                                <button onClick={handleTimeFilter} className="bg-green-400 hover:bg-green-200 mt-2 font-medium w-[70%] mx-auto p-2 rounded-[8px]">Apply</button>
                            </div>
                        ) : null
                    }
                </div>
                <div className='flex flex-col xl:grid xl:grid-cols-[80%_20%]' >
                    <div>
                        <p className='relative left-[-180px]  md:left-[-300px] xl:left-[-400px] xl:bottom-[100px] rotate-[-90deg]' >{yAxisScale}</p>
                        <BarChart data={data} />
                        <p className='text-center' >{xAxisScale}</p>
                    </div>
                    {
                        filterType === 'p' && filterTime === 'f' && Ydata.length !== 0 ? (
                            <div className='flex flex-col w-full justify-center items-center m-auto'>
                                <p>Total Value Purchased <span className='font-bold'>{totalTradeVal}</span></p>
                                <p>Total Tax Paid <span className='font-bold'>{totalTaxPaid}</span></p>
                            </div>
                        ) : filterType === 's' && filterTime === 'f' && Ydata.length !== 0 ? (
                            <div className='flex flex-col w-full justify-center items-center m-auto'>
                                <p>Total Value Sold <span className='font-bold'>{totalTradeVal}</span></p>
                                <p>Total Tax Recieve<span className='font-bold'>{totalTaxPaid}</span></p>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}

export default GrowthData;

