import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

function Response() {
  const { id } = useParams()
  const [labels, setlabels] = useState([])
  const [AllResponses, setAllResponses] = useState([])




  const { formattedDate, formattedTime, ampm } = useMemo(() => {
    const createdAt = AllResponses[0]?.form?.createdAt;
    if (!createdAt) return { formattedDate: '', formattedTime: '', ampm: '' };

    const date = new Date(createdAt);
    if (isNaN(date)) return { formattedDate: '', formattedTime: '', ampm: '' };

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}`;

    return { formattedDate, formattedTime, ampm };
  }, [AllResponses]);


  useEffect(() => {
    const fetchResponse = async () => {
      try {
        console.log(id)
        const response = await axios.get(BASE_URL + "/forms/fetchresponse", {
          params: { formId: id }
        });
        console.log("ho agay hai ")
        console.log("response bhi to chahiye", response.data.data)
        setAllResponses(response?.data?.data)
        console.log("steps array .label se mil sakta hai head", response?.data?.data[0]?.form.steps)
        setlabels(response?.data?.data[0]?.form.steps)
      } catch (error) {
        console.log("fetching error")
      }

    }
    fetchResponse()
  }, [id])
  return (
    <div className='mx-auto w-full flex flex-col  justify-center items-center'>



      <Header />

















      <div className=' w-[90%] mt-6 flex justify-between items-center'>
        <p className='font-semibold text-xl'><strong>Form Title:</strong>  {AllResponses[0]?.form.title}</p>
        <p className='font-semibold text-xl'><strong>created: </strong>{formattedDate}-<span>{formattedTime}-<span>{ampm}</span></span></p>
      </div>
      <h1 className='text-2xl font-semibold'>Response Table</h1>

      {
        AllResponses.length > 0 ?
          <table className='border-collapse text-xl w-[90%] mt-7 border-2 rounded-2xl border-gray-500'>
            <thead className='w-full '>

              <tr >{
                labels?.length > 0 && labels.map((labels, index) => (

                  <th className='border border-gray-500 text-center p-2' key={index}>
                    {labels.label}
                  </th>

                ))}
              </tr>

            </thead>

            <tbody>
              {
                AllResponses.length > 0 && AllResponses.map((responsei, index) => (
                  <tr key={index}>
                    {
                      labels.map((label, i) => {
                        const answerObj = responsei.responses.find(r => r.stepId._id === label._id);
                        return <td key={i} className='border border-gray-400 text-center p-2'>{answerObj ? answerObj.answer : ''}</td>
                      })
                    }
                  </tr>
                ))
              }
            </tbody>

          </table> : <div className='text-xl mt-8'>No Response Yet</div>
      }




    </div>
  )
}

export default Response
