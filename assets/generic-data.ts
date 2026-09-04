export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    specialization: string;
    tagline: string;
    about: string;
  };
  contact: {
    email: string;
    resumeUrl: string;
    github: string;
    linkedin: string;
    phone?: string;
    twitter?: string;
  };
  skillsList: string[];
  skillCategories: SkillCategory[];
}

export const PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: "Akash Gupta",
    role: "Web Developer / Frontend Developer",
    specialization:
      "Modern web development with React.js, Next.js, JavaScript & TypeScript, along with hands-on experience in WordPress, Shopify and Webflow.",
    tagline:
      "Crafting fast, responsive, and high-conversion web experiences from development to production.",
    about:
      "A versatile Web Developer specializing in modern frontend development with React and Next.js, with additional expertise in WordPress, Shopify and Webflow. Experienced in building responsive web experiences, integrating APIs, developing features, solving complex UI and functional issues, and handling projects from development through production.",
  },
  contact: {
    email: "kunal@example.com",
    resumeUrl: "/resume.pdf",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    phone: "",
    twitter: "",
  },
  skillsList: [
    "React.js",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "HTML5 / CSS3",
    "Responsive Web Design",
    "UI Development & UI/UX Improvements",
    "REST API Integration",
    "Authentication & User Flows",
    "Forms & Form Validation",
    "Subscription & Usage/Credit Systems",
    "Third-party API Integration",
    "Git & GitHub",
    "Linux / Ubuntu",
    "npm / Node.js ecosystem",
    "Production Builds & Deployment",
    "Debugging & Bug Fixing",
    "Performance & Code Optimization",
    "WordPress",
    "Shopify",
    "Webflow",
    "CMS & E-commerce Website Development",
    "Feature Development & Enhancement",
  ],
  skillCategories: [
    {
      category: "Frontend & Frameworks",
      skills: [
        "React.js",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "HTML5 / CSS3",
        "Responsive Web Design",
        "UI Development & UI/UX Improvements",
      ],
    },
    {
      category: "API & Backend Integration",
      skills: [
        "REST API Integration",
        "Authentication & User Flows",
        "Forms & Form Validation",
        "Subscription & Credit Systems",
        "Third-party API Integration",
      ],
    },
    {
      category: "CMS & E-commerce",
      skills: [
        "WordPress",
        "Shopify",
        "Webflow",
        "CMS Development",
        "E-commerce Websites",
      ],
    },
    {
      category: "Tools & DevOps",
      skills: [
        "Git & GitHub",
        "Linux / Ubuntu",
        "npm / Node.js ecosystem",
        "Production Builds & Deployment",
        "Debugging & Bug Fixing",
        "Performance Optimization",
      ],
    },
  ],
};
