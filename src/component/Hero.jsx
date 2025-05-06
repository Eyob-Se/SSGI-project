import React from 'react'

const Hero = () => {
  return (
    <section>
        <div className='container mx-auto flex flex-col items-end justify-center h-screen'>
            <h1 className='text-5xl font-bold text-center mb-4'>Welcome to Our Website</h1>
            <p className='text-lg text-center mb-8'>We are glad to have you here. Explore our services and offerings.</p>
            <button className='bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300'>Get Started</button>
        </div>
    </section>
  )
}

export default Hero