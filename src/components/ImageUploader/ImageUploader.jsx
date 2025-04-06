import React, { useEffect, useState } from "react";
import { Upload, message, Spin, Button, Image, Space } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../utils/uploader";

const ImageUploader = ({
  onUploadSuccess,
  height,
  width,
  initialImages = [],
  maxImages = 5,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImageUrls(initialImages || []);
      console.log("initialImages", initialImages);
    }
  }, [initialImages]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    if (imageUrls.length >= maxImages) {
      message.error(`You can only upload a maximum of ${maxImages} images!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = async ({ file }) => {
    setLoading(true);
    try {
      const link = await uploadToCloudinary(file, width, height);
      setLoading(false);

      // Add the new image URL to the array
      const updatedUrls = [...imageUrls, link];
      setImageUrls(updatedUrls);

      message.success("Upload successful!");
      if (onUploadSuccess) {
        onUploadSuccess(updatedUrls);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error("Upload failed.");
    }
  };

  const removeImage = (index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);

    if (onUploadSuccess) {
      onUploadSuccess(updatedUrls);
    }
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Display existing images */}
        {imageUrls.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imageUrls.map((url, index) => (
              <div
                key={index}
                style={{ position: "relative", marginBottom: "10px" }}
              >
                <Image width={100} src={url} />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "rgba(255, 255, 255, 0.7)",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        {loading ? (
          <Spin />
        ) : (
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            disabled={imageUrls.length >= maxImages}
          >
            <Button disabled={imageUrls.length >= maxImages}>
              <UploadOutlined />{" "}
              {imageUrls.length === 0 ? "Click to Upload" : "Upload More"}
            </Button>
          </Upload>
        )}

        {imageUrls.length > 0 && (
          <div>
            <small>{`${imageUrls.length} of ${maxImages} images uploaded`}</small>
          </div>
        )}
      </Space>
    </div>
  );
};

export default ImageUploader;
