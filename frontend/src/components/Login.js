import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your server for registration
      const response = await axios.post(process.env.REACT_APP_USER_ACC_MGMT_SERV_URL + "/login", {
        email,
        password,
      });

      auth.login(response.data.data)
      navigate('/drive')

    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      toast.error("Login failed")
    }
  };

  return (
    <div className='mt-36 p-3'>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <h1 className='font-bold text-2xl mb-4 text-center'>Login</h1>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white w-full bg-[#fb9e55]  hover:bg-yellow-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
