import React from 'react';
import Carousel from 'react-elastic-carousel';
import bill from "../assets/bill.png";
import pointOfSale from "../assets/point-of-sale.png";
import receipt from "../assets/receipt.png";
import bag from "../assets/bag.png";
import entry from "../assets/entry.png";
import lawBook from "../assets/law-book.png";
import balanceSheet from "../assets/balance-sheet.png";
import growth from "../assets/growth.png";
import warehouse from "../assets/warehouse.png";
import information from "../assets/information.png";
import sales from "../assets/sales.png";
import pur from "../assets/pur.png";
import ledger from "../assets/ledger.png";
import trail from "../assets/trail.png";
import growthData from "../assets/growthData.png";
import client from "../assets/client.png";
import inventory from "../assets/inventory.png";
import receiptui from "../assets/receiptui.png";

function Product() {

    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 4 },
        { width: 768, itemsToShow: 6 },
        { width: 1200, itemsToShow: 5 }
    ]

    const _items = [
        {
            player: {
                title: 'Generate Sales Bill',
                image: bill,
            },
        },
        {
            player: {
                title: "Manage All Purchases",
                image: pointOfSale,
            },
        },
        {
            player: {
                title: 'Print Receipts Quickly',
                image: receipt,
            },
        },
        {
            player: {
                title: 'Manage all taxes',
                image: bag,
            },
        },
        {
            player: {
                title: 'Post Ledger Entry',
                image:  entry,
            },
        },
        {
            player: {
                title: 'Auto-generated Trial balance',
                image: lawBook,
            },
        },
        {
            player: {
                title: "Check your Balance Sheet",
                image: balanceSheet,
            },
        },
        {
            player: {
                title: 'Measure Growth with Visual Charts',
                image: growth,
            },
        },
        {
            player: {
                title: 'Manage your Inventory',
                image: warehouse,
            },
        },
        {
            player: {
                title: 'Analyse Your Clients',
                image: information,
            },
        },
    ];



    return (
        <div id="Product" className='mt-24 w-full overflow-hidden'>
            <h1 className='text-4xl pl-24'>Products</h1>
            <div className='flex sm:w-[90%] mx-auto my-4 items-center'>
                <Carousel breakPoints={breakPoints}>
                    {
                        _items.map((val, index) => (
                            <div key={index} className="w-[90%] h-[80%]">
                                <img src={val.player.image} className='mx-auto text-center' style={{ width: '100px', height: '100px', marginTop: '20px' }} />
                                <h3>{val.player.title}</h3>
                            </div>
                        ))
                    }
                </Carousel>
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] h-[300px] mx-auto items-center mt-24'>
                <img src={sales} className=' w-[100%] h-[50%] sm:h-[100%]' />
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Generate Sales Invoice for your Business</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        generate sales invoice for your business within a minute. print it download it.
                        record it. customize it.
                    </p>
                </div>
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] h-[300px] mx-auto items-center mt-24'>
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Manage all Purchases for your Business</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        manage all purchase accounts for your business within a minute. print it download it.
                        record it. customize it.
                    </p>
                </div>
                <img src={pur} className=' w-[100%] h-[50%] sm:h-[100%]' />
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] mx-auto items-center mt-24 h-[300px]'>
                <img src={receiptui} className=' w-[100%] h-[50%] sm:h-[100%]' />
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Print Receipt for your client within a minute.</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        print receipt for your client within a minute. print it download it.
                        record it. customize it.
                    </p>
                </div>
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] mx-auto items-center mt-24 h-[300px]'>
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Create ledger Entries quickly</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        we made easy for you to create ledger entries. with a basic knowledge of accounting
                        and cool features you can easily create ledger entries quickly.
                    </p>
                </div>
                <img src={ledger} className=' w-[100%] h-[50%] sm:h-[100%]' />
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] mx-auto items-center mt-24 h-[300px]'>
                <img src={trail} className=' w-[100%] h-[50%] sm:h-[100%]' />
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Auto Generated Trial Balance</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        With auto generated feature your company trial balance will be generated as per your entries.
                        you can print it download it and use multiple filter options to see trial balance of different years.
                    </p>
                </div>
            </div>
            <div className='h-[300px] sm:grid sm:grid-cols-2 w-[80%] mx-auto items-center mt-24'>
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Check your business growht with visual Charts.</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        we made easy for you to measure your business growth with bar charts and multiple filter
                        options.
                    </p>
                </div>
                <img src={growthData} className=' w-[100%] h-[50%] sm:h-[100%]' />
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] mx-auto items-center mt-24 h-[300px]'>
                <img src={client} className=' w-[100%] h-[50%] sm:h-[100%]' />
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Analyse your Cleint Past Records.</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        We Provide you functions to analyse your cleints past records for you take meaningfull decisions
                        for your firm
                    </p>
                </div>
            </div>
            <div className='sm:grid sm:grid-cols-2 w-[80%] h-[300px] mx-auto items-center mt-24'>
                <div className='items-center text-center'>
                    <h1 className='my-4 font-bold text-[20px]'>Manage all Inventory</h1>
                    <p className='sm:w-[60%] mx-auto'>
                        we made easy for you to manage inventory of your business add new product on purchase,
                        add return list on every sales/purchase returns. measure sales, purchase and return records.
                    </p>
                </div>
                <img src={inventory} className=' w-[100%] h-[50%] sm:h-[100%]' />
            </div>
        </div>
    )
}



export default Product






