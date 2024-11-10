
import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Footer from './Footer'


const Homepage = () => {
    return (
        <div>
            <div className='xl:px-44 lg:px-20 md:px-14 px-6'>
                <Header />
                <Hero />
            </div>
            <Footer />
        </div>
    )
}
export default Homepage