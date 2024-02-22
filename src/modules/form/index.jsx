import React, { useState, useEffect } from "react";
import Input from "../../components/input/index";
import Button from "../../components/button/index";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, SignUp } from "../../Schema";
import { useFormik } from "formik";
import axios from "axios";

const initialValuesSignIn = {
  email: "",
  password: "",
};
const intialValuesSignUp = {
  fullName: "",
  email: "",
  password: "",
};

const Form = ({ isSignInPage }) => {
  const navigate = useNavigate();
  const [Data, setData] = useState({
    ...(!isSignInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });
  //============================================================================================================================

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: isSignInPage ? initialValuesSignIn : intialValuesSignUp,
    validationSchema: isSignInPage ? SignIn : SignUp,
    onSubmit: (values, { resetForm }) => {
      console.log(isSignInPage), sendData(values);
      resetForm({ values: "" });
      console.log("login");
    },
  });

  //-------------------------------------------------------------------------------------------------------------------------
  const sendData = async (values) => {
    console.log(values);
    const res = await axios
      .post(
        `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
        values
      )
      .then((res) => {
        if (!isSignInPage) {
          alert(res.data);
        }
        return res.data;
      })
      .catch((err) => {
        console.log(err.message);
        if (err.message == "Network Error") {
          alert("Network Error");
        } else if (err.response.status === 400 && isSignInPage) {
          alert("Invalid username or password");
        } else {
          alert("User not Registered");
        }
        throw new Error(err);
      });
    const resData = await res;
    if (isSignInPage && res) {
      localStorage.setItem("user.token", resData.token);
      localStorage.setItem("user.detail", JSON.stringify(resData.user));
      navigate("/");
    } else {
      navigate("/sign_in");
    }
  };

  return (
    <div className="bg-white h-screen flex justify-center items-center">
      <div className="bg-[#ededf5] w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className=" text-4xl font-extrabold">
          Wellcome {isSignInPage && "Back"}
        </div>
        <div className="text-xl font-bold mb-16">
          {isSignInPage ? "SignIn" : "SignUp"}
        </div>

        <form className="w-1/2 " onSubmit={handleSubmit}>
          {!isSignInPage && (
            <div>
              <Input
                label="Full name"
                type="text"
                name="fullName"
                placeholder="Enter Your Name"
                className="mb-6"
                value={values.fullName}
                onChange={handleChange}
              />
              <p className="form-error">{errors.fullName}</p>
            </div>
          )}
          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter Your Email"
              className="mb-6"
              value={values.email}
              onChange={handleChange}
            />
            <p className="form-error">{errors.email}</p>
          </div>
          <div>
            <Input
              label="Password"
              name="password"
              type="text"
              placeholder="Enter Your Password"
              className="mb-6"
              value={values.password}
              onChange={handleChange}
            />
            <p className="form-error">{errors.password}</p>
          </div>
          <Button
            label={isSignInPage ? "SignIn" : "SignUp"}
            className=" mb-3"
            type="submit"
          />
        </form>
        <div>
          {isSignInPage ? " Not Regeisterd Yet " : "Already have an account?"}
          <span className="text-primary cursor-pointer underline">
            {isSignInPage ? (
              <Link to="/sign_up">SignUp</Link>
            ) : (
              <Link to="/sign_in">SignIn</Link>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
