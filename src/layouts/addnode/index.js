import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { axiosInstanceAuth } from "apiInstances";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

function AddNode() {
  let navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [selectData, setSelectData] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { encryptData, decryptData } = useEncryption();
  const [rows, setRows] = useState([]);
  const [rowsOld, setRowsOld] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkToken = () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    checkToken();
  });
  // name,
  // 		type,
  // 		currency,
  // 		price,
  // 		quantity,
  return (
    <>
      <DashboardNavbar />
      <DashboardLayout>
        <MDBox pt={6} pb={3}>
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
                Add Node
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form">
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    name="userTitle"
                    label="Title"
                    fullWidth
                    //   onChange={userInput}
                    required
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    name="UserType"
                    label="Type"
                    fullWidth
                    //   onChange={userInput}
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
                    Add Node
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
        {/* {loading ? (
          <div className="snippet" data-title=".dot-spin">
            <div className="stage">
              <div className="dot-spin"></div>
            </div>
          </div>
        ) : (
        
        )} */}
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default AddNode;
