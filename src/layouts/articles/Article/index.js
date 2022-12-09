import Card from "@mui/material/Card";
import "./Article.css";
import { toast } from "react-toastify";
import { axiosInstanceAuth } from "../../../apiInstances/index";
import { axiosInstanceAuthFile } from "../../../apiInstances/index";
import { Editor } from "react-draft-wysiwyg";
import MDInput from "components/MDInput";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { useEffect, useRef, useState } from "react";
import { BACKEND_BASE_URL } from "../../../../src/apiInstances/baseurl";
import ImageUploading from "react-images-uploading";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import EditArticle from "../EditArtcle";

function Articles() {
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
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState([]);
  const { encryptData, decryptData } = useEncryption();
  const [defaultData, setDefaultData] = useState();
  const [articles, setArticles] = useState([]);
  const [removeData, setRemoveData] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editArticleData, setEditArticleData] = useState({});
  const [description, setDescription] = useState({
    htmlValue: "<p></p>\n",
    editorState: EditorState.createEmpty(),
  });
  const effectCalled = useRef(false);
  let navigate = useNavigate();

  const checkToken = () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      navigate("/sign-in");
    }
  };
  useEffect(() => {
    checkToken();
  });

  const getArticles = () => {
    try {
      axiosInstanceAuth
        .get(`/admin/viewNodes`)
        .then((res) => {
          const responseData = decryptData(res.data.data);
          console.log(`🚀 ~ responseData`, responseData);

          if (responseData.status) {
            setArticles(responseData.data.nodeData);
            setLoading(false);
          }
        })
        .catch((res) => {
          let pwd = res.data.message;
          toast.error(pwd);
        });
    } catch (error) {}
  };

  const onReadMore = (data) => {
    localStorage.setItem("readArticle", JSON.stringify(data));
    navigate("/readarticle");
  };
  const onEditArticle = (data) => {
    setEditArticleData(data);
    setOpenEditModal(true);
  };

  const onDeleteArticle = (d) => {
    setRemoveData(d);
    setOpenConfirm(true);
  };

  const onConfirmModal = () => {
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          page_title: removeData.page_title,
          long_content: removeData.long_content,
          article_id: removeData.id,
          status: "0",
        })
      );

      axiosInstanceAuth
        .post(`admin/articles/edit`, {
          data: encryptedData,
        })
        .then((res) => {
          let pwd = res.data.message;
          if (res.data.status) {
            toast.success(pwd);
            getArticles();
            setOpenConfirm(false);
          } else {
            let pwd = res.data.message;
            toast.error(pwd);
          }
        })
        .catch((res) => {});
    } catch (error) {}
  };

  const handleClose = () => {
    setOpenConfirm(false);
  };

  const addCloseModal = () => {
    setOpenAddModal(false);
    setFields({
      page_title: "",
      long_content: "",
      article_id: "",
      status: "1",
    });
    setDescription({
      htmlValue: "<p></p>\n",
      editorState: EditorState.createEmpty(),
    });
    setImages([]);
  };

  const editCloseModal = () => {
    getArticles();
    setOpenEditModal(false);
  };

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
    } else if (description.htmlValue === "") {
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
            long_content: description.htmlValue,
          })
        );

        formData.append("file", images[0].file);
        formData.append("data", encryptedData);
        axiosInstanceAuthFile
          .post(`admin/articles/add`, formData)
          .then((res) => {
            let pwd = res.data.message;
            if (res.data.status) {
              toast.success(pwd);
              getArticles();
              addCloseModal();
            } else {
              let pwd = res.data.message;
              toast.error(pwd);
            }
          })
          .catch((res) => {});
      } catch (error) {}
    }
  };

  const onEditorStateChange = (editorValue) => {
    const editorStateInHtml = draftToHtml(convertToRaw(editorValue.getCurrentContent()));
    setDescription({
      htmlValue: editorStateInHtml,
      editorState: editorValue,
    });
  };

  useEffect(() => {
    if (!effectCalled.current) {
      getArticles();
      effectCalled.current = true;
    }
  }, []);

  return (
    <>
      {loading ? (
        // <div className="loader-container">
        //   <div className="spinner"></div>
        // </div>

        <div className="snippet" data-title=".dot-spin">
          <div className="stage">
            <div className="dot-spin"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="addArticle" onClick={() => setOpenAddModal(true)}>
            Add Article
          </div>
          <div className="articleCardWrapper">
            {articles.map((d, i) => (
              <Card key={i} className="articleCard position-relative">
                <div className="cardCloseIcon">
                  <IconButton aria-label="settings">
                    <CloseIcon onClick={() => onDeleteArticle(d)} />
                  </IconButton>
                </div>
                {/* <CardMedia
                  component="img"
                  height="200"
                  image={`${
                    d.image.length > 1 ? `${BACKEND_BASE_URL}${d.image}` : `img/graph.png`
                  }`}
                  alt="green iguana"
                /> */}
                <CardContent className="longContentText">
                  <Typography
                    className="articleCardTitle"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {d.name}
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: d.long_content,
                    }}
                  />
                </CardContent>
                <CardContent className="buttonWrapper">
                  <div className="readMoreButton" onClick={() => onReadMore(d)}>
                    Read More
                  </div>
                  <div className="readMoreButton" onClick={() => onEditArticle(d)}>
                    Edit
                  </div>
                </CardContent>
              </Card>
            ))}
            <Dialog
              open={openConfirm}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure? You want to remove this Article?"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={onConfirmModal}>YES</Button>
                <Button onClick={handleClose} autoFocus>
                  NO
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </>
      )}
      <Modal
        open={openAddModal}
        onClose={addCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus={false}
      >
        <Box className="articleModalWrapper">
          <div className="boxcard">
            <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
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
                      <Editor
                        contentState={defaultData}
                        defaultEditorState={EditorState}
                        toolbarHidden={false}
                        editorState={description.editorState}
                        onEditorStateChange={onEditorStateChange}
                        toolbarClassName="one"
                        wrapperClassName="two"
                        editorClassName="editorTextContainer"
                      />
                    </MDBox>
                    <p className="errorMessage">{error.long_content_Err}</p>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
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
                              <img src={image.data_url} alt="image" className="uploadImage" />
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
                              <button className="addImageButton" onClick={onImageRemoveAll}>
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </ImageUploading>
                    <p className="errorMessage">{error.image_Err}</p>
                    <MDBox
                      pt={2}
                      px={2}
                      pb={5}
                      display="flex"
                      justifyContent="right"
                      alignItems="center"
                    >
                      <MDButton variant="gradient" color="dark" onClick={onUpdateArticle}>
                        Save
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </div>
        </Box>
      </Modal>
      {openEditModal && (
        <EditArticle
          open={openEditModal}
          onClose={editCloseModal}
          editArticleData={editArticleData}
        />
      )}
    </>
  );
}

export default Articles;
