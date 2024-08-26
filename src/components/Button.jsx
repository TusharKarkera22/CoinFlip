import React from 'react'

const Button = ({text}) => {
    return (
        <div  class="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-black border-white border rounded-lg group">
            <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
           
            <span class="relative">{text}</span>
        </div>
    )
}

export default Button