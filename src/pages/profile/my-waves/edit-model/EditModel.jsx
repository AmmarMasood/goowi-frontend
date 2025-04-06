import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Typography,
  Tag,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateWave } from "../../../../services/waves";
import ImageUploader from "../../../../components/ImageUploader/ImageUploader";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const UpdateWaveModal = ({
  open,
  onClose,
  waveInfo,
  charities,
  onUpdateSuccess,
}) => {
  const messageApi = message.useMessage()[0];
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (waveInfo && open) {
      // Initialize form with current wave info
      form.setFieldsValue({
        title: waveInfo.title,
        shortDescription: waveInfo.shortDescription,
        longDescription: waveInfo.longDescription,
        causeName: waveInfo.causeName,
        charityId: waveInfo.charityId._id,
        supportTypes: waveInfo.supportTypes,
        location: waveInfo.location,
        eventLink: waveInfo.eventLink,
        imageUrls: waveInfo.imageUrls,
        hashtag: waveInfo.hashtag,
        allowComments: waveInfo.allowComments !== false, // Default to true if not specified
      });

      // Initialize tags
      setTags(waveInfo.tags || []);
    }
  }, [waveInfo, open, form]);

  // Image upload handling
  const onPfpUpload = (urls) => {
    form.setFieldsValue({ imageUrls: urls });
  };

  // Tag handling
  const handleTagInputChange = (e) => {
    setTagInputValue(e.target.value);
  };

  const handleTagInputConfirm = () => {
    if (tagInputValue && !tags.includes(tagInputValue)) {
      const newTags = [...tags, tagInputValue];
      setTags(newTags);
    }
    setTagInputVisible(false);
    setTagInputValue("");
  };

  const showTagInput = () => {
    setTagInputVisible(true);
  };

  const handleTagClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const finalValues = {
        ...values,
        tags,
        _id: waveInfo._id, // Ensure we have the wave ID for the update
      };

      const res = await updateWave(finalValues);
      if (res.success) {
        messageApi.success("Wave updated successfully!");
        onUpdateSuccess(); // Call the success callback to refresh the wave list
      } else {
        messageApi.error("Failed to update wave");
      }
    } catch (error) {
      console.error("Update wave error:", error);
      messageApi.error("Please check the form and try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Update Wave</Title>}
      open={open}
      onCancel={() => onClose(false)}
      width={800}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Update Wave
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <Form.Item
              name="title"
              label="Wave Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Give your wave a compelling title" />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label="Short Description"
              rules={[
                {
                  required: true,
                  message: "Please provide a brief description",
                },
              ]}
            >
              <Input
                placeholder="A brief summary (100 characters max)"
                maxLength={100}
              />
            </Form.Item>

            <Form.Item name="longDescription" label="Full Description">
              <TextArea
                placeholder="Describe your wave in detail"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="causeName"
              label="Cause Name"
              rules={[{ required: true, message: "Please specify the cause" }]}
            >
              <Input placeholder="What cause are you supporting?" />
            </Form.Item>

            <Form.Item
              name="charityId"
              label="Select Charity"
              rules={[{ required: true, message: "Please select a charity" }]}
            >
              <Select
                placeholder="Select the charity for this wave"
                disabled={true}
              >
                {charities.map((charity) => (
                  <Option value={charity._id} key={charity._id}>
                    {charity.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Right Column */}
          <div>
            <Form.Item
              name="supportTypes"
              label="Support Types"
              rules={[
                { required: true, message: "Select at least one support type" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="How will you support this cause?"
              >
                <Option value="volunteering">Volunteering</Option>
                <Option value="donation">Donation</Option>
                <Option value="sponsorship">Sponsorship</Option>
                <Option value="endorsement">Endorsement</Option>
                <Option value="in-kind">In-Kind Support</Option>
              </Select>
            </Form.Item>

            <Form.Item name="location" label="Location">
              <Input placeholder="Where is this wave taking place?" />
            </Form.Item>

            <Form.Item name="eventLink" label="Event Link">
              <Input placeholder="Link to event page or website" />
            </Form.Item>

            <div className="mb-4">
              <Text className="block mb-2">Tags</Text>
              <div className="flex flex-wrap gap-2 border p-2 rounded">
                {tags.map((tag) => (
                  <Tag key={tag} closable onClose={() => handleTagClose(tag)}>
                    {tag}
                  </Tag>
                ))}
                {tagInputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    className="w-24"
                    value={tagInputValue}
                    onChange={handleTagInputChange}
                    onBlur={handleTagInputConfirm}
                    onPressEnter={handleTagInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Tag
                    onClick={showTagInput}
                    className="border-dashed cursor-pointer"
                  >
                    <PlusOutlined /> Add Tag
                  </Tag>
                )}
              </div>
            </div>

            <Form.Item name="hashtag" label="Primary Hashtag">
              <Input placeholder="Main hashtag" addonBefore="#" />
            </Form.Item>

            {/* <Form.Item
              name="allowComments"
              label="Allow Comments"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item> */}
          </div>
        </div>

        {/* Image Upload - Full Width */}
        <Form.Item name="imageUrls" label="Images">
          <ImageUploader
            height={500}
            width={500}
            onUploadSuccess={onPfpUpload}
            initialImages={form.getFieldValue("imageUrls")}
            maxImages={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWaveModal;
