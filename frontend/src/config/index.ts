import { ControlItemType } from "@/types";

export const signUpFormControls: ControlItemType[] = [
    {
      name: "userName",
      label: "User Name",
      placeholder: "Enter your user name",
      type: "text",
      componentType: "input",
    },
    {
      name: "userEmail",
      label: "User Email",
      placeholder: "Enter your user email",
      type: "email",
      componentType: "input",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      componentType: "input",
    },
  ];
  
export const signInFormControls: ControlItemType[] = [
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];
  
export const initialSignInFormData = {
  userEmail: "",
  password: "",
};
  
export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
};

export interface courseFilterOptionType {
  id: string;
  label: string;
}
export const courseLevelOptions: courseFilterOptionType[] = [
  { id: "BEGINNER", label: "Beginner" },
  { id: "INTERMEDIATE", label: "Intermediate" },
  { id: "ADVANCED", label: "Advanced" },
];

export const courseCategories: courseFilterOptionType[] = [
  { id: "web-development", label: "Web Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "cyber-security", label: "Cyber Security" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "game-development", label: "Game Development" },
  { id: "software-engineering", label: "Software Engineering" },
];

export const courseLandingPageFormControls: ControlItemType[] = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories,
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course description",
  },
  {
    name: "price",
    label: "Price",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  description: "",
  price: 0,
  image: null,
  imageUrl: ""
};  

interface courseCurriculumInitialFormDataType {
  id?: string;
  title: string;
  description: string;
  publicId?: string
  video: File | null;
  videoUrl: string;
  preview: boolean;
  isEdited?: boolean
}
export const courseCurriculumInitialFormData: courseCurriculumInitialFormDataType[] = [
  {
    title: "",
    description: "",
    video: null,
    videoUrl: "", // File Preview Url
    preview: false,
  },
];

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
};