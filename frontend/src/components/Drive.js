import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageCard from "./ImageCard";
import toast from "react-hot-toast";
import UserStorage from "./UserStorage";
import UserUsage from "./UserUsage";
import { useAuth } from "../context/auth";
export default function Drive() {
  const [updateUI, setUpdateUI] = useState(false);
  const [images, setImages] = useState([]);

  const auth = useAuth();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const isValidFiles =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";
    if (isValidFiles) {
      handleUpload(file);
    } else {
      // toast.error("Please select a valid file");
      toast.error("Please select an image file", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        iconTheme: {
          primary: "#ff0000",
          secondary: "#fff",
        },
      });
    }
    event.target.value = null;
  };

  //get user id from localstorage
  const userId = localStorage.getItem("asad_auth");
  //covert to json
  const user = JSON.parse(userId);

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) {
      alert("Please select a file before uploading");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("userId", user._id);

      const response = axios.post(
        `${process.env.REACT_APP_IMAGE_SERV}/images/upload`,
        formData
      );

      const { error } = await toast.promise(response, {
        loading: "Uploading image...",
        success: (response) => {
          setImages([...images, response.data.data]);
          setUpdateUI(!updateUI);
          return "Image uploaded successfully";
        },
        error: (err) => err.response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImages = () => {
    axios
      .get(`${process.env.REACT_APP_IMAGE_SERV}/images/${user._id}`)
      .then((res) => {
        setImages(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log("error");
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="m-8">
      <div class="flex w-full items-center mb-8 justify-center bg-grey-lighter">
        <label class="flex flex-col w-full items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-gray-700">
          <svg
            class="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span class="mt-2 text-base leading-normal">Select an image</span>
          <input
            type="file"
            class="hidden"
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
          />
        </label>
      </div>

      <div className="flex flex-col md:flex-row">
        <UserStorage updateUI={updateUI} />
        <UserUsage updateUI={updateUI} />
      </div>
      <div className="flex flex-wrap gap-6">
        {images.map((image) => (
          <ImageCard
            url={image.image.data}
            image={image}
            setUpdateUI={setUpdateUI}
            setImages={setImages}
          />
        ))}
      </div>
    </div>
  );
}
