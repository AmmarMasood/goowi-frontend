import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Steps,
  Card,
  Row,
  Col,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  causeOptions,
  currentStepFields,
  industryOptions,
  stepConfig,
  UserRole,
} from "./configs";
import ImageUploader from "../ImageUploader/ImageUploader.jsx";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const ProfileForm = ({
  onSubmit,
  initialValues = {},
  loading = false,
  error = null,
  userRole = UserRole.PERSON,
  mode = "create", // "create" or "update"
  formTitle = "Complete Your Profile",
  submitButtonText = "Submit",
  showSteps = true,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [socialMediaLinks, setSocialMediaLinks] = useState([""]);
  const [values, setValues] = useState([""]);
  const [supportTypes, setSupportTypes] = useState([]);
  const [causesSupported, setCausesSupported] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log("errror", error);
  }, [error]);

  // Initialize form with values if in update mode
  useEffect(() => {
    if (mode === "update" && Object.keys(initialValues).length > 0) {
      console.log("initialValues 321", initialValues);
      form.setFieldsValue(initialValues);

      // Initialize arrays from initial values
      if (
        initialValues.socialMediaLinks &&
        initialValues.socialMediaLinks.length > 0
      ) {
        setSocialMediaLinks(initialValues.socialMediaLinks);
      }

      if (initialValues.values && initialValues.values.length > 0) {
        setValues(initialValues.values);
      }

      if (initialValues.supportTypes && initialValues.supportTypes.length > 0) {
        setSupportTypes(initialValues.supportTypes);
      }

      if (
        initialValues.causesSupported &&
        initialValues.causesSupported.length > 0
      ) {
        setCausesSupported(initialValues.causesSupported);
      }
    }
  }, [initialValues, mode, form]);

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      // Validate fields of current step
      const values = await form.validateFields(currentStepFields[currentStep]);

      // Store the values from current step
      setFormData({
        ...formData,
        ...values,
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const addField = (field, setField) => {
    setField([...field, ""]);
  };

  const removeField = (field, setField, index) => {
    const newFields = [...field];
    newFields.splice(index, 1);
    setField(newFields);
  };

  const updateField = (field, setField, index, value) => {
    const newFields = [...field];
    newFields[index] = value;
    setField(newFields);
  };

  // Role-specific step titles and descriptions
  const getSteps = () => stepConfig[userRole] || stepConfig[UserRole.PERSON];

  const getRoleTitle = () => {
    switch (userRole) {
      case UserRole.COMPANY:
        return `${
          mode === "create" ? "Complete" : "Update"
        } Your Company Profile`;
      case UserRole.PERSON:
        return `${
          mode === "create" ? "Complete" : "Update"
        } Your Personal Profile`;
      case UserRole.CHARITY:
        return `${
          mode === "create" ? "Complete" : "Update"
        } Your Charity Profile`;
      case UserRole.ADMIN:
        return `${
          mode === "create" ? "Complete" : "Update"
        } Your Admin Profile`;
      default:
        return formTitle;
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      // Construct profile data based on role
      const completeFormData = {
        ...formData,
        ...data,
        socialMediaLinks,
        values: values || [],
        supportTypes: supportTypes || [],
        causesSupported: causesSupported || [],
      };

      // Call the provided onSubmit function with the form data
      await onSubmit(completeFormData);
    } catch (err) {
      console.error(err);
    }
  };

  // Custom components for different user types
  const renderImpactMetricsForCharity = () => {
    // if (userRole !== UserRole.CHARITY) return null;
    return null;

    // return (
    //   <div className="mb-6">
    //     <Form.Item
    //       name="impactMetrics"
    //       label="Impact Metrics"
    //       help="Define how you measure your impact (e.g., trees planted, meals served, etc.)"
    //     >
    //       <TextArea
    //         rows={4}
    //         placeholder="Describe how your organization measures impact..."
    //       />
    //     </Form.Item>
    //   </div>
    // );
  };

  const onPfpUpload = (urls) => {
    form.setFieldsValue({ logoImage: urls[0] });
  };

  const onBannerUpload = (urls) => {
    form.setFieldsValue({ bannerImage: urls[0] });
  };

  const moveInArray = (value) => {
    if (value) {
      return [value];
    } else {
      return null;
    }
  };

  return (
    <Card
      className={`w-full ${
        mode === "create" ? "shadow-lg" : "!shadow-none !border-none"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4 text-center">
        {mode === "create" ? "Welcome to Goowi!" : "Update Your Profile"}
      </h1>
      <h2 className="text-xl font-medium mb-8 text-center">{getRoleTitle()}</h2>

      {showSteps && (
        <Steps current={currentStep} className="mb-8">
          {getSteps().map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
        </Steps>
      )}

      <Form
        name="profile"
        onFinish={handleFormSubmit}
        layout="vertical"
        form={form}
        autoComplete="off"
        initialValues={initialValues}
      >
        {/* Step 1: Basic Information - All User Types */}
        {(!showSteps || currentStep === 0) && (
          <>
            {userRole !== UserRole.PERSON && (
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label={
                      userRole === UserRole.PERSON
                        ? "Full Name"
                        : "Organization Name"
                    }
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input
                      placeholder={
                        userRole === UserRole.PERSON
                          ? "e.g., John Smith"
                          : "e.g., Goowi Inc."
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="shortDescription"
                  label="One-Liner Description"
                  rules={[
                    {
                      required: true,
                      message: "Please provide a short description",
                    },
                  ]}
                >
                  <Input
                    placeholder={
                      userRole === UserRole.PERSON
                        ? "e.g., Environmental advocate and volunteer"
                        : "e.g., Connecting companies, people, and charities for social good"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {(userRole === UserRole.COMPANY ||
              userRole === UserRole.CHARITY) && (
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="industry"
                    label={
                      userRole === UserRole.CHARITY ? "Category" : "Industry"
                    }
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Select
                      placeholder={`Select your ${
                        userRole === UserRole.CHARITY ? "category" : "industry"
                      }`}
                    >
                      {industryOptions.map((industry) => (
                        <Option key={industry} value={industry}>
                          {industry}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your location",
                      },
                    ]}
                  >
                    <Input placeholder="e.g., New York, USA" />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {userRole === UserRole.PERSON && (
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your location",
                      },
                    ]}
                  >
                    <Input placeholder="e.g., New York, USA" />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={24}>
              <Col span={userRole === UserRole.PERSON ? 24 : 12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: false,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input placeholder="+1 (123) 456-7890" />
                </Form.Item>
              </Col>

              {(userRole === UserRole.COMPANY ||
                userRole === UserRole.CHARITY) && (
                <Col span={12}>
                  <Form.Item
                    name="website"
                    label="Website"
                    rules={[
                      { type: "url", message: "Please enter a valid URL" },
                      { required: false },
                    ]}
                  >
                    <Input placeholder="https://www.example.com" />
                  </Form.Item>
                </Col>
              )}
            </Row>

            {(userRole === UserRole.COMPANY ||
              userRole === UserRole.CHARITY) && (
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                      {
                        required: false,
                        message: "Please enter your address",
                      },
                    ]}
                  >
                    <Input placeholder="123 Main St, City, Country" />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="overview"
                  label="Overview (Longer Description)"
                  rules={[
                    {
                      required: false,
                      message: "Please provide an overview",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder={
                      userRole === UserRole.PERSON
                        ? "Tell us about yourself, your interests, and what causes you're passionate about..."
                        : "Tell us about your organization's mission and vision..."
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Step 2: Social Impact - Role Specific */}
        {(!showSteps || currentStep === 1) && (
          <>
            <Divider orientation="left">Social Media</Divider>
            <div className="mb-6">
              <label className="block mb-2">Social Media Links</label>
              {socialMediaLinks.map((link, index) => (
                <div key={index} className="flex mb-2">
                  <Input
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={link}
                    onChange={(e) =>
                      updateField(
                        socialMediaLinks,
                        setSocialMediaLinks,
                        index,
                        e.target.value
                      )
                    }
                    className="mr-2"
                  />
                  {index > 0 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() =>
                        removeField(
                          socialMediaLinks,
                          setSocialMediaLinks,
                          index
                        )
                      }
                    />
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => addField(socialMediaLinks, setSocialMediaLinks)}
                block
                icon={<PlusOutlined />}
              >
                Add Social Media Link
              </Button>
            </div>

            <Divider orientation="left">Values & Impact</Divider>
            <div className="mb-6">
              <label className="block mb-2">Core Values</label>
              {values.map((value, index) => (
                <div key={index} className="flex mb-2">
                  <Input
                    placeholder="e.g., Sustainability, Transparency, Equality"
                    value={value}
                    onChange={(e) =>
                      updateField(values, setValues, index, e.target.value)
                    }
                    className="mr-2"
                  />
                  {index > 0 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeField(values, setValues, index)}
                    />
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => addField(values, setValues)}
                block
                icon={<PlusOutlined />}
              >
                Add Value
              </Button>
            </div>

            <Form.Item
              name="causesSupported"
              label={
                userRole === UserRole.CHARITY
                  ? "Focus Areas"
                  : "Causes Supported"
              }
            >
              <Select
                mode="multiple"
                placeholder={`Select ${
                  userRole === UserRole.CHARITY
                    ? "causes your organization focuses on"
                    : "causes you support"
                }`}
                onChange={setCausesSupported}
                style={{ width: "100%" }}
                value={causesSupported}
              >
                {causeOptions.map((cause) => (
                  <Option key={cause} value={cause}>
                    {cause}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Charity-specific impact metrics */}
            {renderImpactMetricsForCharity()}

            <Divider orientation="left">
              {userRole === UserRole.PERSON
                ? "Profile Picture"
                : "Visual Identity"}
            </Divider>

            <Row gutter={24}>
              <Col span={userRole === UserRole.PERSON ? 24 : 12}>
                <Form.Item
                  name="logoImage"
                  label={
                    userRole === UserRole.PERSON
                      ? "Profile Picture"
                      : "Logo Image"
                  }
                  valuePropName="fileList"
                >
                  <ImageUploader
                    height={100}
                    width={100}
                    onUploadSuccess={onPfpUpload}
                    initialImages={
                      moveInArray(initialValues?.logoImage) ||
                      moveInArray(form.getFieldValue("logoImage")) ||
                      []
                    }
                    maxImages={1}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="bannerImage"
                  label="Banner Image"
                  valuePropName="fileList"
                >
                  <ImageUploader
                    height={800}
                    width={800}
                    onUploadSuccess={onBannerUpload}
                    initialImages={
                      moveInArray(initialValues?.bannerImage) ||
                      moveInArray(form.getFieldValue("bannerImage")) ||
                      []
                    }
                    maxImages={1}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <div className="flex justify-between mt-8">
          {showSteps && currentStep > 0 && (
            <Button onClick={handlePrevious}>Previous</Button>
          )}
          {showSteps && currentStep < 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" loading={loading}>
              {submitButtonText}
            </Button>
          )}
        </div>
      </Form>
      {error && <div className="text-red-500 mt-4">{error.message}</div>}
    </Card>
  );
};

export default ProfileForm;
