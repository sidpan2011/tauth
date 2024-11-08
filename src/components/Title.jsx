import React from 'react'

const Title = ({ title, extraClassName }) => {
    return (
        <h1 className={`pointer-events-none whitespace-pre-wrap bg-gradient-to-br bg-clip-text  lg:text-8xl md:text-7xl text-left  leading-none text-transparent from-black to-gray-500/80 dark:from-white dark:to-gray-300/80 py-2 font-medium tracking-tighter text-balance text-6xl translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]  ${extraClassName}`}>
            {title}
        </h1>
    )
}
export default Title