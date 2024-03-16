import Home from "~/pages/Home";
import LandingPage from "~/pages/LandingPage";
import Explore from "~/pages/Explore";
import Create from "~/pages/Create";
import Pin from "~/pages/Pin";
import Profile from "~/pages/Profile";
import Creator from "~/pages/Creator";
import SearchPins from "~/pages/SearchPins";
import Business from "~/pages/Business";
import Message from "~/pages/Message";
import Admin from "~/pages/Admin";
import UserManagement from "~/pages/Admin/UserManagement";
import ReportManagement from "~/pages/Admin/ReportManagement";
import TransactionManagement from "~/pages/Admin/TransactionManagement";
import ArtworkManagement from "~/pages/Admin/ArtworkManagement";
import AdminSettings from "~/pages/Admin/AdminSettings";
import EditPin from "~/components/Profile/Created/EditPin";
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/", component: LandingPage },
  { path: "/ideas", component: Explore },
  { path: "/pin-creation-tool", component: Create },
  { path: "/pin/:id", component: Pin },
  { path: "/profile", component: Profile },
  { path: "/creator/:id", component: Creator },
  { path: "/search/pins", component: SearchPins },
  { path: "/convert-business", component: Business },
  { path: "/messages/:id", component: Message },
  { path: "/admin", component: Admin },
  { path: "/admin/user", component: UserManagement },
  { path: "/admin/report", component: ReportManagement },
  { path: "/admin/artwork", component: ArtworkManagement },
  { path: "/admin/transaction", component: TransactionManagement },
  { path: "/admin/settings", component: AdminSettings },
  { path: "/page", component: EditPin },
];

export { publicRoutes };
