import React, { useEffect, useState } from 'react'
import axios from 'axios';
import plusIcon from "../assets/image/plusicon.png"
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setformData } from '../slices/FormDataSlice';
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
function PreDefinedTemplates() {
    const [forms, setForms] = useState([]);
     const dispatch = useDispatch();
    const navigate = useNavigate()
    const {id}=useParams()
    const createFormHandler = async () => {
        try {
            console.log("result is ", `${BASE_URL}/forms/createform`)
            const res = await axios.post(
                BASE_URL + '/forms/createform',
                {},
                { withCredentials: true }
            );
            console.log("result is ", res)
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

    useEffect(() => {
        const allforms = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/forms/getAllforms`);
                console.log("All form Data is ", response.data);
                if (response.data.success) {
                    setForms(response.data.data.slice(0, 3)); // take only first 3 forms
                }
            } catch (error) {
                console.error("Error fetching forms:", error);
            }
        };
        allforms();
    }, []);
    return (
        <div className='p-6'>
            <div className='flex flex-wrap justify-center items-center gap-6'>
                <div className='p-2 border rounded shadow cursor-pointer text-xl'><button onClick={createFormHandler}>
                    <img className='h-48 w-50' src={plusIcon}
                     alt="" /></button></div>

                {forms.map((form) => (
                    <button onClick={()=>navigate(`/forms/${form._id}/edit`)}>
                        <div key={form._id} className='border-2 bg-[#F0EBF8]  rounded-xl shadow w-60 p-2 h-80'>
                            <img src={form.image} alt={form.title} className='w-full  h-48 object-cover rounded mb-2' />
                            <h2 className='text-2xl font-semibold'>{form.title}</h2>
                            <p className='text-xl text-gray-600'>
                                created: {new Date(form.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                    </button>

                ))}
            </div>
        </div>
    )
}

export default PreDefinedTemplates
