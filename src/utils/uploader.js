import axios from "axios";

/**
 * Resize and optimize an image before uploading
 * @param {File} file - Image file from input
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {Promise<File>} - Resized Blob image
 */
const resizeImage = (file, width, height) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.8
        );
      };
    };

    reader.onerror = (error) => reject(error);
  });
};

/**
 * Upload Image to Cloudinary with Custom Sizes
 * @param {File} file - Image file from input
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadToCloudinary = async (file, width = 800, height = 800) => {
  try {
    const optimizedFile = await resizeImage(file, width, height);

    const formData = new FormData();
    formData.append("file", optimizedFile);
    formData.append("upload_preset", "goowi-media"); // Replace with Cloudinary preset
    formData.append("cloud_name", "dhpispmtz");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dhpispmtz/image/upload`,
      formData
    );

    return response.data.secure_url; // Return Cloudinary secure URL
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};
