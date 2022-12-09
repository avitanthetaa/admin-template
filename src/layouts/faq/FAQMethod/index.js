import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import { axiosInstanceAuth } from "../../../apiInstances/index";
import MDInput from "components/MDInput";
import "../css/faqstyle.css";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import EditFaqModal from "../EditFaqModal";

function FAQMethod() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFaqData, setEditFaqData] = useState({});
  const [removeData, setRemoveData] = useState({});
  const { encryptData, decryptData } = useEncryption();
  const [loading, setLoading] = useState(true);
  const [addQuestion, setAddQuestion] = useState([
    {
      question: "",
      answer: "",
      sort: "1",
    },
  ]);
  const [addFaq, setAddFaq] = useState(false);
  const [fields, setFields] = useState({
    question: "",
    htmlValue: "<p></p>\n",
    editorState: EditorState.createEmpty(),
    sort: "1",
  });

  const [error, setError] = useState({
    question_Err: "",
    answer_Err: "",
  });

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

  const effectCalled = useRef(false);

  const Faqs = () => {
    try {
      axiosInstanceAuth
        .get(`/admin/faqs/get`)
        .then((res) => {
          if (res.data.status) {
            const responseData = decryptData(res.data.data);
            setAddQuestion(responseData);
            setLoading(false);
            setLoading(false);
          }
        })
        .catch((res) => {
          let pwd = res?.data?.message;
          toast.error(pwd);
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (!effectCalled.current) {
      Faqs();
      effectCalled.current = true;
    }
  }, []);

  const FaqQuestion = (item) => {
    setEditFaqData(item);
    setOpenEditModal(true);
  };

  const handleRemoveClick = (index, item) => {
    if (item.id) {
      setRemoveData(item);
      setOpenConfirm(true);
    } else {
      const list = [...addQuestion];
      list.splice(index, 1);
      setAddQuestion(list);
    }
  };

  const addHandle = () => {
    setAddFaq(true);
  };

  const onFaqClose = () => {
    setAddFaq(false);
  };
  const onFaqSubmit = () => {
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          question: fields.question,
          answer: fields.htmlValue,
          sort: "1",
        })
      );
      axiosInstanceAuth
        .post(`/admin/faqs/add`, {
          data: encryptedData,
        })
        .then((res) => {
          let pwd = res.data.message;
          if (res.data.status) {
            Faqs();
            toast.success(pwd);
          } else {
            let pwd = res.data.message;
            toast.error(pwd);
          }
        })
        .catch((res) => {});
    } catch (error) {}
    setAddFaq(false);
  };

  const onConfirmModal = () => {
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          question: removeData.question,
          answer: removeData.answer,
          sort: "1",
          faq_id: removeData.id,
          status: "0",
        })
      );
      axiosInstanceAuth
        .post(`admin/faqs/edit`, {
          data: encryptedData,
        })
        .then((res) => {
          let pwd = res.data.message;
          if (res.data.status) {
            Faqs();
            toast.success(pwd);
            Faqs();
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

  const onAddEditorStateChange = (editorValue) => {
    const editorStateInHtml = draftToHtml(convertToRaw(editorValue.getCurrentContent()));
    setFields({
      ...fields,
      htmlValue: editorStateInHtml,
      editorState: editorValue,
    });
  };

  const editCloseModal = () => {
    Faqs();
    setOpenEditModal(false);
  };

  return (
    <>
      {loading ? (
        <div className="snippet" data-title=".dot-spin">
          <div className="stage">
            <div className="dot-spin"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flexWrapper" style={{ paddingTop: 10 }}>
            <MDButton variant="gradient" color="dark" onClick={addHandle}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add
            </MDButton>
          </div>
          {addQuestion.map((item, index) => {
            return (
              <div className="accountCard boxcard" key={index} pb={10}>
                <Card id="account">
                  <MDBox
                    pt={2}
                    px={2}
                    fullWidth
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDTypography variant="h6" fontWeight="medium"></MDTypography>
                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={() => handleRemoveClick(index, item)}
                    >
                      <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                    </MDButton>
                  </MDBox>
                  <MDBox p={2}>
                    <MDBox>
                      <Grid container>
                        <Grid item xs={12}>
                          <MDTypography variant="h6" fontWeight="medium">
                            Question
                          </MDTypography>
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
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.question,
                              }}
                            />
                          </MDBox>
                        </Grid>
                      </Grid>
                      <Grid container className="answer">
                        <Grid item xs={12}>
                          <MDTypography variant="h6" fontWeight="medium">
                            Answer
                          </MDTypography>
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
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.answer,
                              }}
                            />
                          </MDBox>
                          <MDBox
                            pt={2}
                            px={2}
                            pb={2}
                            display="flex"
                            justifyContent="right"
                            alignItems="center"
                          >
                            <MDButton
                              variant="gradient"
                              color="dark"
                              onClick={() => FaqQuestion(item)}
                            >
                              Edit
                            </MDButton>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </MDBox>
                </Card>
              </div>
            );
          })}
        </>
      )}

      <Dialog
        open={openConfirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure? You want to remove this FAQ?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={onConfirmModal}>YES</Button>
          <Button onClick={handleClose} autoFocus>
            NO
          </Button>
        </DialogActions>
      </Dialog>

      {/* add Article Editor */}
      <Modal
        open={addFaq}
        onClose={onFaqClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus={false}
      >
        <Box className="articleModalWrapper">
          <div className="boxcard">
            <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="medium">
                Add Faq
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
                      <MDTypography className="questionLabel">Question</MDTypography>
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
                        defaultEditorState={EditorState}
                        toolbarHidden={false}
                        editorState={fields.editorState}
                        onEditorStateChange={onAddEditorStateChange}
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
                    <MDBox
                      pt={2}
                      px={2}
                      pb={5}
                      display="flex"
                      justifyContent="right"
                      alignItems="center"
                    >
                      <MDButton variant="gradient" color="dark" onClick={onFaqSubmit}>
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
        <EditFaqModal open={openEditModal} onClose={editCloseModal} editFaqData={editFaqData} />
      )}
    </>
  );
}

export default FAQMethod;
