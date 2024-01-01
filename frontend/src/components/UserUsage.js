import React, { useEffect, useState } from "react";
import { convertBytes, getPercentageStorage } from "../utils/helper";
import { useAuth } from "../context/auth";
import axios from 'axios'
export default function UserUsage({updateUI}) {

    const [usage, setUsage] = useState('')
    const [percentage, setPercentage] = useState('')
    const auth = useAuth()

    //get user id from localstorage
    const userId = localStorage.getItem('asad_auth')
    //covert to json
    const user = JSON.parse(userId)

    const fetchUsage = ()=>{
        axios.get(`${process.env.REACT_APP_USAGE_SERV}/getUserStorage/${user._id}`)
        .then((res)=>{
            setUsage(convertBytes(res.data?.data.dailyBandwidth))
            setPercentage(getPercentageStorage(res.data?.data.dailyBandwidth, 26214400).toFixed(2))
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        fetchUsage()
    },[updateUI])

  return (
    <>
      <div className="p-3 border rounded border-gray-400 mb-4 w-full mr-3 md:w-1/2">
      <div className="flex">
        <p>Daily Usage</p>
        <p className="ml-auto">{usage?usage:0} Used of 25MB</p>
        </div>
        <div class="w-full bg-gray-200 mt-2 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-[#fb9e55] h-2.5 rounded-full" style={{width: `${percentage?percentage:0}%`}}></div>
        </div>
      </div>
    </>
  );
}
