import React, { useEffect, useState } from "react";
import {
  Form,
  Steps,
  Button,
  Input,
  Select,
  Switch,
  Upload,
  Divider,
  Tag,
  Typography,
  Card,
  Alert,
  message,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { getCharities } from "../../services/profile";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { createWave } from "../../services/waves";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const { Step } = Steps;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const CreateWave = () => {
  const [form] = Form.useForm();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [isCharity, setIsCharity] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  useEffect(() => {
    if (userDetails && userDetails.role === "charity") {
      setIsCharity(true);
    }
  }, [userDetails]);

  const onPfpUpload = (urls) => {
    console.log("urls", urls);
    form.setFieldsValue({ imageUrls: urls });
  };

  const fetchCharities = async () => {
    const res = await getCharities();
    if (res.data) {
      setCharities(res.data);
    } else {
      message.error("Unable to fetch charities");
    }
  };

  // Step navigation functions
  const nextStep = (e) => {
    e.preventDefault();

    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prevStep = (e) => {
    e.preventDefault();

    setCurrentStep(currentStep - 1);
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

  // Form submission - FIXED
  const onFinish = async () => {
    // Get the form values directly
    const formValues = form.getFieldsValue(true);

    // Combine with tags
    let finalValues = {
      ...formValues,
      tags,
    };
    if (isCharity) {
      finalValues.charityId = userDetails._id;
      finalValues.charityApprovalStatus = "approved";
    }

    const res = await createWave(finalValues);
    if (res.success) {
      message.success("Wave created successfully!");
      form.resetFields();
      navigate("/profile?type=waves", { replace: true });
    } else {
      message.error("Failed to create wave. Please try again.");
    }
  };

  // Steps content
  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="p-6">
          <Title level={4}>Basic Wave Information</Title>
          <Text className="text-gray-500 mb-6 block">
            Fill in the fundamental details about your wave
          </Text>

          <Form.Item
            name="title"
            label="Wave Title"
            rules={[
              { required: true, message: "Please enter a title for your wave" },
            ]}
          >
            <Input placeholder="Give your wave a compelling title" />
          </Form.Item>

          <Form.Item
            name="shortDescription"
            label="Short Description"
            rules={[
              { required: true, message: "Please provide a brief description" },
            ]}
          >
            <Input
              placeholder="A brief summary of your wave (100 characters max)"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item name="longDescription" label="Full Description">
            <TextArea
              placeholder="Describe your wave in detail"
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Cause & Support",
      content: (
        <div className="p-6">
          <Title level={4}>Cause & Support Details</Title>
          <Text className="text-gray-500 mb-6 block">
            Tell us about the cause you're supporting and how
          </Text>

          <Form.Item
            name="causeName"
            label="Cause Name"
            rules={[{ required: true, message: "Please specify the cause" }]}
          >
            <Input placeholder="What cause are you supporting?" />
          </Form.Item>

          {!isCharity && (
            <Form.Item
              name="charityId"
              label="Select Charity"
              rules={[
                {
                  required: true,
                  message:
                    "Please select the chartity which is related to the wave",
                },
              ]}
            >
              <Select placeholder="Select the charity associated with this wave">
                {charities.map((charity, index) => (
                  <Option value={charity._id} key={index}>
                    {charity.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

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
        </div>
      ),
    },
    {
      title: "Media",
      content: (
        <div className="p-6">
          <Title level={4}>Media</Title>
          <Text className="text-gray-500 mb-6 block">
            Add media to your wave
          </Text>

          <Form.Item name="imageUrls" label="Images">
            <ImageUploader
              height={500}
              width={500}
              onUploadSuccess={onPfpUpload}
              maxImages={3}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Tags & Settings",
      content: (
        <div className="p-6">
          <Title level={4}>Tags & Additional Settings</Title>
          <Text className="text-gray-500 mb-6 block">
            Add tags and configure additional settings for your wave
          </Text>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
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
            <Input placeholder="Main hashtag for your wave" addonBefore="#" />
          </Form.Item>

          {/* <Form.Item
            name="allowComments"
            label="Allow Comments"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item> */}
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div className="p-6">
          <Title level={4}>Review Your Wave</Title>
          <Text className="text-gray-500 mb-6 block">
            Review the information before submitting your wave
          </Text>

          <Card className="mb-4">
            <div className="flex justify-between mb-2">
              <Title level={4}>
                {form.getFieldValue("title") || "Wave Title"}
              </Title>
            </div>
            <p>
              {form.getFieldValue("shortDescription") ||
                "No description provided"}
            </p>

            <Divider orientation="left">Cause Information</Divider>
            <p>
              <strong>Cause:</strong>{" "}
              {form.getFieldValue("causeName") || "Not specified"}
            </p>
            <p>
              <strong>Support Types:</strong>{" "}
              {(form.getFieldValue("supportTypes") || []).join(", ") ||
                "None selected"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {form.getFieldValue("location") || "Not specified"}
            </p>

            <Divider orientation="left">Tags & Media</Divider>
            <div className="flex gap-2 mb-4">
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {form.getFieldValue("hashtag") && (
                <Tag color="blue">#{form.getFieldValue("hashtag")}</Tag>
              )}
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <PictureOutlined style={{ fontSize: "24px" }} />
                <p>{form.getFieldValue("imageUrls")?.length ?? 0} Images</p>
              </div>
            </div>
          </Card>

          <Alert
            message="Almost there!"
            description="After submission, your wave will be reviewed by the charity before it's published."
            type="info"
            showIcon
            className="mb-6"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h1 className="text-gray-900 text-3xl font-bold">Create a new wave</h1>
      <h3 className="text-gray-500 mb-4 text-xl">
        Create a new wave and make a difference in the world
      </h3>
      <div className="mt-6 p-3">
        <Steps current={currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="create-wave-form"
        >
          <div className="steps-content">{steps[currentStep].content}</div>

          <div className="steps-action p-6 flex justify-between">
            {currentStep > 0 && <Button onClick={prevStep}>Previous</Button>}
            {currentStep === 0 && (
              <div></div> // Empty div for flex spacing when no previous button
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  // Validate and submit manually
                  form
                    .validateFields()
                    .then(() => {
                      onFinish();
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info);
                    });
                }}
              >
                Create Wave
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateWave;
