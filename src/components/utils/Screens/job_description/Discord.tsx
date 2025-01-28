import React from 'react'
import { BsDiscord } from "react-icons/bs";
import { Button } from "@/components/ui/button"
import { FiArrowUpRight } from "react-icons/fi";

const Discord = () => {
  return (
    <div className='bg-muted'>
       
       <div className='mx-5 md:container py-16'>
        <div className='md:flex items-center'>
            <div className=' w-full md:w-1/2'>
            <div className='flex items-center  gap-5'>
            <div className='p-5 border rounded-full bg-discordbg text-background'><BsDiscord size={60}  /></div>
            <div className=''>
            <h1 className='text-3xl font-bold text-modaltext'>Discord</h1>
            <div className=' justify-start'>

            <Button variant={"link"}>More Details <FiArrowUpRight /></Button>
            </div>
           
            </div>
            </div>

            <div className='text-signininput mt-7 leading-8'>
                <p>Discord is a platform for hosting real-time text, video, and voice chat. While other social platforms are oriented around one central community, Discord is divided into servers or many smaller communities. Servers can be public or private spaces</p>
            </div>
            </div>
            <div className='w-full md:w-1/2 mt-4'>
            <img src="/images/discordmeeting.png" alt="discord" />
            </div>

        </div>
       </div>
       </div>
  )
}

export default Discord