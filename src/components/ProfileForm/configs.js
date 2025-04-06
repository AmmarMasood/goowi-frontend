export const industryOptions = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Retail",
  "Manufacturing",
  "Non-Profit",
  "Other",
];
export const supportTypeOptions = [
  "Volunteering",
  "Donations",
  "Sponsorships",
  "Endorsements",
  "In-Kind Support",
];
export const causeOptions = [
  "Environment",
  "Health",
  "Education",
  "Poverty",
  "Children",
  "Animals",
  "Human Rights",
  "Disaster Relief",
];
export const certificationOptions = [
  "B-Corp",
  "1% for the Planet",
  "Fair Trade",
  "LEED",
  "Energy Star",
  "Carbon Neutral",
];

export const UserRole = {
  ADMIN: "admin",
  COMPANY: "company",
  PERSON: "person",
  CHARITY: "charity",
};

export const currentStepFields = {
  [UserRole.COMPANY]: [
    // Step 1 - Company basic info
    [
      "name",
      "shortDescription",
      "industry",
      "location",
      "phone",
      "overview",
      "website",
      "address",
    ],
    // Step 2 - Company social impact
    [
      "socialMediaLinks",
      "values",
      "supportTypes",
      "causesSupported",
      "bannerImage",
      "logoImage",
      "certifications",
    ],
  ],
  [UserRole.PERSON]: [
    // Step 1 - Person basic info
    ["name", "shortDescription", "location", "overview", "phone"],
    // Step 2 - Person social impact
    [
      "socialMediaLinks",
      "values",
      "supportTypes",
      "causesSupported",
      "logoImage", // Profile picture
    ],
  ],
  [UserRole.CHARITY]: [
    // Step 1 - Charity basic info
    [
      "name",
      "shortDescription",
      "industry", // Category of charity
      "location",
      "phone",
      "overview",
      "website",
      "address",
    ],
    // Step 2 - Charity specific info
    [
      "socialMediaLinks",
      "values",
      "causesSupported", // Main causes the charity works on
      "bannerImage",
      "logoImage",
      "certifications",
      "impactMetrics", // How they measure impact
    ],
  ],
  [UserRole.ADMIN]: [
    // Admin steps - simplified for admin accounts
    ["name", "overview"],
    ["logoImage"],
  ],
};

export const stepConfig = {
  [UserRole.COMPANY]: [
    {
      title: "Company Details",
      description: "Basic organization information",
    },
    { title: "Social Impact", description: "Values and contributions" },
  ],
  [UserRole.PERSON]: [
    { title: "Personal Info", description: "Your basic details" },
    { title: "Social Impact", description: "Causes and contributions" },
  ],
  [UserRole.CHARITY]: [
    {
      title: "Organization Details",
      description: "Basic charity information",
    },
    { title: "Impact & Focus", description: "Causes and metrics" },
  ],
  [UserRole.ADMIN]: [
    { title: "Admin Info", description: "Basic details" },
    { title: "Profile Image", description: "Admin profile" },
  ],
};
