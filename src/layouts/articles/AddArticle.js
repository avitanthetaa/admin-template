import { axiosInstanceAuthFile } from "../../apiInstances/index";
import Card from "@mui/material/Card";
import ImageUploading from "react-images-uploading";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { BACKEND_BASE_URL } from "../../../src/apiInstances/baseurl";
import MDInput from "components/MDInput";
import "../faq/css/faqstyle.css";
import "./ReadMoreArticle.css";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddArticle() {
  const { encryptData, decryptData } = useEncryption();

  const [fields, setFields] = useState({
    page_title: "",
    long_content: "",
    article_id: "",
    status: "1",
  });

  const [error, setError] = useState({
    page_title_Err: "",
    long_content_Err: "",
    image_Err: "",
  });

  const [images, setImages] = useState([]);

  let navigate = useNavigate();

  const onFieldsChange = (event) => {
    const { name, value } = event.target;
    if (name === "page_title") {
      if (value === "") {
        setError({ ...error, page_title_Err: "Title is required" });
      } else {
        setError({ ...error, page_title_Err: "" });
      }
    }
    if (name === "long_content") {
      if (value === "") {
        setError({ ...error, long_content_Err: "Content is required" });
      } else {
        setError({ ...error, long_content_Err: "" });
      }
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const onChange = (imageList, addUpdateIndex) => {
    if (imageList.length < 1) {
      setError({
        ...error,
        image_Err: "Image is required",
      });
    } else {
      setError({
        ...error,
        image_Err: "",
      });
    }
    setImages(imageList);
  };

  const onUpdateArticle = () => {
    if (fields.page_title === "") {
      setError({
        ...error,
        page_title_Err: "Title is required",
      });
    } else if (fields.long_content === "") {
      setError({
        ...error,
        long_content_Err: "Content is required",
      });
    } else if (images.length < 1) {
      setError({
        ...error,
        image_Err: "Image is required",
      });
    } else {
      setError({
        page_title_Err: "",
        long_content_Err: "",
        image_Err: "",
      });
      try {
        let formData = new FormData();
        const encryptedData = encryptData(
          JSON.stringify({
            page_title: fields.page_title,
            long_content: fields.long_content,
          })
        );

        formData.append("file", images[0].file);
        formData.append("data", encryptedData);
        axiosInstanceAuthFile
          .post(`admin/articles/add`, formData)
          .then((res) => {
            let pwd = res.data.message;
            if (res.data.status) {
              const responseData = decryptData(res?.data?.data);
              toast.success(pwd);
              navigate("/articles");
            } else {
              let pwd = res.data.message;
              toast.error(pwd);
            }
          })
          .catch((res) => {});
      } catch (error) {}
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={8}>
          <MDBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {/* <MDButton variant="gradient" color="dark" onClick={addhandle}>
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;add
                    </MDButton> */}

                    <div>
                      <Card id="account">
                        <MDBox
                          pt={2}
                          px={2}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <MDTypography variant="h6" fontWeight="medium">
                            Add Article
                          </MDTypography>
                        </MDBox>
                        <MDBox p={2}>
                          <MDBox>
                            <Grid container>
                              <Grid item xs={12}>
                                <MDBox
                                  borderRadius="lg"
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  p={3}
                                  sx={{
                                    border: ({ borders: { borderWidth, borderColor } }) =>
                                      `${borderWidth[1]} solid ${borderColor}`,
                                  }}
                                >
                                  <MDTypography className="questionLabel">Title</MDTypography>
                                  <MDInput
                                    type="text"
                                    label=""
                                    name="page_title"
                                    onChange={(e) => onFieldsChange(e)}
                                    value={fields.page_title}
                                    variant="standard"
                                    fullWidth
                                    md={2}
                                    fontWeight="medium"
                                    className="inputLabel"
                                  />
                                </MDBox>
                                <p className="errorMessage">{error.page_title_Err}</p>
                              </Grid>
                            </Grid>
                            <Grid container className="answer">
                              <Grid item xs={12}>
                                <MDBox
                                  borderRadius="lg"
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  p={3}
                                  sx={{
                                    border: ({ borders: { borderWidth, borderColor } }) =>
                                      `${borderWidth[1]} solid ${borderColor}`,
                                  }}
                                >
                                  <MDTypography className="questionLabel">Content</MDTypography>
                                  <MDInput
                                    type="text"
                                    label=" "
                                    name="long_content"
                                    onChange={(e) => onFieldsChange(e)}
                                    value={fields.long_content}
                                    variant="standard"
                                    fullWidth
                                    md={2}
                                    fontWeight="medium"
                                    className="inputLabel"
                                  />
                                </MDBox>
                                <p className="errorMessage">{error.long_content_Err}</p>
                              </Grid>
                            </Grid>
                            <Grid container>
                              <Grid item xs={12}>
                                <MDBox
                                  borderRadius="lg"
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  p={3}
                                  sx={{
                                    border: ({ borders: { borderWidth, borderColor } }) =>
                                      `${borderWidth[1]} solid ${borderColor}`,
                                  }}
                                >
                                  <MDTypography className="questionLabel"></MDTypography>
                                  <ImageUploading
                                    value={images}
                                    onChange={onChange}
                                    maxNumber={1}
                                    dataURLKey="data_url"
                                  >
                                    {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging,
                                      dragProps,
                                    }) => (
                                      <div className="uploadImageWrapper">
                                        {imageList.map((image, index) => (
                                          <div key={index} className="">
                                            <img
                                              src={image.data_url}
                                              alt="image"
                                              className="uploadImage"
                                            />
                                          </div>
                                        ))}
                                        <div className="">
                                          {imageList.length < 1 && (
                                            <button
                                              className="addImageButton"
                                              onClick={onImageUpload}
                                              {...dragProps}
                                            >
                                              Add Image
                                            </button>
                                          )}
                                          {imageList.length > 0 && (
                                            <button
                                              className="addImageButton"
                                              onClick={onImageRemoveAll}
                                            >
                                              Remove
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </ImageUploading>
                                </MDBox>
                                <p className="errorMessage">{error.image_Err}</p>

                                <MDBox
                                  pt={2}
                                  px={2}
                                  pb={5}
                                  display="flex"
                                  justifyContent="right"
                                  alignItems="center"
                                >
                                  <MDButton
                                    variant="gradient"
                                    color="dark"
                                    onClick={onUpdateArticle}
                                  >
                                    Save
                                  </MDButton>
                                </MDBox>
                              </Grid>
                            </Grid>
                          </MDBox>
                        </MDBox>
                      </Card>
                    </div>
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

export default AddArticle;
