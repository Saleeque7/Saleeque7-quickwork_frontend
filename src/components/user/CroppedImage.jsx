import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { FaCamera, FaCut } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ImageUploaderWithCrop = ({ user, onImageCropped, imageError }) => {
  const currentUser = useSelector((state) => state.persisted.user.user);

  const [image, setImage] = useState(currentUser?.profile?.location || "");
  const [error, setError] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (imageError) {
      setError(imageError);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [imageError]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setIsCropping(true);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = (imageSrc, crop) => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        }, 'image/jpeg');
      };
    });
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      setIsCropping(false);
      if (onImageCropped) {
        onImageCropped(croppedImageUrl);
      }
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels, onImageCropped]);

  const handleReCrop = () => {
    setIsCropping(true);
  };

  return (
    <div className="w-full md:w-[30%] p-5 flex flex-col items-center">
      <div className="relative inline-block">
        <img
          src={croppedImage || image || "https://via.placeholder.com/150"}
          onClick={() => document.getElementById("image-upload").click()}
          className="w-32 h-32 rounded-full cursor-pointer mb-4 object-cover border border-gray-300"
          alt="Avatar"
        />
        {!image && (
          <button
            type="button"
            onClick={() => document.getElementById("image-upload").click()}
            className="absolute bottom-4 right-0 p-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition-colors cursor-pointer"
            aria-label="Upload Image"
          >
            <FaCamera className="text-sm" />
          </button>
        )}
        {croppedImage && (
          <button
            type="button"
            onClick={handleReCrop}
            className="absolute bottom-4 left-0 p-2 bg-gray-600 text-white rounded-full shadow hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Re-Crop Image"
          >
            <FaCut className="text-sm" />
          </button>
        )}
      </div>
      <div className="w-full text-center">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      {isCropping && image && (
        <div className="relative w-full h-[200px] mt-4 border border-gray-200 rounded overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <button
            type="button"
            onClick={showCroppedImage}
            className="absolute bottom-2 right-2 p-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition-colors cursor-pointer z-10"
            aria-label="Crop Image"
          >
            <FaCut className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploaderWithCrop;
