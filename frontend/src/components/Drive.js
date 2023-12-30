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

            const response = axios.post(`${process.env.REACT_APP_IMAGE_SERV}/images/upload`, formData);

            const {error} = await toast.promise(response, {
                loading: 'Uploading image...',
                success: 'Image uploaded successfully',
                error: (err)=>err.response.data.message,
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
        axios.get(`${process.env.REACT_APP_IMAGE_SERV}/images/${auth.user?._id}`)
            .then((res) => {
                setImages(res.data.data)
                console.log(res.data.data)
            })
            .catch((err) => {
                console.log('error')
            })
    }

    useEffect(()=>{
        auth.user && fetchImages();
    },[updateUI])

    return (
        <div className='m-8'>
        
            <div className='mb-5'>
                <div className='flex'>
                    <input
                        className="block w-full mr-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none"
                        id="file_input"
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className='flex flex-col'>
            <UserStorage updateUI={updateUI}/>
            <UserUsage updateUI={updateUI}/>
        </div>
            <div className="flex flex-wrap gap-6">
                {images.map((image)=>(
                <ImageCard url={image.image.data} image={image} setUpdateUI={setUpdateUI} />
                ))}
            </div>
        </div>
    );
}
