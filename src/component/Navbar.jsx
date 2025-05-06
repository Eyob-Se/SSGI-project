import React from 'react'
import ssgi from '../assets/images/ssgi.png'

const Navbar = () => {
  return (
    <>
    <nav>
        <div className='container mx-auto flex justify-between items-center py-4 ' >
           <img className='h-15 w-auto' src={ssgi} alt="" srcset="" />
            <ul className='flex space-x-10 bg-blue-900 py-2 px-20 rounded-full' >
            <li><a href="#" className='text-white hover:text-orange-500'>Home</a></li>
            <li><a href="#" className='text-white hover:text-orange-500'>About</a></li>
            <li><a href="#" className='text-white hover:text-orange-500'>Services</a></li>
            <li><a href="#" className='text-white hover:text-orange-500'>Contact</a></li>
            </ul>
        </div>
    </nav>
    </>
  )
}

export default Navbar