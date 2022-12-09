import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstanceAuth } from "../../apiInstances/index";
import useEncryption from "EncryptDecrypt/EncryptDecrypt";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";

const User = () => {
  const { encryptData, decryptData } = useEncryption();
  let navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkToken = () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      navigate("/sign-in");
    }
  };

  const getUser = (data) => {
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          page_no: data.page_no,
          search: data.search,
        })
      );
      axiosInstanceAuth
        .get(`/admin/viewUsers`, {
          data: encryptedData,
        })
        .then((res) => {
          const responseData = decryptData(res.data.data);
          console.log(responseData);
          if (responseData.status) {
            setPage(Math.ceil(res.data.count / 10));

            const temp = [];
            responseData.data.usersData.map((data, index) => {
              temp.push({
                id: (
                  <MDTypography component="a" variant="button" color="text" fontWeight="medium">
                    {index + 1}
                  </MDTypography>
                ),
                full_name: (
                  <MDTypography component="a" variant="button" color="text" fontWeight="medium">
                    {`${data.firstname}  ${data.lastname}`}
                  </MDTypography>
                ),
                email: (
                  <MDTypography component="a" variant="button" color="text" fontWeight="medium">
                    {data.email}
                  </MDTypography>
                ),
                contact_no: (
                  <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {data.contact_no}
                  </MDTypography>
                ),
                // walletAddress: (
                //   <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                //     {data.walletAddress}
                //   </MDTypography>
                // ),
                // walletAmount: (
                //   <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                //     {data.walletAmt}
                //   </MDTypography>
                // ),
                view: (
                  <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    <VisibilityIcon onClick={() => viewUserDetails(data)} />
                    {/* <VisibilityIcon onClick={viewUserDetails} /> */}
                    {/* {data.id} */}
                  </MDTypography>
                ),
              });
            });
            setRows(temp);
            setLoading(false);
          }
        })
        .catch((res) => {
          toast.error(res.data.message);
        });
    } catch (error) {}
  };

  const columns = [
    { Header: "id", accessor: "id", align: "left" },
    { Header: "Full Name", accessor: "full_name", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "contact No", accessor: "contact_no", align: "left" },
    { Header: "view", accessor: "view", align: "left" },
  ];

  const handleInput = (e) => {
    setSearchInput(e.target.value);
    getUser({ page_no: currentPage, search: e.target.value });
  };

  const onPaginationTable = (event, page) => {
    setCurrentPage(page);
    getUser({ page_no: page, search: "" });
  };

  const viewUserDetails = (data) => {
    console.log("data", data);
    localStorage.setItem("profile", JSON.stringify(data));
    navigate("/profile");
  };

  useEffect(() => {
    getUser({ page_no: currentPage, search: "" });
  }, []);

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      <DashboardNavbar />
      <DashboardLayout>
        {loading ? (
          <div className="snippet" data-title=".dot-spin">
            <div className="stage">
              <div className="dot-spin"></div>
            </div>
          </div>
        ) : (
          <MDBox pt={6} pb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="coinTitleColor"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      User
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    <MDBox pr={1} classNane="inputsre">
                      <MDInput
                        label="Search here"
                        value={searchInput}
                        onChange={(e) => handleInput(e)}
                      />
                    </MDBox>

                    <DataTable
                      table={{ columns: columns, rows: rows }}
                      isSorted={true}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                    {rows.length > 0 && (
                      <Stack padding={2}>
                        <Pagination onChange={onPaginationTable} count={page} size="large" />
                      </Stack>
                    )}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default User;
