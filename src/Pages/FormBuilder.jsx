import React, { useEffect, useRef, useState } from 'react'
import imagelogo from "../assets/image/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import { setThemeToggle } from '../slices/themeToggleSlice';
import { updateField } from '../slices/FormDataSlice';
import { useForm } from 'react-hook-form';
import { MdOutlineCircle } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

import { MdDelete } from "react-icons/md";
import { FaToggleOff } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";



import { FaToggleOn } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoLink } from "react-icons/io5";
import { MdAddCircle } from "react-icons/md";
import { RxDragHandleHorizontal } from "react-icons/rx";




import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const Divstyle = {
    transform: CSS.Transform.toString(transform),
    transition,

    cursor: 'grab',
    backgroundColor: '#2C2D32'

  };

  const [hovered, setHovered] = React.useState(false);
  return (
    <div

      ref={setNodeRef}  {...attributes} {...listeners}
      style={Divstyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${hovered ? "rounded-xl" : "rounded-xl"} flex mt-6   flex-col justify-center  items-center`}
    >
      {
        hovered ? <RxDragHandleHorizontal className=' mt-1 text-4xl text-white' />

          : <></>
      }

      <div className=' mt-[-20px] w-full'>
        {children}
      </div>
    </div>



  );
}


function FormBuilder() {
  const dispatch = useDispatch();
  const [active, setactive] = useState(false);
  const [openLink, setOpenLinK] = useState(false)
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate()
  const [formMeta, setFormMeta] = useState({
    image: "",
    steps: [],
    title: "",
    description: "",
    mode: null,
    status:"",
    PublicUrl:"",
    theme: "",
    createdAt: Date.now() 
  });

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: formMeta.title,
      description: formMeta.description,
    }
  });
  const { id } = useParams();

  const [formSteps, setFormSteps] = useState(formMeta.steps);
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/forms/getformData`, { formId: id, withCredentials: true });
        const data = response.data;
        console.log("response of fetch yaha hai ", response)
        setFormSteps(data?.data?.steps || []);
        reset({ title: data?.data.title, description: data?.data.description });
        setFormMeta({
          image: data?.data.image,
          title: data?.data.title,
          description: data?.data.description,
          steps: data?.data?.steps,
          status:data?.data?.status,
          PublicUrl:data?.data?.PublicUrl,
          mode: data?.data.mode,
          theme: data?.data.theme
        });
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [id]);

  const CreateSteps = async (step) => {
    const response = await axios.post(BASE_URL + "/forms/createStep", {
      ...step,
      formId: id,
    }, { withCredentials: true });
    return response.data.data;

  };


  const addField = async () => {
    try {
      const newStep = await CreateSteps({ label: "", type: "radio", options: [""] });
      setFormSteps(prev => {
        const updated = [...prev, newStep];
        console.log("Updated form steps after adding:", updated);
        return updated;
      });

    } catch (err) {
      console.error("Failed to add step", err);
    }
  };


  const updateStepAPI = async (stepId, stepData) => {
    try {
      const response = await axios.put(BASE_URL + "/forms/updateStep", {
        stepId,
        ...stepData
      }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error updating step", error);
    }
  };
  const updateStepField = async (index, key, value) => {
    const updatedSteps = [...formSteps];
    updatedSteps[index][key] = value;
    setFormSteps(updatedSteps);

    const stepId = updatedSteps[index]._id;
    if (stepId) {
      await updateStepAPI(stepId, updatedSteps[index]);
    }
  };




  const updateOption = async (fieldIndex, optionIndex, value) => {
    const updated = [...formSteps];
    const updatedStep = { ...updated[fieldIndex] };
    updatedStep.options = [...(updatedStep.options || [])];
    updatedStep.options[optionIndex] = value;
    updated[fieldIndex] = updatedStep;
    setFormSteps(updated);

    const stepId = updatedStep._id;
    if (stepId) {
      await updateStepAPI(stepId, updatedStep);
    }
  };




  const watchedFields = watch();
  useEffect(() => {
    dispatch(updateField({ field: "title", value: watchedFields.title }));
    dispatch(updateField({ field: "description", value: watchedFields.description }));
    localStorage.setItem("formData", JSON.stringify({
      title: watchedFields.title,
      description: watchedFields.description,
      image: formMeta.image,
      steps: formMeta.steps,
      status:formMeta.status,
      PublicUrl:formMeta.PublicUrl,
      mode: formMeta.mode,
      theme: formMeta.theme
    }));
  }, [watchedFields, formSteps, dispatch]);






  const addOption = (stepIndex) => {
    const updatedSteps = [...formSteps];
    if (!updatedSteps[stepIndex].options) {
      updatedSteps[stepIndex].options = []; 
    }
    updatedSteps[stepIndex].options.push("");
    setFormSteps(updatedSteps);
  };
  const deleteField = (_id) => {
    console.log("_id hai", _id)
    setFormSteps(prev => prev.filter(field => field._id !== _id));
  };


  const deleteOption = (fieldIndex, optionIndex) => {

    const updated = [...formSteps];
    updated[fieldIndex].options.splice(optionIndex, 1);
    setFormSteps(updated);
  };
  const title = formMeta?.title;

  const { theme } = useSelector((state) => state.themeToggle);




  function onSubmit(data) {
    const finalFormData = {
      ...data,
      image: formMeta?.image,
      steps: formMeta?.steps
    };

    toast("form data saved successfully")
    localStorage.setItem("finalFormData", JSON.stringify(finalFormData));
  }




  const [showSubmit, setShowSubmit] = useState(false);
  const handleDivClick = () => {
    setShowSubmit(true);
    setactive(true)
  };


  const divRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowSubmit(false);
        setactive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const PublishForm = async (formId, formData) => {
    try {

      const response = await axios.put(BASE_URL + "/forms/updateform", {
        formId,
        ...formData
      }, {
        withCredentials: true,
      });
      console.log("Published response", response)
      setFormMeta(response?.data?.data)
      return response;
    } catch (error) {
      console.error("Error saving form:", error);
      throw error;
    }
  };
  const [publicurl, setPublicurl] = useState("")
  const handlePublish = async () => {
    try {
      const formDatas = {
        title: watchedFields.title,
        description: watchedFields.description,
        image: formMeta?.image,
        steps: formSteps,
        mode: formMeta?.mode,
        theme: formMeta?.theme,
        PublicUrl:formMeta?.PublicUrl,
        createdAt: formMeta?.createdAt,
        updatedAt: formMeta?.updatedAt,
        status: "published"
      };
      const response = await PublishForm(id, formDatas);
      setPublicurl(response.data.publicLink)
      setOpenLinK(openLink)
      console.log("dono bhai data ",openLink)


      const formId = response.data._id || id;

      const existingForms = JSON.parse(localStorage.getItem("Allforms")) || [];

      const formIndex = existingForms.findIndex(form => form._id === formId);

      const newForm = { ...formDatas, _id: formId,createdAt:Date.now() };

      if (formIndex !== -1) {
        existingForms[formIndex] = newForm;
      } else {
        existingForms.push(newForm);
      }

      localStorage.setItem("Allforms", JSON.stringify(existingForms));
      toast("Form published successfully!")
    } catch (error) {
      console.error("Failed to publish form:", error);
      toast("Failed to publish form. Please try again.")
    }
  };
  const handleResponse = () => {
    console.log("formData is ", formMeta)
    navigate(`/form/${id}/response`)

  }
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Link copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };



  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = formSteps.findIndex((step) => step._id === active.id);
      const newIndex = formSteps.findIndex((step) => step._id === over.id);

      setFormSteps((items) => arrayMove(items, oldIndex, newIndex));
    }
  };
const handleCopy=()=>{
  copyToClipboard(formMeta?.PublicUrl);
  setOpenLinK(!openLink);
}
  return (

    <div className=' flex flex-col justify-evenly items-center m-auto w-full '>
      <div className={`mx-auto w-[90%] HeaderDiv rounded-2xl ${theme === "light" ? " bg-[#1D1C20] text-white" : " bg-white text-black"}  sticky top-4 flex justify-between items-center  p-1 `}>
        <Link to={"/"}>
          <div className='flex  justify-evenly items-center '>
            <img src={imagelogo} className='h-16 w-16 ' alt="" /><p className='text-2xl font-semibold'>Hypergro Form</p>

          </div>
        </Link>





        <div className='w-[60%]  secondHeader  flex justify-evenly items-center p-2 gap-6  '>
          <div className='Relative'>
           {formMeta.status === 'published' ? (
              <button className='text-4xl ' onClick={HandleLink}>
                <IoLink />
              </button>
            ) : ( openLink && 
              <div className='absolute w-[20%] flex flex-col gap-2 top-20 right-36 bg-white p-2 border rounded-xl shadow-md z-10'>
                <div className='w-full flex flex-col justify-between items-start p-2 gap-1'>
                  <p className='text-xl w-full text-black font-semibold'>The form is unpublished</p>
                  <p className='text-md w-full text-black'>Currently, nobody can respond. Do you want to copy the unpublished form link? </p>
                </div>

                <div className='flex justify-end items-center'>
                  <button
                    onClick={handleCopy}
                    className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

          </div>

          <button
            className={`p-2  rounded bg-[#673AB7] text-xl text-white font-sans font-semibold w-40 `}
            onClick={handlePublish}
          >
            {formMeta.status==='published' ? "Published" : "Publish"}
          </button>
          <button onClick={handleResponse} className='p-2  rounded bg-[#673AB7] text-xl text-white font-sans font-semibold w-40 '>Response</button>
          <button
            className={`p-2 text-4xl   rounded ${theme === "light" ? "bg-transparent text-white" : "bg-transparent text-[#1D1C20]"}  `}
            onClick={() => dispatch(setThemeToggle())}
          >
             {theme === 'light'? <MdDarkMode />
 : <MdLightMode />
}
             
          </button>
        </div>

      </div>





      <div className=' mt-10 rounded-2xl w-[50%] h-40 border-[1px] overflow-hidden'>
        <div className=' rounded-t-2xl w-full h-full'>
          <img className='rounded-t-2xl w-full h-full object-cover' src={formMeta.image} alt="" />
        </div>
      </div>


      <div className=' mt-4 flex justify-center items-center m-auto w-full '>




        <form onSubmit={handleSubmit(onSubmit)} className='w-[50%]  p-2' >


          <div className=' shadow-[0_-8px_0_0_#2C2D32] border-[1px] border-gray-600 firstDiv rounded-xl w-full flex flex-col gap-4 justify-start items-center p-4 bg-white' onClick={handleDivClick} ref={divRef}>

            <input type="text" className={`text-black outline-none border-b-2 border-[#DADCE0] w-[98%] focus:border-[#36045A] transition duration-300 text-4xl font-sans p-6 font-semibold  ${active ? "h-20" : "h-10"}`} placeholder={title} {...register('title', { required: "Title is required" })} />
            {errors.title && <p>{errors.title.message}</p>}

            <input type="text" className={`text-black text-2xl  outline-none border-b-2 border-[#DADCE0] p-6 focus:border-[#36045A] transition duration-300 font-sans  w-[98%] ${active ? "h-14" : "h-8"}`} placeholder="Form Description" {...register('description', { required: "Description is required" })} />
            {errors.description && <p>{errors.description.message}</p>}

          </div>


          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formSteps.map((step) => step._id)}
              strategy={verticalListSortingStrategy}
            >

              {formSteps.map((field, idx) => (


                <SortableItem key={field._id} id={field._id}>

                  <div key={idx}
                    className={`shadow-[0_-8px_0_0_#2C2D32] border-2   firstDiv rounded-xl w-full flex flex-col mt-8 gap-4  justify-evenly items-center p-2 bg-white`} >
                    <div className=' w-full flex justify-between  items-center p-2 text-black'>

                      <input
                        className={`w-[60%] hover:bg-[#F1F3F4] rounded-t-xl p-4  text-xl font-sans   outline-none border-b-2 border-[#DADCE0] focus:border-[#36045A] transition duration-300`}
                        placeholder="Question"
                        value={field.label}
                        onChange={e => updateStepField(idx, 'label', e.target.value)}
                      />
                      <select
                        className='w-[25%] border-[1px] text-xl rounded-xl border-gray-500 p-2'
                        value={field.type}
                        onChange={e => updateStepField(idx, 'type', e.target.value)}
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="file">File Upload</option>
                        <option value="radio">Multiple Choice</option>
                      </select>




                    </div>

                    {field.type === 'radio' && (
                      <div className=" w-full ml-2">
                        {field.options?.map((option, optionIdx) => (
                          <div key={optionIdx} className="flex items-center my-1 text-black">
                            <span className='opacity-50'><MdOutlineCircle />
                            </span>
                            <input
                              key={optionIdx}
                              className={`ml-2 w-[70%] hover:bg-[#F1F3F4] rounded-t-xl p-1  text-xl font-sans   outline-none border-b-2 border-[#DADCE0] focus:border-[#36045A] transition duration-300`}
                              placeholder={`Option ${optionIdx + 1}`}
                              value={option}
                              onChange={(e) => updateOption(idx, optionIdx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="ml-2 p-1  rounded text-white"
                              onClick={() => deleteOption(idx, optionIdx)}
                            >
                              <MdDelete className="text-red-600 cursor-pointer text-2xl" onClick={() => deleteOption(idx, optionIdx)} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="text-blue-500 mt-1 flex justify-evenly items-center gap-2 underline"
                          onClick={() => addOption(idx)}
                        >
                          <span><MdOutlineCircle />
                          </span>+ Add Option
                        </button>
                      </div>
                    )}

                    {field.type === 'checkbox' && (
                      <div className=" w-full ml-2">
                        {field.options?.map((option, optionIdx) => (
                          <div key={optionIdx} className=" w-full flex items-center my-1">
                            <input type="checkbox" disabled className="mr-2" />
                            <input
                              className={`ml-2 w-[70%] hover:bg-[#F1F3F4] rounded-t-xl p-1  text-xl font-sans   outline-none border-b-2 border-[#DADCE0] focus:border-[#36045A] transition duration-300 text-black`}
                              placeholder={`Option ${optionIdx + 1}`}
                              value={option}
                              onChange={(e) => updateOption(idx, optionIdx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="ml-2 p-1 bg-red-400 rounded text-white"
                              onClick={() => deleteOption(idx, optionIdx)}
                            >
                              <MdDelete className="text-red-500 cursor-pointer" onClick={() => deleteOption(idx, optionIdx)} />

                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-blue-500 flex justify-evenly items-center gap-2 mt-1 underline"
                          onClick={() => addOption(idx)}
                        >
                          <span><MdCheckBoxOutlineBlank />

                          </span>
                          + Add Others
                        </button>
                      </div>
                    )}

                    {field.type === 'file' && (
                      <div className=" w-full ml-2">
                        <input type="file" disabled className={`ml-2 w-[40%]  rounded-t-xl p-1  text-xl font-sans   outline-none border-b-2 border-transparent focus:border-[#36045A] transition duration-300`} />
                      </div>
                    )}

                    {field.type === 'text' && (
                      <div className="w-full ml-2">
                        <input type="text" disabled placeholder="Short Answer" className={`ml-2 w-[70%] hover:bg-[#F1F3F4] rounded-t-xl p-1  text-xl font-sans   outline-none border-b-2 border-transparent focus:border-[#36045A] transition duration-300`} />
                      </div>
                    )}

                    {field.type === 'textarea' && (
                      <div className="full ml-2">
                        <textarea disabled placeholder="Long Answer" className={`ml-2 border-2 w-[70%] hover:bg-[#F1F3F4] rounded-t-xl p-1  text-xl font-sans   outline-none border-b-2 border-transparent focus:border-[#36045A] transition duration-300`} rows={3}></textarea>
                      </div>
                    )}



                    <div className='w-[98%] m-3  p-2 flex justify-end items-center gap-4 outline-none border-t-[1px]  '>
                      <button onClick={deleteField} className='text-black text-3xl '><MdDelete /></button>
                      <span className='text-3xl justify-center items-center opacity-50'>|</span>
                      <div className='flex justify-evenly items-center gap-2'>
                        <span>Required</span><button
                          onClick={() => updateStepField(idx, 'required', !field.required)}
                          className='text-black  flex justify-evenly items-center'
                        >
                          {field.required ? <FaToggleOn className='text-3xl ' /> : <FaToggleOff className='text-3xl ' />}
                        </button>
                      </div>

                    </div>




                  </div>





                </SortableItem>
              ))}

            </SortableContext>
          </DndContext>


          <div className='flex justify-between items-center gap-2'>
            <button type="button" onClick={addField} className='mt-4 p-2 font-semibold bg-[#673AB7] flex justify-evenly items-center gap-2 text-white rounded'><MdAddCircle />
              Add Field</button>
            <button type="submit" className='mt-4 ml-4 p-2 font-semibold bg-blue-600 text-white rounded'>Save Form</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default FormBuilder
