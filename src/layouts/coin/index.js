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
import "./css/coin.css";
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

function Tables() {
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

  const getCoinsData = () => {
    try {
      axiosInstanceAuth
        .get(`/admin/get_coins`)
        .then((res) => {
          if (res.data.status) {
            const responseData = decryptData(res.data.data);
            const temp = [];
            for (let coin of responseData) {
              temp.push({
                name: (
                  <MDBox display="flex" alignItems="center" lineHeight={1}>
                    <MDAvatar
                      src={coin.logo}
                      name={coin.name}
                      symbol={coin.symbol}
                      size="sm"
                      variant="rounded"
                    />
                    <MDTypography
                      display="block"
                      variant="button"
                      fontWeight="medium"
                      ml={1}
                      lineHeight={1}
                    >
                      {coin.name} {`(${coin.symbol})`}
                    </MDTypography>
                  </MDBox>
                ),
                price: (
                  <MDTypography component="a" variant="button" color="text" fontWeight="medium">
                    $ {coin.price}
                  </MDTypography>
                ),
                status: (
                  <MDTypography
                    component="a"
                    variant="caption"
                    color="text"
                    fontWeight="medium"
                    style={{ color: coin.percent_change_24h < 0 ? "red" : "green" }}
                  >
                    {coin.percent_change_24h.toPrecision(3)}%
                  </MDTypography>
                ),
                cap: (
                  <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    $ {coin.market_cap}
                  </MDTypography>
                ),
                // completion: (
                //   <MDBox display="flex" alignItems="center">
                //     <MDTypography variant="caption" color="text" fontWeight="medium">
                //       {60}%
                //     </MDTypography>
                //     <MDBox ml={0.5} width="9rem">
                //       <MDProgress variant="gradient" color="info" value={60} />
                //     </MDBox>
                //   </MDBox>
                // ),
                action: (
                  <>
                    <MDTypography color="text">
                      {coin.status === "1" ? (
                        <MDButton
                          style={{ color: coin.status === "1" ? "green" : "" }}
                          onClick={() => onOpen({ id: coin.id, coin: 0 })}
                        >
                          Active
                        </MDButton>
                      ) : (
                        <MDButton
                          style={{ color: coin.status === "0" ? "red" : "" }}
                          onClick={() => onOpen({ id: coin.id, coin: 1 })}
                        >
                          DeActive
                        </MDButton>
                      )}
                    </MDTypography>
                  </>
                ),
              });
            }
            setRows(temp);
            setRowsOld(temp);
            setLoading(false);
          }
        })
        .catch((res) => {
          toast.error(res.data.message);
        });
    } catch (error) {}
  };

  useEffect(() => {
    // setLoading(true);
    getCoinsData();
    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
  }, []);

  useEffect(() => {
    checkToken();
  });

  const columns = [
    { Header: "name", accessor: "name", width: "30%", align: "left" },
    { Header: "price", accessor: "price", align: "left" },
    { Header: "24%", accessor: "status", align: "center" },
    { Header: "market cap", accessor: "cap", align: "left" },
    // { Header: "Progress", accessor: "completion", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const handleInput = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value) {
      const searchData = rowsOld.filter((i) => {
        return i.name.props.children[0].props.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setRows(searchData);
    } else {
      setRows(rowsOld);
    }
  };

  const onOpen = (data) => {
    setSelectData(data);
    setIsModal(true);
  };
  const onConfirmModal = () => {
    try {
      const encryptedData = encryptData(
        JSON.stringify({
          coin_id: selectData.id,
          status: selectData.coin.toString(),
        })
      );
      axiosInstanceAuth
        .post(`/admin/coins/change_status`, {
          data: encryptedData,
        })
        .then((res) => {
          let pwd = res.data.message;
          if (res.data.status) {
            getCoinsData();
            toast.success(pwd);
            setIsModal(false);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((res) => {});
    } catch (error) {}
  };
  const handleClose = () => {
    setIsModal(false);
  };

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
                      Coins
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
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        )}
        <Footer />
      </DashboardLayout>
      <Dialog
        open={isModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {` Are you sure? You want to ${
            selectData.coin === 0 ? `DeActive` : `Active`
          }  this Coin?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={onConfirmModal}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Tables;
