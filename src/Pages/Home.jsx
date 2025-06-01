import { useDispatch, useSelector } from 'react-redux'
import { setThemeToggle } from '../slices/themeToggleSlice';
import imagelogo from "../assets/image/logo.png"
import HomeImage from '../components/HomeImage';
import Footer from '../components/Common/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setformData } from '../slices/FormDataSlice';
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import FormCard from '../components/FormCard';
function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { theme } = useSelector((state) => state.themeToggle);

    const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
    const createFormHandler = async () => {
        try {
            console.log("call to aaya hai");
            const res = await axios.post(
                BASE_URL + '/forms/createform',
                {},
                { withCredentials: true }
            );

            const formData = res.data.data;
            dispatch(setformData(formData));
            localStorage.setItem("formData", JSON.stringify(formData));


            const existingForm = JSON.parse(localStorage.getItem("Allforms")) || [];
            existingForm.push(formData);

            localStorage.setItem("Allforms", JSON.stringify(existingForm));


            const formId = formData._id;
            console.log("Result is", formData);

            navigate(`/forms/${formId}/edit`);
        } catch (error) {
            console.error("Error creating form:", error);
            alert("Something went wrong while creating the form.");
        }
    };






    return (
        <div className={`mx-auto w-full flex flex-col justify-between gap-20 items-center   ${theme === "light" ? "bg-black text-white" : "bg-[#F0EBF8] text-black"} `}>

            <div className={`mx-auto w-[90%] rounded-2xl ${theme === "light" ? " bg-[#1D1C20] text-white" : " bg-[#FFFFFF] text-black"}  sticky top-4 flex justify-between items-center h-20 p-10 `}>
                <div className='flex  justify-evenly items-center '>
                    <img src={imagelogo} className='h-16 w-16 ' alt="" /><p className='text-2xl font-semibold'>Hypergro Form</p>
                </div>


                <button
                    className={`p-2 text-4xl   rounded ${theme === "light" ? "bg-transparent text-white" : "bg-transparent text-[#1D1C20]"}  `}
                    onClick={() => dispatch(setThemeToggle())}
                >
                        {theme === 'light'? <MdDarkMode />
                          : <MdLightMode />
                         }

                </button>
            </div>

            <div className='w-[80%] mediaQuerieapply flex border-[1px] border-gray-500 p-6 rounded-xl bg-[#FFFFFF] text-black'>
                <div className='flex flex-col ml-8'>
                    <p className='text-6xl font-semibold '>Collect Data <br />Smarter, with <br /> Hypergro Form</p>
                    <p className='text-xl mt-6 '>Design and share custom forms and surveys in minutes. <br />Instantly track responses, gain insights, and make informed decisions — all in real-time.</p>
                    <button onClick={createFormHandler} className='bg-[#1A73E8] mt-6 w-[60%] h-14 rounded-2xl text-white text-xl'>Create form</button>

                </div>
                <HomeImage />
            </div>


            <FormCard />

            <Footer />
        </div>
    )
}

export default Home
