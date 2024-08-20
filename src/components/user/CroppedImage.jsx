import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Avatar, Box, FormControl, IconButton, Input, FormErrorMessage } from '@chakra-ui/react';
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
    <Box w={{ base: "100%", md: "30%" }} p={5}>
      <Box position="relative" display="inline-block">
        <Avatar
          size="2xl"
          src={croppedImage || image || "https://via.placeholder.com/150"}
          mb={4}
          borderRadius="full"
          onClick={() => document.getElementById("image-upload").click()}
          cursor="pointer"
        />
  { !image &&     <IconButton
          icon={<FaCamera />}
          position="absolute"
          bottom={0}
          right={0}
          mb={2}
          mr={2}
          onClick={() => document.getElementById("image-upload").click()}
          cursor="pointer"
          size="sm"
          isRound
          aria-label="Upload Image"
        />}
        {croppedImage && (
          <IconButton
            icon={<FaCut />}
            position="absolute"
            bottom={0}
            left={0}
            mb={2}
            ml={2}
            onClick={handleReCrop}
            cursor="pointer"
            size="sm"
            isRound
            aria-label="Re-Crop Image"
          />
        )}
      </Box>
      <FormControl isInvalid={!!error}>
        <Input
          type="file"
          id="image-upload"
          accept="image/*"
          display="none"
          onChange={handleImageChange}
        />
        {error && <FormErrorMessage ml={16}>{error}</FormErrorMessage>}
      </FormControl>
      {isCropping && image && (
        <Box position="relative" width="70%" height="200px">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <IconButton
            icon={<FaCut />}
            position="absolute"
            bottom={2}
            right={2}
            onClick={showCroppedImage}
            aria-label="Crop Image"
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageUploaderWithCrop;
