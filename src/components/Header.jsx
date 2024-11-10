import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import Logo from './Logo'
import { Button } from "@/components/ui/button"
import { RainbowButtonDemo } from './ReuseableRainbowButton.jsx'
import { hydratedAuthAtom } from '../store/store.js'


const Header = () => {
    const navigate = useNavigate()
    const [auth] = useAtom(hydratedAuthAtom)
    console.log(auth.isAuthenticated);
    const menus = [
        { title: "Docs", link: "/docs" },
        { title: "Pricing", link: "/pricing" }
    ]
    const handleLogout = () => {
        localStorage.removeItem('auth')
        navigate('/')
        window.location.reload()
    }
    return (
        <header className='flex justify-between items-center py-4 sticky top-0 backdrop-blur-md bg-background/60 z-20'>
            <div className='flex items-center space-x-8'>
                <Logo position={"top"} />
                <div className='hidden items-center space-x-4 md:flex'>
                    {menus.map((menu, index) => (
                        <Link to={menu.link} key={index}>
                            <Button
                                key={index}
                                onClick={() => navigate(menu.title.toLowerCase())} // onclick will take the user to the respective page
                                size="sm"
                                variant={"ghost"}
                                className='text-neutral-400 font-medium rounded-xl'>
                                {menu.title}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
            <div className=''>
                {!auth.isAuthenticated ? (
                    <Link to={"/getting-started/auth"}>
                        <RainbowButtonDemo text={"Get Started"} />
                    </Link>)
                    : (
                        <Button size="sm" className="rounded-xl" onClick={handleLogout}>Log out</Button>
                    )
                }

            </div>
        </header>

    )
}

export default Header