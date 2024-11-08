import React from 'react'
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

import Logo from './Logo'
import { Button } from './ui/button'

const Footer = () => {
    return (
        <footer className='mt-auto flex flex-col bg-white dark:bg-black w-full overflow-hidden xl:px-44 lg:px-20 md:px-14 px-4'>
            {/* <Separator /> */}
            <div className='py-5 flex justify-between items-center'>
                <div className=' flex flex-col'>
                    <Logo position={"bottom"} />
                    {/* <h2 className='text-black dark:text-white mt-2 text-sm opacity-30'>Secure. Private. Decentralized.</h2> */}
                </div>
                <div className='flex flex-row space-x-3'>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <Button variant="link" size="icon" className="opacity-30 hover:opacity-100 transition-all">
                            <FaGithub size={24} />
                        </Button>
                    </a>
                    <a href="">
                        <Button variant="link" size="icon" className=" opacity-30 hover:opacity-100 transition-all">
                            <FaXTwitter  size={24} />
                        </Button>
                    </a>
                    <a href="">
                        <Button variant="link" size="icon" className=" opacity-30 hover:opacity-100 transition-all">
                            <FaDiscord size={24} />
                        </Button>
                    </a>
                </div>
            </div>

            <div className='lg:mx-72 sm:mx-10 mt-6 justify-center items-center flex'>
            </div>
            <p className='text-sm text-black pb-12 text-center dark:text-white opacity-30'>
                © {new Date().getFullYear()} TAuth. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer