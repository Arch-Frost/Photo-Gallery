import React, { useEffect, useState } from "react";
import { convertBytes, getPercentageStorage } from "../utils/helper";
import { useAuth } from "../context/auth";
import axios from 'axios'
export default function UserUsage({updateUI}) {

    const [usage, setUsage] = useState('')
    const [percentage, setPercentage] = useState('')
    const auth = useAuth()

    const fetchUsage = ()=>{
        axios.get(`http://photogallery.com/api/usage/user/${auth.user?._id}`)
        .then((res)=>{
            setUsage(convertBytes(res.data?.data.totalUsage))
            setPercentage(getPercentageStorage(res.data?.data.totalUsage, 26214400).toFixed(2))

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
      <div className="p-3 border border-gray-400 mb-4 w-1/2 mr-3">
      <div className="flex">
        <p>Daily Usage</p>
        <p className="ml-auto">{usage?usage:0} Used of 25MB</p>
        </div>
        <div class="w-full bg-gray-200 mt-2 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-blue-600 h-2.5 rounded-full" style={{width: `${percentage?percentage:0}%`}}></div>
        </div>
      </div>
    </>
  );
}
