import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Pricing = () => {
    return (
        <div className=''>
            <div className='xl:px-44 lg:px-20 md:px-14 px-6'>
                <Header />
                <main className='h-screen'>
                    <h1 className='text-white'>Pricing</h1>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Pricing