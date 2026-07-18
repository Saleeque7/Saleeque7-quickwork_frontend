import React from 'react'
import {Transition} from "../../../components/uic/Animation/Animation"
import Jobform from '../../../components/Client/JobForm/Jobform';

export default function PostJobs() {
  return (
    <div className="w-full bg-[#f8f8f8] h-auto pb-12">
      <Transition>
        <div className="w-full flex justify-center items-center pt-[50px]">
          <h1 className="text-[30px] font-sans font-semibold text-teal-600">Create a New Job post</h1>
        </div>
        <div className="m-[50px] mr-8 md:mr-32">
          <Jobform page={'create'}/>
        </div>
      </Transition>
    </div>
  )
}
