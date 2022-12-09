import Dashboard from "layouts/dashboard";
// import Tables from "layouts/tables";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Coin from "layouts/coin";
import AddNode from "layouts/addnode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Terms from "layouts/TermsAndConditions";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import invest from "./assets/images/invest.png";
import FAQ from "layouts/faq";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import Investment from "layouts/how_to_invest";
import Articles from "layouts/articles";
import PersonIcon from "@mui/icons-material/Person";
import ReadMoreArticle from "layouts/articles/ReadMoreArticle";
import UserProfile from "layouts/userProfile";
import User from "layouts/user";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <DashboardIcon color="primary" />,
    // icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },

  {
    type: "collapse",
    name: "Add Node",
    key: "addnode",
    icon: <AddCircleIcon />,
    // icon: <img fontSize="small" src="/Images/bitcoin2.png" width={40} height={40} alt="img" />,
    route: "/addnode",
    component: <Coin />,
  },
  {
    type: "collapse",
    name: "Add Node",
    key: "addnode",
    icon: <AddCircleIcon />,
    // icon: <img fontSize="small" src="/Images/bitcoin2.png" width={40} height={40} alt="img" />,
    route: "/addnode1",
    component: <AddNode />,
  },
  // {
  //   type: "collapse",
  //   name: "Users",
  //   key: "users",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/users",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "User Investment",
  //   key: "",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/Tables",
  //   component: <Tables />,
  // },

  // {
  //   type: "collapse",
  //   name: "FAQs",
  //   key: "FAQ",
  //   icon: <LiveHelpIcon />,
  //   route: "/FAQ",
  //   component: <FAQ />,
  // },
  // {
  //   type: "collapse",
  //   name: "Terms And Conditions",
  //   key: "Terms_And_Conditions",
  //   icon: <AssignmentIcon />,
  //   route: "/Terms_And_Conditions",
  //   component: <Terms />,
  // },
  // {
  //   type: "collapse",
  //   name: "How To Invest",
  //   key: "Invest",
  //   icon: <img src={invest} alt="img" />,
  //   route: "/Invest",
  //   component: <Investment />,
  // },
  {
    type: "collapse",
    name: "Articles",
    key: "articles",
    icon: <AssignmentIcon />,
    route: "/articles",
    component: <Articles />,
  },
  {
    type: "collapse",
    name: "User",
    key: "user",
    icon: <PersonIcon />,
    route: "/user",
    component: <User />,
  },
  {
    // type: "collapse",
    // name: "articles",
    // key: "articles",
    // icon: <Icon fontSize="small">helpoutline</Icon>,
    route: "/readarticle",
    component: <ReadMoreArticle />,
  },

  {
    // type: "collapse",
    //name: "Sign Up",
    // key: "sign-up",
    // icon: <Icon fontSize="small">assignment</Icon>,
    route: "/profile",
    component: <UserProfile />,
  },
  {
    //   type: "collapse",
    //   name: "Sign In",
    //   key: "sign-in",
    //   icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    // type: "collapse",
    //name: "Sign Up",
    // key: "sign-up",
    // icon: <Icon fontSize="small">assignment</Icon>,
    route: "/sign-up",
    component: <SignUp />,
  },
];

export default routes;
