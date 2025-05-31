import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import imagelogo from "../assets/image/logo.png"
import { setThemeToggle } from '../slices/themeToggleSlice';
import "@theme-toggles/react/css/Classic.css"
import { Classic } from "@theme-toggles/react"
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
function Header() {
    const { theme } = useSelector((state) => state.themeToggle);
    const dispatch=useDispatch()
    return (
        <div className='w-full mt-4'>

            <div className={`mx-auto w-[90%] rounded-2xl ${theme === "light" ? " bg-[#1D1C20] text-white" : " bg-white text-black"}  sticky top-4 flex justify-between items-center h-20 p-10 `}>
                <Link to={"/"}>
                    <div className='flex  justify-evenly items-center '>
                        <img src={imagelogo} className='h-16 w-16 ' alt="" /><p className='text-2xl font-semibold'>Hypergro Form</p>

                    </div>
                </Link>
                <div className='w-[30%] flex justify-evenly items-center p-2 gap-6  '>



                    <button
                        className={`p-2 text-4xl   rounded ${theme === "light" ? "bg-transparent text-white" : "bg-transparent text-[#1D1C20]"}  `}
                        onClick={() => dispatch(setThemeToggle())}
                    >
                        {theme === 'light' ? <Classic className='  text-4xl' duration={750} />
                            : <Classic className='text-4xl' duration={750} reversed />
                        }
                    </button>
                </div>

            </div>


        </div>
    )
}

export default Header
