import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import "./index.css";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { toast } from "react-toastify";
import { useState } from "react";
import { axiosInstance } from "../../../apiInstances/index";
import { useNavigate } from "react-router-dom";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
function Cover() {
  const { encryptData, decryptData } = useEncryption();
  const [adminData, setadminData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    mobileNumber: "",
  });
  let navigate = useNavigate();

  const adminSignUp = (e) => {
    e.preventDefault();
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          full_name: adminData.userName,
          email: adminData.userEmail,
          password: adminData.userPassword,
          contact_no: adminData.mobileNumber,
        })
      );
      axiosInstance
        .post(`/admin/signup`, {
          data: encryptedData,
        })
        .then((res) => {
          let pwd = res.data.message;
          if (res.data.status) {
            toast.success(pwd);
            navigate("/sign-in");
          } else {
            let pwd = res.data.message;
            toast.error(pwd);
          }
        })

        .catch((res) => {});
    } catch (error) {}
  };
  const userInput = (e) => {
    const { name, value } = e.target;
    setadminData({
      ...adminData,
      [name]: value,
    });
  };
  return (
    <CoverLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
          className="TitleColor"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={adminSignUp}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                name="userName"
                variant="standard"
                fullWidth
                onChange={userInput}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="userEmail"
                variant="standard"
                fullWidth
                onChange={userInput}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="userPassword"
                variant="standard"
                fullWidth
                onChange={userInput}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Mobile Number"
                name="mobileNumber"
                variant="standard"
                fullWidth
                onChange={userInput}
                minLength="10"
                maxLength={10}
                required
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                className="TitleColor"
              >
                sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
