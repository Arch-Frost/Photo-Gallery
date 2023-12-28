import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';
import toast from 'react-hot-toast'
import UserStorage from './UserStorage';
import UserUsage from './UserUsage';
import {useAuth} from '../context/auth'
export default function Drive() {
    const [updateUI, setUpdateUI] = useState(false)
    const [images, setImages] = useState([])
    
    const auth = useAuth()
    const handleFileChange = (event) => {   
        const file = event.target.files[0];
        if(file){
            handleUpload(file)
        }
        event.target.value = null
        
    };

    const handleUpload = async (selectedFile) => {
        if (!selectedFile) {
            alert('Please select a file before uploading');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('userId',auth.user._id)

            const response = axios.post('http://photogallery/image/upload', formData);

            const {error} = await toast.promise(response, {
                loading: 'Uploading image...',
                success: 'Image uploaded successfully',
                error: (err)=>err.response.data.msg,
            }
            )
            if(!error){
                setUpdateUI(!updateUI)
            }

        } catch (error) {
            console.log(error)
            
        }
    };

     const fetchImages = () => {
        axios.get(`http://photogallery.com/images/${auth.user?._id}`)
            .then((res) => {
                setImages(res.data)
            })
            .catch((err) => {
                console.log('error')
            })
    }

    useEffect(()=>{
        fetchImages();
    },[updateUI])

    return (
        <div className='m-8'>
        <div className='flex'>
            <UserStorage updateUI={updateUI}/>
            <UserUsage updateUI={updateUI}/>
        </div>
            <div className='mb-5'>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                <div className='flex'>

                    <input
                        className="block w-full mr-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none"
                        id="file_input"
                        type="file"
                        onChange={handleFileChange}
                    />
                    {/* <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpload}
                    >
                        Upload
                    </button> */}
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                {images.map((image)=>(
                <ImageCard url={image.url} image={image._id} setUpdateUI={setUpdateUI} />
                ))}
            </div>
        </div>
    );
}
