import { axiosInstanceAuth } from "../../apiInstances/index";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import MDInput from "components/MDInput";
import "../faq/css/faqstyle.css";
// import "../articles/ReadMoreArticle.css";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";

function EditFaqModal({ open, onClose, editFaqData }) {
  const { encryptData, decryptData } = useEncryption();
  const [defaultData, setDefaultData] = useState();
  const [description, setDescription] = useState({
    htmlValue: "<p></p>\n",
    editorState: EditorState.createEmpty(),
  });

  const [fields, setFields] = useState({
    question: "",
    answer: "",
    id: "",
    status: "1",
  });

  const [error, setError] = useState({
    page_title_Err: "",
    long_content_Err: "",
    image_Err: "",
  });

  const onFieldsChange = (event) => {
    const { name, value } = event.target;
    if (name === "question") {
      if (value === "") {
        setError({ ...error, page_title_Err: "Title is required" });
      } else {
        setError({ ...error, page_title_Err: "" });
      }
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const onEditorStateChange = (editorValue) => {
    const editorStateInHtml = draftToHtml(convertToRaw(editorValue.getCurrentContent()));
    setDescription({
      htmlValue: editorStateInHtml,
      editorState: editorValue,
    });
  };

  const onUpdateArticle = () => {
    if (fields.question === "") {
      setError({
        ...error,
        page_title_Err: "Title is required",
      });
    } else if (fields.answer === "") {
      setError({
        ...error,
        long_content_Err: "Answer is required",
      });
    } else {
      setError({
        page_title_Err: "",
        long_content_Err: "",
        image_Err: "",
      });
      try {
        const encryptedData = encryptData(
          JSON.stringify({
            question: fields.question,
            answer: description.htmlValue,
            sort: "1",
            faq_id: fields.id,
            status: "1",
          })
        );
        axiosInstanceAuth
          .post(`admin/faqs/edit`, {
            data: encryptedData,
          })
          .then((res) => {
            let pwd = res.data.message;
            if (res.data.status) {
              toast.success(pwd);
              onClose();
            } else {
              let pwd = res.data.message;
              toast.error(pwd);
            }
          })
          .catch((res) => {});
      } catch (error) {}
    }
  };
  const onDefaultData = async () => {
    const contentBlocks = await htmlToDraft(editFaqData.answer);
    const contentState = await ContentState.createFromBlockArray(contentBlocks);
    const rawHtml = await convertToRaw(contentState);
    setDefaultData(rawHtml);
  };

  useEffect(() => {
    onDefaultData();
    setFields({
      question: editFaqData.question,
      id: editFaqData.id,
      status: "1",
      image: editFaqData.image,
    });
    setDescription({
      htmlValue: editFaqData.answer,
      editorState: EditorState.createEmpty(),
    });
  }, []);
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus={false}
      >
        <Box className="articleModalWrapper">
          <div className="boxcard">
            <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="medium">
                Edit Faq
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
                        name="question"
                        onChange={(e) => onFieldsChange(e)}
                        value={fields.question}
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
                        editorClassName="editorTextContainer"
                      />
                    </MDBox>
                    <p className="errorMessage">{error.long_content_Err}</p>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
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
    </>
  );
}

export default EditFaqModal;
