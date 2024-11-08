import React from 'react'
import MagicalText from './MagicalText'
import { BentoDemo } from './BentoCard'
import { RainbowButtonDemo } from './ReuseableRainbowButton'
import { Button } from './ui/button'
import { AnimatedShinyTextDemo } from './ReuseableShinyText'
import { ArrowRightIcon } from 'lucide-react'
import { AccordionDemo } from './Accordion'
import Title from './Title'
import { useNavigate } from 'react-router-dom'


const Hero = () => {
    const navigate = useNavigate()
    return (
        <main className='my-10'>
            <div className=' flex flex-col lg:items-center lg:justify-center md:justify-center md:items-center my-8 xl:h-[80vh] '>
                <AnimatedShinyTextDemo text={"🚀 Next-Gen Authentication"} />
                <h1 className={`pointer-events-none whitespace-pre-wrap bg-gradient-to-br md:text-center bg-clip-text  lg:text-8xl md:text-7xl text-left  leading-none text-transparent from-black to-gray-500/80 dark:from-white dark:to-gray-300/80 py-2 font-medium tracking-tight text-balance text-6xl translate-y-[-1rem] animate-fade-in [--animation-delay:200ms] `}>
                    Your <MagicalText text={"Typing Pattern"} /> is, Your New Password.
                </h1>
                <p className='text-neutral-400 lg:text-xl text-md md:text-center xl:px-20 px-0'>Secure authentication that recognizes your unique typing rhythm - because your keystroke pattern is as distinctive as your fingerprint, but impossible to steal.</p>
                <div className='my-8 flex items-center space-x-5'>
                    <RainbowButtonDemo text={"Start Building Now"} className={"h-11"} />
                    <Button className="rounded-xl group text-white font-medium" variant="outline" size="lg" onClick={() => navigate("/docs")}>Read the Docs <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /></Button>
                </div>
            </div>
            <div className='py-8'>
                <AnimatedShinyTextDemo text={"🔥 Type Once, Authenticate Anywhere"} />
                <h1 className={`pointer-events-none whitespace-pre-wrap bg-gradient-to-br md:text-center bg-clip-text  lg:text-8xl md:text-7xl text-left  leading-none text-transparent from-black to-gray-500/80 dark:from-white dark:to-gray-300/80 py-2 font-medium tracking-tight text-balance text-6xl translate-y-[-1rem] animate-fade-in [--animation-delay:200ms] `}>
                    Powerful features for seamless integration.
                </h1>
                <p className='text-neutral-400 lg:text-xl text-md md:text-center xl:px-20 px-0'>Experience a new level of security that adapts to your unique typing rhythm. Our intelligent system learns and evolves with every keystroke.</p>
            </div>
            <BentoDemo />
            <div className='py-28'>
                <Title title={"Frequently Asked Questions"} extraClassName={"text-start lg:text-center"} />
                <AccordionDemo  />
            </div>
        </main>
    )
}

export default Hero