import React, { useState } from "react";
import "./ReadMoreArticle.css";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { BACKEND_BASE_URL } from "../../../src/apiInstances/baseurl";

import { CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ReadMoreArticle = () => {
  const [articles, setArticles] = useState(JSON.parse(localStorage.getItem("readArticle")) || {});
  let navigate = useNavigate();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className="">
                    <div className="text-center">
                      <img
                        className="selectArticle text-center"
                        src={`${BACKEND_BASE_URL}${articles.image}`}
                        alt="article"
                      />
                    </div>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {articles.page_title}
                      </Typography>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: articles.long_content,
                        }}
                      />
                    </CardContent>
                    <CardContent className="">
                      <div className="closeButton" onClick={() => navigate("/articles")}>
                        Back
                      </div>
                    </CardContent>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ReadMoreArticle;
