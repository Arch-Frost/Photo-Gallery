import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'

export default function ImageCard({url, image, setUpdateUI}) {
    console.log(image._id)
    const deleteImage = ()=>{
        axios.delete(`${process.env.REACT_APP_IMAGE_SERV}/images/delete/`,{
            data: { imageId: image._id }
          })
        .then((res)=>{
            toast.success('image delete successfully.')
            setUpdateUI((cur)=>!cur)
        })
        .catch((err)=>{
            console.log(err);
            toast.error('error in deleting image')
        })
    }

    console.log(url)
    

    return (
        <div>
                <div className='relative border border-gray-400 rounded-lg h-64 w-72'>
                <img
                    className="h-auto max-w-full rounded-lg"
                    src={URL.createObjectURL(new Blob([new Uint8Array(url)], { type: 'image/png' }))}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => console.error('Error loading image:', e)}
                />

                    <div onClick={deleteImage} className='absolute top-0 right-0 p-2 hover:scale-110 transition cursor-pointer'>
                        <img src="/trash-bin.png" alt='image' className='h-8 w-8'/>
                    </div>
                </div>
            
        </div>
    )
}
