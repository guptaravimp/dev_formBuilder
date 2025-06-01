import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import {  useSelector } from 'react-redux'
import FormBuilder from './Pages/FormBuilder'
import FormViewer from './Pages/FormViewer'
import SuccessfullSubmitted from './components/SuccessfullSubmitted'
// import SortableFormSteps from './components/SortableFormSteps'
import Response from './Pages/Response'
const router=createBrowserRouter([
  {
    path:"/",
    element: <div><Home/></div> 
  },
  {
    path:'/form/:id/edit',
    element: <div><FormBuilder/></div>
  },
  
  {
    path: '/forms/:id/published',
    element: <div><FormViewer/></div>
  },{
    path:"/form/:id/submitted",
    element:<SuccessfullSubmitted/>
  },
  
  {
    path:'/form/:id/response',
    element: <div><Response/></div>
  },
   {
    path: "*",
    element: <div>404 Not Found</div>
  }

])
function App() {
    const { theme } = useSelector((state) => state.themeToggle);
  return (
    <div className={` w-full min-h-screen  ${theme === "light" ? "bg-[#000000] text-white" : "bg-[#F0EBF8] text-black"} `}>
       <RouterProvider router={router}/>
    </div>
  )
}

export default App
