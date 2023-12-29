import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import toast from 'react-hot-toast'

export default function Nav() {
    const navigate = useNavigate()
    const auth = useAuth()

    const logout = () => {
        auth.logout()
        navigate('/')
        toast.success('Logged out successfully')
    }

  return (
    <>
<nav class="bg-black border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="/images.png" class="h-8" alt="Flowbite Logo" />
      <span class="self-center text-3xl font-semibold whitespace-nowrap dark:text-white text-[#fb9e55] pb-1">Gallery</span>
  </a>
  {auth.user? 
    <button type="button" class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <button onClick={()=>navigate('/drive')} type="button" class="text-white bg-[#fb9e55] hover:bg-yellow-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3">Drive</button>
        <button onClick={logout} type="button" class="text-white bg-[#fb9e55] hover:bg-yellow-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3">Logout</button>
    </button> :
  <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button onClick={()=>navigate('/register')} type="button" class="text-white bg-[#fb9e55] hover:bg-yellow-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center  mr-3">Register</button>
      <button onClick={()=>navigate('/login')} type="button" class="text-white bg-[#fb9e55] hover:bg-yellow-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center ">Login</button>
  </div>
  }

  </div>
</nav>

    </>
  )
}
