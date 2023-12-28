import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'

export default function ImageCard({url, image, setUpdateUI}) {

    const deleteImage = ()=>{
        axios.delete(`http://photogallery.com/image/delete/${image}`)
        .then((res)=>{
            toast.success('image delete successfully.')
            setUpdateUI((cur)=>!cur)
        })
        .catch((err)=>{
            toast.error('error in deleting image')
        })
    }

    return (
        <div>
                <div className='relative border border-gray-400 rounded-lg h-64 w-72'>
                    <img class="h-auto max-w-full rounded-lg" src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    <div onClick={deleteImage} className='absolute top-0 left-0 p-2 bg-red-200 font-bold text-sm text-red-800 rounded-full m-2 hover:scale-105 cursor-pointer transition-all'>
                        Delete
                    </div>
                </div>
              
        </div>
    )
}
