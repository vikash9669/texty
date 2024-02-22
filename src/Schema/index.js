import * as Yup from "yup";
export const SignIn = Yup.object({
  email: Yup.string().email().required("Enter your email"),
  password: Yup.string().min(6).required("Enter your password"),
});
export const SignUp = Yup.object({
  fullName: Yup.string().min(2).max(30).required("Enter your name"),
  email: Yup.string().email().required("Enter your email"),
  password: Yup.string().min(6).required("Enter your password"),
});
