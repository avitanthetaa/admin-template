import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import { axiosInstanceAuth } from "../../../apiInstances/index";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import htmlToDraft from "html-to-draftjs";
function HowToInvert() {
  const { encryptData, decryptData } = useEncryption();
  const [addQuestion, setAddQuestion] = useState([{ page_title: "", long_content: "" }]);
  const effectCalled = useRef(false);
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState({
    htmlValue: "<p></p>\n",
    editorState: EditorState.createEmpty(),
  });
  const [defaultData, setDefaultData] = useState();
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

  const onEditorStateChange = (editorValue) => {
    const editorStateInHtml = draftToHtml(convertToRaw(editorValue.getCurrentContent()));
    setDescription({
      htmlValue: editorStateInHtml,
      editorState: editorValue,
    });
  };

  const getHowToInvertData = () => {
    setLoading(true);
    try {
      axiosInstanceAuth
        .get(`/admin/how_to_invest/get`)

        .then((res) => {
          setLoading(false);
          // let pwd = res.data.message;
          if (res.data.status) {
            const responseData = decryptData(res.data.data);
            // toast.success(pwd);
            const temp = responseData[0];
            const contentBlocks = htmlToDraft(temp.long_content);
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            const rawHtml = convertToRaw(contentState);
            setDefaultData(rawHtml);
            setDescription({
              ...description,
              htmlValue: temp.long_content,
            });
            setAddQuestion(responseData);
          }
        })
        .catch((res) => {
          let pwd = res.data.message;
          toast.error(pwd);
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (!effectCalled.current) {
      getHowToInvertData();
      effectCalled.current = true;
    }
  }, []);

  const addHowToInvertData = (e, index) => {
    e.preventDefault();
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          page_title: "How To Invest",
          long_content: description.htmlValue,
        })
      );
      axiosInstanceAuth
        .post(`/admin/how_to_invest/add`, {
          data: encryptedData,
        })
        .then((res) => {
          let pwd = res.data.message;
          if (res.data.status) {
            toast.success(pwd);
          } else {
            let pwd = res.data.message;
            toast.error(pwd);
          }
        })
        .catch((res) => {});
    } catch (error) {}
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...addQuestion];
    list[index][name] = value;
    setAddQuestion(list);
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
          {addQuestion.map((item, index) => {
            return (
              <div key={index} style={{ paddingTop: 50 }}>
                <Card id="account">
                  <MDBox
                    pt={2}
                    px={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDTypography variant="h6" fontWeight="medium">
                      How to Invest
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2}>
                    <MDBox
                      component="form"
                      role="form"
                      onSubmit={(e) => addHowToInvertData(e, index)}
                    >
                      {/* <Grid container>
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
                        <MDInput
                          type="text"
                          label=""
                          name="page_title"
                          onChange={(e) => handleInputChange(e, index)}
                          value={item.page_title}
                          variant="standard"
                          fullWidth
                          md={2}
                          fontWeight="medium"
                          className="inputLabel"
                        />
                      </MDBox>
                    </Grid>
                  </Grid> */}
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
                            <MDTypography className="questionLabel"></MDTypography>
                            <Editor
                              contentState={defaultData}
                              defaultEditorState={EditorState}
                              toolbarHidden={false}
                              editorState={description.editorState}
                              onEditorStateChange={onEditorStateChange}
                            />
                          </MDBox>
                          <MDBox
                            pt={2}
                            px={2}
                            pb={5}
                            display="flex"
                            justifyContent="right"
                            alignItems="center"
                          >
                            <MDButton variant="gradient" color="dark" type="submit">
                              Save
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
    </>
  );
}

export default HowToInvert;
