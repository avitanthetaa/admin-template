import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CardContent } from "@mui/material";

const User = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userProfile, setuserProfile] = useState(JSON.parse(localStorage.getItem("profile")) || {});
  const checkToken = () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      <DashboardNavbar />
      <DashboardLayout>
        <>
          <div style={{ paddingTop: 50 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card id="delete-account">
                  <MDBox
                    pt={2}
                    px={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDTypography variant="h6" fontWeight="medium">
                      Profile
                    </MDTypography>
                  </MDBox>
                  {/* {userProfile.map(()=>{log})} */}
                  <MDBox p={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="h6" fontWeight="medium">
                          Name : {`${userProfile.firstname}  ${userProfile.lastname}`}
                          <br></br>
                          Email : {userProfile.email}
                          <br></br>
                          Mobile No : {userProfile.contact_no}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <CardContent className="">
                    <div className="closeButton" onClick={() => navigate("/user")}>
                      Back
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        </>

        <Footer />
      </DashboardLayout>
    </>
  );
};

export default User;
