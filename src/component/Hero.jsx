import React from 'react'

const Hero = () => {
  return (
    <section className='float-right mr-65 mt-50'>
        <div className=' flex flex-col items-center justify-center space-y-2'>
            <h1 className='text-[30px]'>Available Data</h1>
            <div className='text-lg flex flex-col items-center justify-center'>
                <h2 className='text-[20px]'>0 Order(Fundamental Geodetic Station)</h2>
                <p className='rounded-[1rem] bg-blue-900 px-10 py-10 text-white'>Total points</p>
            </div>
            <div className='text-lg flex flex-col items-center justify-center'>
                <h2 className='text-[20px]'>1 Order(high-accuracy points)</h2>
                <p className='rounded-[1rem] bg-blue-900 px-10 py-10 text-white'>Total points</p>
            </div>
        </div>
    </section>
  )
}

export default Hero