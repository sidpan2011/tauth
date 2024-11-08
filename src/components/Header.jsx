import React from 'react'
import Logo from './Logo'
import { Button } from './ui/button'
import { RainbowButtonDemo } from './ReuseableRainbowButton'
import { Link, useNavigate } from 'react-router-dom'


const Header = () => {
    const navigate = useNavigate()
    const menus = [
        { title: "Docs", link: "/docs" },
        { title: "Pricing", link: "/pricing" }
    ]
    return (
        <header className='flex justify-between items-center py-4 sticky top-0 backdrop-blur-md bg-background/60 z-20'>
            <div className='flex items-center space-x-8'>
                <Logo position={"top"} />
                <div className='hidden items-center space-x-4 md:flex'>
                    {menus.map((menu, index) => (
                        <Link to={menu.link} key={index}>
                            <Button
                                key={index}
                                onClick={() => navigate(menu.toLowerCase())} // onclick will take the user to the respective page
                                size="sm"
                                variant={"ghost"}
                                className='text-neutral-400 font-medium tracking-tighter rounded-xl'>
                                {menu.title}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
            <div className=''>
                <RainbowButtonDemo text={"Get Started"} />
            </div>
        </header>

    )
}

export default Header