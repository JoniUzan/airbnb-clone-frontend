import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomeDetailsPage from "./pages/HomeDetailsPage";
import MainLayout from "./layouts/MainLayout";
import StepOnePage from "./pages/becomeAhostPages/StepOnePage";

import SelectTypePage from "./pages/becomeAhostPages/SelectTypePage";
import SelectRoomTypePage from "./pages/becomeAhostPages/SelectRoomTypePage";

import SelectLocationPage from "./pages/becomeAhostPages/SelectLocationPage";
import FloorPlan from "./pages/becomeAhostPages/FloorPlan";

import BecomeAhostLayout from "./layouts/BecomeAhostLayout";
import ReservationPage from "./pages/ReservationPage";
import StepTwoPage from "./pages/becomeAhostPages/StepTwoPage";
import SelectAmenities from "./pages/becomeAhostPages/SelectAmenities";
import AddTitlePage from "./pages/becomeAhostPages/AddTitlePage";
import AddDescriptionPage from "./pages/becomeAhostPages/AddDescriptionPage";
import AddPhotosPage from "./pages/becomeAhostPages/AddPhotosPage";
import StepThreePage from "./pages/becomeAhostPages/StepThreePage";
import SelectBookType from "./pages/becomeAhostPages/SelectBookType";
import AddPricePage from "./pages/becomeAhostPages/AddPricePage";
import WishlistPage from "./pages/WishlistPage";
import FooterLayout from "./layouts/FooterLayout";

import WishlistDetailPage from "./pages/WishlistDetailPage";
import ReceiptPage from "./pages/becomeAhostPages/ReceiptPage";
import HostPage from "./pages/HostPage";
import HostLayout from "./layouts/HostLayout";
import NotFoundPage from "./pages/NotFoundPage";
import TripsPage from "./pages/TripsPage";
import TripsLayout from "./layouts/TripsLayout";
import AccountPage from "./pages/AccountPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesLayout from "./layouts/MessagesLayout";
import ChatRoomPage from "./pages/ChatRoomPage";
import MessagePage from "./pages/MessagePage";
import HostListingPage from "./pages/HostListingPage";
import EditHomeLayout from "./layouts/EditHomeLayout";
import NotificationPage from "./pages/NotificationPage";
import WishlistLayout from "./layouts/WishlistLayout";
import { useAuth } from "./providers/user.context";
import AuthLayout from "./layouts/AuthLayout";
import LoginModal from "./components/general-components/LoginModalComponent";
import RegisterModal from "./components/general-components/RegisterModal";
import { ReactNode, useState } from "react";
import AccountLayout from "./layouts/AccountLayout";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true);

  function RequireAuth({ children }: { children: ReactNode }) {
    const { loggedInUser } = useAuth();

    if (loggedInUser === undefined) {
      return null;
    }

    if (loggedInUser === null) {
      return <Navigate to="/auth/login" replace />;
    }

    return children;
  }

  function RequireUnAuth({ children }: { children: ReactNode }) {
    const { loggedInUser } = useAuth();

    if (loggedInUser === undefined) {
      return null;
    }

    if (loggedInUser !== null) {
      return <Navigate to="/" replace />;
    }

    return children;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<FooterLayout />}>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/homes/:id" element={<HomeDetailsPage />} />
          </Route>

          <Route
            path="trips"
            element={
              <RequireAuth>
                <TripsLayout />
              </RequireAuth>
            }
          >
            <Route index element={<TripsPage />} />
          </Route>

          <Route
            path="account"
            element={
              <RequireAuth>
                <AccountLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AccountPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationPage />} />

            <Route path="messages" element={<MessagesLayout />}>
              <Route index element={<MessagePage />} />
              <Route path=":roomId" element={<ChatRoomPage />} />
            </Route>
          </Route>

          <Route path="/reservation/:id" element={<ReservationPage />} />

          <Route
            path="wishlists"
            element={
              <RequireAuth>
                <WishlistLayout />
              </RequireAuth>
            }
          >
            <Route index element={<WishlistPage />} />
            <Route path=":title" element={<WishlistDetailPage />} />
          </Route>
        </Route>

        <Route
          path="becomeAhost"
          element={
            <RequireAuth>
              <BecomeAhostLayout />
            </RequireAuth>
          }
        >
          <Route index element={<StepOnePage />} />
          <Route path="selectType" element={<SelectTypePage />} />
          <Route path="selectRoomType" element={<SelectRoomTypePage />} />
          <Route path="selectLocation" element={<SelectLocationPage />} />
          <Route path="floorPlan" element={<FloorPlan />} />
          <Route path="stepTwo" element={<StepTwoPage />} />
          <Route path="amenities" element={<SelectAmenities />} />
          <Route path="addPhotos" element={<AddPhotosPage />} />
          <Route path="addTitle" element={<AddTitlePage />} />
          <Route path="addDescription" element={<AddDescriptionPage />} />
          <Route path="stepThree" element={<StepThreePage />} />
          <Route path="bookType" element={<SelectBookType />} />
          <Route path="addPrice" element={<AddPricePage />} />
          <Route path="receipt" element={<ReceiptPage />} />
        </Route>

        <Route
          path="/hostPage"
          element={
            <RequireAuth>
              <HostLayout />
            </RequireAuth>
          }
        >
          <Route index element={<HostPage />} />
          <Route path="listing" element={<HostListingPage />} />
          <Route path="editHome/:id" element={<EditHomeLayout />}>
            <Route path="selectType" element={<SelectTypePage />} />
            <Route path="selectRoomType" element={<SelectRoomTypePage />} />
            <Route path="selectLocation" element={<SelectLocationPage />} />
            <Route path="floorPlan" element={<FloorPlan />} />
            <Route path="amenities" element={<SelectAmenities />} />
            <Route path="addPhotos" element={<AddPhotosPage />} />
            <Route path="addTitle" element={<AddTitlePage />} />
            <Route path="addDescription" element={<AddDescriptionPage />} />
            <Route path="bookType" element={<SelectBookType />} />
            <Route path="addPrice" element={<AddPricePage />} />
          </Route>
        </Route>

        <Route
          path="/auth"
          element={
            <RequireUnAuth>
              <AuthLayout />
            </RequireUnAuth>
          }
        >
          <Route
            path="login"
            element={
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(isLoginModalOpen)}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
              />
            }
          />
          <Route
            path="register"
            element={
              <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(isRegisterModalOpen)}
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
