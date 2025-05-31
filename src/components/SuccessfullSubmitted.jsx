import React from 'react'
import { useParams } from 'react-router-dom'

function SuccessfullSubmitted() {
  return (
    <div className='w-full shadow-[0_-8px_0_0_#36045A]  flex justify-center items-center'>
        <div className=' h-[200px] shadow-[0_-8px_0_0_#36045A] font-semibold border-2 border-gray-600 flex justify-center mt-20 p-10 text-3xl rounded-2xl w-[50%]'>
          <h1>Form Submitted Successfully !</h1>
        </div>



    </div>
  )
}

export default SuccessfullSubmitted
