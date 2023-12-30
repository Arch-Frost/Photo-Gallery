import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
    const navigate = useNavigate()
  return (
    <div>
      <section class="text-gray-600 body-font">
  <div class="container px-5 pl-10 py-2 mx-auto flex flex-wrap items-center">
    <div class="lg:w-3/6 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
      <h1 class="title-font font-medium text-3xl text-gray-900">Discover Captivating Moments with Our Photography Collection</h1>
      <p class="leading-relaxed mt-4">Immerse yourself in a world of visual storytelling. Our curated collection showcases breathtaking landscapes, vibrant cultures, and the beauty of everyday life.</p>
      <button onClick={()=>navigate('/register')} type="button" class="text-white bg-[#fb9e55] hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-6 mt-16 py-4 text-center mr-3">Get Registered Now</button>
    </div>
    <div class="lg:w-3/6 md:w-1/2 flex flex-col md:ml-auto w-full mt-3 md:mt-0">
      <img src="/hero.png" class="" alt="img" />
    </div>
  </div>
</section>
    </div>
  )
}
