import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { toast } from "react-toastify";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { axiosInstance } from "../../../apiInstances/index";
import { useState } from "react";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { useNavigate } from "react-router-dom";
import "./index.css";
import logo from "../../../assets/images/wizzLogo.png";

function Basic() {
  const [adminData, setadminData] = useState([{ userEmail: "", UserPassword: "" }]);
  const { encryptData, decryptData } = useEncryption();
  let navigate = useNavigate();

  const userLogin = (e) => {
    e.preventDefault();

    try {
      const encryptedData = encryptData(
        JSON.stringify({
          email: adminData.userEmail,
          password: adminData.UserPassword,
        })
      );

      axiosInstance
        .post(`/admin/login`, {
          data: encryptedData,
        })
        .then((res) => {
          const resdata = decryptData(res.data.data);
          let Token = resdata.data.token;
          localStorage.setItem("Token", JSON.stringify(Token));
          console.log(`🚀 ~ data`, resdata);
          if (resdata.status) {
            toast.success("Login succsess.");
            navigate("/dashboard");
          } else {
            console.log("error", res);
            const resdata = decryptData(res.data.data);
            let pwd = resdata.message;
            toast.error(pwd);
          }
        })
        // const resdata = decryptData(res.data.data);
        // let Token = resdata.data.token;
        // localStorage.setItem("Token", JSON.stringify(Token));
        // console.log(`🚀 ~ data`, resdata);
        .catch((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const userInput = (e) => {
    const { name, value } = e.target;

    setadminData({
      ...adminData,
      [name]: value,
    });
  };

  return (
    <>
      <BasicLayout>
        <div className="logoWrapper">
          <img src={logo} className="signInLogo" alt="logo" />
        </div>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
            className="TitleColor"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign In
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={userLogin}>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  name="userEmail"
                  label="Email"
                  fullWidth
                  onChange={userInput}
                  required
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  name="UserPassword"
                  label="Password"
                  fullWidth
                  onChange={userInput}
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
                  sign in
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </BasicLayout>
    </>
  );
}

export default Basic;
