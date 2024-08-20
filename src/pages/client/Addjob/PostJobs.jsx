import React from 'react'
import {Transition} from "../../../components/uic/Animation/Animation"
import Navbar from "../../../components/main/Navbar";
import Footer from "../../../components/main/footer";
import Jobform from '../../../components/Client/JobForm/Jobform';
import "./PostJobs.scss";
export default function PostJobs() {
  return (
    <div className="Add-main-div">
    
      <Transition>
        <div className="addtemplate-letter">
          <h1 className="additem">Create a New Job post</h1>
        </div>
        <div className="Add-templ-func">
          <Jobform page={'create'}/>
        </div>
      </Transition>
   
    </div>
  )
}
