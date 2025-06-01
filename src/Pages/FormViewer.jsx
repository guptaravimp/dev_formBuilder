import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

function FormViewer() {
  const { id} = useParams();
  const [ViewformData, setFormData] = useState(null);
  const savedResponses = localStorage.getItem(`form-response-${id}`);
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm({
    defaultValues: savedResponses ? JSON.parse(savedResponses) : {}
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(BASE_URL + "/forms/getformData", {
          formId: id
        });
        // setFormData(response);
        const fetchedData = response.data;
        console.log("response",response)
        localStorage.setItem("ViewformData", JSON.stringify(fetchedData));
        setFormData({ data: fetchedData }); 
      } catch (error) {
        console.error("Error fetching form data", error);
        const cached = localStorage.getItem("ViewformData");
        if (cached) {
          setFormData({ data: JSON.parse(cached) });
        }
      }
    };

    fetchFormData();
  }, [id]);



  useEffect(() => {
    const savedResponses = localStorage.getItem(`form-response-${id}`);
    if (savedResponses) {
      reset(JSON.parse(savedResponses));
    }
  }, [ViewformData]);


  useEffect(() => {
    if (ViewformData) {
      const saved = localStorage.getItem(`form-response-${id}`);
      if (saved) {
        reset(JSON.parse(saved));
      }
    }
  }, [ViewformData, id, reset]);



  const watchAll = watch();
  useEffect(() => {
    localStorage.setItem(`form-response-${id}`, JSON.stringify(watchAll));
  }, [watchAll, id]);



  async function onSubmit(data) {

    const responseArray = ViewformData?.data?.data?.steps.map((step, index) => ({
      stepId: step._id,
      answer: data[`question-${index}`]
    }));
    console.log("Response Array is", responseArray)
    try {
      const response = await axios.post(BASE_URL + "/forms/submitResponse", {
        form: id,
        responses: responseArray
      })
      console.log("Submitted response", response);
      navigate(`/forms/${id}/submitted`);

    } catch (error) {
      alert("Error caused during sunmit form")
    }

  }
  const Questionarray = ViewformData?.data.data.steps;
  const handleFileChange = async (e, onChange) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('Yourfiles', file); // Must match the backend field name

    try {
      const response = await axios.post(
        `${BASE_URL}/forms/fileUpload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload success', response.data);
      onChange(response?.data?.imageUrl);
    } catch (error) {
      console.error('Upload Failed: ', error);
    }
  };


  return (

    <div className='flex flex-col justify-center items-center m-auto w-full '>
      <Header />
      <div className='w-full  flex flex-col justify-center items-center'>
        {ViewformData ? (
          <div className='w-[60%] flex flex-col justify-center items-center'>
            <div className=' mt-10 rounded-2xl w-full h-40 border-[1px] overflow-hidden'>
              <div className=' rounded-t-2xl w-full h-full'>
                <img className='rounded-t-2xl w-full h-full object-cover' src={ViewformData?.data?.data?.image} alt="" />
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full  p-2'>

              <div className='bg-white shadow-[0_-8px_0_0_#36045A] text-black mt-3 rounded-2xl w-full  border-[1px] overflow-hidden'>
                <h3 className={`text-black  text-4xl font-sans p-4 font-semibold w-full `}>{ViewformData?.data?.data?.title}</h3>
                <p className={`text-black  text-2xl font-sans p-4 font-semibold w-full `}>Description</p>
                <p className={`text-xl  font-sans p-2 ml-4 w-full `}>{ViewformData?.data?.data?.description}</p>
              </div>
              {
                Questionarray?.map((question, index) => (

                  <div key={index} className={` bg-white text-black shadow-[0_-8px_0_0_#36045A]  firstDiv rounded-xl w-full flex flex-col mt-8 gap-6 border-[1px] border-gray-600 justify-evenly items-left p-6`}>

                    <label className=''>
                      <p className='text-2xl '>{question.label}{question?.required ? <span className=' text-3xl text-red-700'>*</span> : ""}</p>
                    </label>
                    {question.type === "radio" && question.options.map((option, idx) => (
                      <div key={idx} className='border-2 p-2 flex justify-left items-center gap-2 '>
                        <input type="radio"
                          {...register(`question-${index}`, { required: question.required })}
                          value={option} style={{ transform: 'scale(1.5)', marginRight: '8px' }} id={`${index}-rad-${idx}`} name={`question-${index}`} required={question.required} />
                        <label className='text-xl' htmlFor={`${index}-rad-${idx}`}>{option}</label>
                      </div>
                    ))}

                    {question.type === "checkbox" && question.options.map((option, idx) => (
                      <div key={idx} className='border-2 p-2 flex justify-left items-center gap-2 '>
                        <input
                          type="checkbox"
                          style={{ transform: 'scale(2)', marginRight: '8px' }}
                          id={`${index}-${idx}`}
                          value={option}
                          {...register(`question-${index}`)}
                        />
                        <label className='text-xl' htmlFor={`${index}-${idx}`}>{option}</label>
                      </div>
                    ))}



                    {question.type === "text" && (
                      <input type="text" {...register(`question-${index}`, { required: question.required })} placeholder='Your Answer' className={`text-black border-b-2 border-gray-700 outline-none   text-xl font-sans p-1 font-semibold w-[40%] `} required={question.required} />
                    )}

                    {
                      question.type === "textarea" && (
                        <textarea name=""   {...register(`question-${index}`, { required: question.required })}
                          className={`text-black border-b-2 border-gray-700 outline-none   text-xl font-sans p-1 font-semibold w-[70%] `} id=""></textarea>
                      )
                    }
                    {question.type === "file" && (

                      <Controller
                        control={control}
                        name={`question-${index}`}
                        rules={{ required: question.required }}
                        render={({ field }) => (
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              handleFileChange(e, field.onChange); // Pass field.onChange to update form state
                            }}
                            className="w-[32%] rounded-t-xl p-1 text-xl font-sans"
                            required={question.required}
                          />
                        )}
                      />




                    )}
                  </div>
                ))
              }



              <button type="submit" className='mt-4  p-2 w-36 mb-9 font-semibold bg-blue-600 text-white rounded'>Submit</button>
            </form>

          </div>
        ) : (
          <p>No form data found.</p>
        )}
      </div>


    </div>
  );
}

export default FormViewer;
