'use client'
// "use server"
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
    return (
        <div className='p-10'>
           <h2 className='font-bold text-2xl'>DashBoard</h2>
           <h2 className='text-gray-400'>Create and start your mockup interview</h2> 
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 my-5'>
             <AddNewInterview />
           </div>

           <InterviewList />
        </div>
    )
}

export default Dashboard
