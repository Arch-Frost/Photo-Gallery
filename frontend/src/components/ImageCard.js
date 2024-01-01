import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

export default function ImageCard({ url, image, setImages, setUpdateUI }) {
  console.log(image._id);

  const deleteImage = async () => {
    const response = axios.delete(
      `${process.env.REACT_APP_IMAGE_SERV}/images/delete/`,
      {
        data: { imageId: image._id },
      }
    );

    const { error } = await toast.promise(response, {
      loading: "Deleting image...",
      success: "Image deleted successfully",
      error: "Error occured while deleting image!",
    });

    if (!error) {
      setImages((prev) => prev.filter((img) => img._id !== image._id));
      setUpdateUI((prev) => !prev);
    }
  };

  console.log(url);

  return (
    <div>
      <div className="relative border border-gray-400 rounded-lg h-64 w-72">
        <img
          className="h-auto max-w-full rounded-lg"
          src={URL.createObjectURL(
            new Blob([new Uint8Array(url)], { type: "image/png" })
          )}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => console.error("Error loading image:", e)}
        />

        <div
          onClick={deleteImage}
          className="absolute top-0 right-0 p-2 hover:scale-110 transition cursor-pointer"
        >
          <img src="/trash-bin.png" alt="image" className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
