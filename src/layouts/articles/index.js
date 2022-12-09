// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import Articles from "layouts/articles/Article/index";
// import Terms from "layouts/TermsAndConditions/Terms/index


function Article() {
  return (
    <>
      <DashboardNavbar />

      <DashboardLayout>
        <MDBox>
          <MDBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Articles />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}

export default Article;
