import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdOutlineGroup } from "react-icons/md";

function FormCard() {
    const [AllFormData, setAllFormData] = useState([])
    const navigate = useNavigate()
    const { theme } = useSelector((state) => state.themeToggle);
    useEffect(() => {
        const StoredForm = localStorage.getItem("Allforms");
        const CreatedForm = StoredForm ? JSON.parse(StoredForm) : []
        setAllFormData(CreatedForm);

    }, [])
    console.log("AllFormData is", AllFormData)
    return (
        <div className={`w-full  flex flex-col flex-wrap justify-evenly gap-2 items-center `}>
            <p className='text-3xl font-semibold'>Your recent Form</p>
            <div className={`w-[80%] mt-4 p-2 flex flex-wrap justify-start gap-10 items-center ${theme === 'light' ? "text-white" : "text-white"}`}>
                {
                    AllFormData.length > 0 ? AllFormData.map((form, index) => (
                        <button className='h-[400px] bg-[#2C2D32] rounded-xl border-[1px] w-[350px]' onClick={() => navigate(`/forms/${form._id}/edit`)}>
                            <div key={index} className='flex flex-col rounded-xl justify-start  w-full h-full items-center'>
                                <img className=' w-full h-[60%] mt-0  rounded-tl-xl rounded-tr-3xl  object-cover' src={form?.image} alt="" />
                                <div className='w-full mt-2 p-4 border-t-[1px]'>

                                    <p className='w-full text-2xl p-2 font-semibold flex justify-start items-center'>{form?.title}</p>
                                    <div className='flex justify-start items-center p-2 gap-1 text-md'>
                                        <MdOutlineGroup className='text-2xl' />

                                        <p className='w-full flex justify-start  items-center'>Created: {new Date(form?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    
                                </div>

                            </div>
                        </button>

                    )) : <div className='w-full  text-xl justify-center items-center'><p>You Have Not created Any form</p> </div>
                }
            </div>

        </div>
    )
}

export default FormCard
