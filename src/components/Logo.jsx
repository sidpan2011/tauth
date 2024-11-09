import React from 'react'
import logoDark from '../assets/logos/logo.png'
import { Link } from 'react-router-dom'

const Logo = ({ position, optionalSize }) => {
    return (
        <div className='w-auto'>
            {position === "top"
                ?
                <Link to={'/'}>
                    <div className='text-black flex items-center text-3xl dark:text-white font-medium tracking-tighter'>
                        <img src={logoDark} alt="TAuth Logo" className={`h-10 select-none ${optionalSize}`} />
                    </div>
                </Link>
                :
                <div className='text-black flex items-center text-3xl dark:text-white font-medium tracking-tighter'>
                    <img src={logoDark} alt="TAuth Logo" className={`h-10 select-none ${optionalSize}`} />
                </div>
            }
        </div>
    )
}

export default Logo