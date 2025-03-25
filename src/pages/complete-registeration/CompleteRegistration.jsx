import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Divider,
  Steps,
  message,
  Card,
  Row,
  Col,
  Radio,
} from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  causeOptions,
  certificationOptions,
  currentStepFields,
  industryOptions,
  stepConfig,
  supportTypeOptions,
  UserRole,
} from "./configs";
import CompleteVerificationPopup from "../../components/CompleteVerificationPopup/CompleteVerificationPopup";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const CompleteRegistration = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [socialMediaLinks, setSocialMediaLinks] = useState([""]);
  const [values, setValues] = useState([""]);
  const [supportTypes, setSupportTypes] = useState([]);
  const [causesSupported, setCausesSupported] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const { user, userDetails } = useAuth();
  const navigate = useNavigate();

  // Extract user role from context
  const userRole = user?.role || UserRole.PERSON;

  // Options for different select fields

  useEffect(() => {
    // Set form initial values based on user data if available
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (userDetails && userDetails.isVerified === false) {
      setIsEmailVerified(false);
    }
  }, [userDetails]);

  const handleNext = async () => {
    try {
      // Validate fields of current step
      await form.validateFields(currentStepFields[currentStep]);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Define fields for each step based on user role

  // Default to person if role not found
  // eslint-disable-next-line no-unused-vars
  const roleSpecificFields =
    currentStepFields[userRole] || currentStepFields[UserRole.PERSON];

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
        return "Complete Your Company Profile";
      case UserRole.PERSON:
        return "Complete Your Personal Profile";
      case UserRole.CHARITY:
        return "Complete Your Charity Profile";
      case UserRole.ADMIN:
        return "Complete Your Admin Profile";
      default:
        return "Complete Your Profile";
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Construct profile data based on role
      const profileData = {
        ...values,
        socialMediaLinks,
        values: values.values || [],
        supportTypes: supportTypes || [],
        causesSupported: causesSupported || [],
        // Generate slug from name
        slug: values.name.toLowerCase().replace(/\s+/g, "-"),
        // Add user ID and role
        userId: user?._id,
        role: userRole,
      };

      console.log("Completed profile data:", profileData);

      // Here you would send this data to your backend
      // const response = await yourApiService.createProfile(profileData);

      message.success("Profile completed successfully!");
      navigate("/dashboard"); // Redirect after successful completion
    } catch (err) {
      setError(err);
      console.error(err);
      message.error("Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  // Custom components for different user types
  const renderImpactMetricsForCharity = () => {
    if (userRole !== UserRole.CHARITY) return null;

    return (
      <div className="mb-6">
        <Form.Item
          name="impactMetrics"
          label="Impact Metrics"
          help="Define how you measure your impact (e.g., trees planted, meals served, etc.)"
        >
          <TextArea
            rows={4}
            placeholder="Describe how your organization measures impact..."
          />
        </Form.Item>
      </div>
    );
  };

  const renderCertifications = () => {
    if (userRole === UserRole.PERSON) return null;

    return (
      <div className="mb-6">
        <Form.Item name="certifications" label="Certifications">
          <Select
            mode="multiple"
            placeholder="Select any certifications your organization has"
            style={{ width: "100%" }}
          >
            {certificationOptions.map((cert) => (
              <Option key={cert} value={cert}>
                {cert}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    );
  };

  const onCompleteVerification = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen py-12 px-12 flex items-center justify-center w-full">
      {!isEmailVerified && (
        <CompleteVerificationPopup
          onCompleteVerification={onCompleteVerification}
        />
      )}
      {console.log("User Details:", userDetails)}
      <Card className="w-full shadow-lg">
        {console.log("Current Step:", user)}
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to Goowi!
        </h1>
        <h2 className="text-xl font-medium mb-8 text-center">
          {getRoleTitle()}
        </h2>

        <Steps current={currentStep} className="mb-8">
          {getSteps().map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
        </Steps>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={
            {
              // Default values if needed
            }
          }
        >
          {/* Step 1: Basic Information - All User Types */}
          {currentStep === 0 && (
            <>
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
                          userRole === UserRole.CHARITY
                            ? "category"
                            : "industry"
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
                        required: true,
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
                          required: true,
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
                      { required: true, message: "Please provide an overview" },
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
          {currentStep === 1 && (
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
                  onClick={() =>
                    addField(socialMediaLinks, setSocialMediaLinks)
                  }
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

              {userRole !== UserRole.CHARITY && (
                <Form.Item name="supportTypes" label="Types of Support Given">
                  <Select
                    mode="multiple"
                    placeholder="Select types of support you provide"
                    onChange={setSupportTypes}
                    style={{ width: "100%" }}
                  >
                    {supportTypeOptions.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

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

              {/* Certifications for Companies and Charities */}
              {renderCertifications()}

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
                    getValueFromEvent={(e) => e && e.fileList}
                  >
                    <Upload
                      name="logo"
                      listType="picture"
                      maxCount={1}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>
                        Upload{" "}
                        {userRole === UserRole.PERSON
                          ? "Profile Picture"
                          : "Logo"}
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
                {userRole !== UserRole.PERSON && (
                  <Col span={12}>
                    <Form.Item
                      name="bannerImage"
                      label="Banner Image"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => e && e.fileList}
                    >
                      <Upload
                        name="banner"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>Upload Banner</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button onClick={handlePrevious}>Previous</Button>
            )}
            {currentStep < 1 ? (
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" loading={loading}>
                Complete Registration
              </Button>
            )}
          </div>
        </Form>
        {error && <div className="text-red-500 mt-4">{error.message}</div>}
      </Card>
    </div>
  );
};

export default CompleteRegistration;
