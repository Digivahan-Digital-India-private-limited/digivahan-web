import React, { useEffect } from "react";
import Layout from "./Layout/Layout";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import Aboutpage from "./Components/Aboutpage/Aboutpage";
import Updatespage from "./Components/Updatespage/Updatespage";
import Newspage from "./Components/Newspage/Newspage";
import Loginpage from "./Components/Authenticationpage/Loginpage";
import OtpLoginPage from "./Components/Authenticationpage/OtpLoginPage";

// information page
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ProtectionPolicy from "./Pages/ProtectionPolicy";
import ReturnRefundPolicy from "./Pages/ReturnRefundPolicy";
import TermsAndConditionsPage from "./Pages/TermsAndConditionsPage";
import Contactpage from "./Components/Contactpage/Contactpage";
import RaiseConcern from "./Pages/RaiseConcern";
import UserConcernChat from "./Pages/UserConcernChat";
import VisitUs from "./Pages/VisitUs";
import Reports from "./Pages/Reports";
import Explorepage from "./Pages/Explorepage";
import OrderQrPage from "./Pages/OrderQrPage";
import CareerPage from "./Pages/CareerPage";
import DeleteAccountPage from "./Pages/DeleteAccountPage";
import SendNotificationpage from "./Pages/SendNotificationpage";
import ConnectTabs from "./Pages/ConnectTabs";
import AccidentNotification from "./Pages/AccidentNotification";
import EmergencyContactUspage from "./Pages/EmergencyContactUspage";
import AccessVehicleDoc from "./Pages/AccessVehicleDoc";
import ChallanPay from "./Pages/chalan-pay/ChallanPay";
import ChallanPayForApp from "./Pages/chalan-for-app/ChallanPayForApp";

// Admin Pannel
import AdminPannel from "./Pages/AdminPannel/AdminPannel";
import Dashboard from "./Pages/AdminPannel/Dashboard/Dashboard";
import Order from "./Pages/AdminPannel/Orders/Order";
import ShiprocketOrders from "./Pages/AdminPannel/Orders/ShiprocketOrders/ShiprocketOrders";
import DelhiveryOrders from "./Pages/AdminPannel/Orders/DelhiveryOrders/DelhiveryOrders";
import GenerateManifest from "./Pages/AdminPannel/Orders/GenerateManifest/GenerateManifest";
import DeliveryPartners from "./Pages/AdminPannel/Orders/DeliveryPartners/DeliveryPartners";
import ManageOrder from "./Pages/AdminPannel/Orders/ManageOrder";
import PendingOrders from "./Pages/AdminPannel/Orders/PendingOrders/PendingOrders";
import ConfirmedOrders from "./Pages/AdminPannel/Orders/ConfirmedOrders/ConfirmedOrders";
import CancelledOrders from "./Pages/AdminPannel/Orders/CancelledOrders/CancelledOrders";
import Qrmanagement from "./Pages/AdminPannel/QRManagement/Qrmanagement";
import FilterQR from "./Pages/AdminPannel/QRManagement/FilterQR";
import GenerateQR from "./Pages/AdminPannel/QRManagement/GenerateQR";
import AssignedQR from "./Pages/AdminPannel/QRManagement/QRStatusTabs/AssignedQR";
import BlockedQR from "./Pages/AdminPannel/QRManagement/QRStatusTabs/BlockedQR";
import AllottedQrCode from "./Pages/AdminPannel/QRManagement/QRStatusTabs/AllottedQrCode";
import UnassignedQR from "./Pages/AdminPannel/QRManagement/QRStatusTabs/UnassignedQR";
import SalesDetails from "./Pages/AdminPannel/QRManagement/SalesDetails";
import ManageUserApp from "./Pages/AdminPannel/ManageUserApp/ManageUserApp";
import UpdatePolicies from "./Pages/AdminPannel/ManageUserApp/OurPolicies/UpdatePolicies";
import Editpolicypage from "./Pages/AdminPannel/ManageUserApp/OurPolicies/Editpolicypage";
import FuelPriceManager from "./Pages/AdminPannel/ManageUserApp/FuelPrice/FuelPriceManager";
import ManageTrendingCars from "./Pages/AdminPannel/ManageUserApp/TrandingCars/ManageTrendingCars";
import AddTrandingCars from "./Pages/AdminPannel/ManageUserApp/TrandingCars/AddTrandingCars";
import UpdateTrandingCars from "./Pages/AdminPannel/ManageUserApp/TrandingCars/UpdateTrandingCars";
import ViewTrandingCars from "./Pages/AdminPannel/ManageUserApp/TrandingCars/ViewTrandingCars";
import DeleteTrandingCars from "./Pages/AdminPannel/ManageUserApp/TrandingCars/DeleteTrandingCars";
import ManagePopularComparision from "./Pages/AdminPannel/ManageUserApp/PopularComparision/ManagePopularComparision";
import ManageTipsInfo from "./Pages/AdminPannel/ManageUserApp/TipsInfo/ManageTipsInfo";
import ManageNews from "./Pages/AdminPannel/ManageUserApp/News/ManageNews";
import ManageQRGuide from "./Pages/AdminPannel/ManageUserApp/QRGuide/ManageQRGuide";
import ManageQRBenefits from "./Pages/AdminPannel/ManageUserApp/QRBenefits/ManageQRBenefits";
import ManageAppInfo from "./Pages/AdminPannel/ManageUserApp/AppInfo/ManageAppInfo";
import CustomerQueries from "./Pages/AdminPannel/CustomerQueries/CustomerQueries";
import PostFAQ from "./Pages/AdminPannel/CustomerQueries/FAQManagement/PostFAQ";
import DeleteFAQ from "./Pages/AdminPannel/CustomerQueries/FAQManagement/DeleteFAQ";
import UpdateFAQ from "./Pages/AdminPannel/CustomerQueries/FAQManagement/UpdateFAQ";
import GeneralInformationQueries from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/GeneralInformationQueries";
import TechnicalQueries from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/TechnicalQueries";
import AccountRelated from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/AccountRelated";
import PaymentBilling from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/PaymentBilling";
import OrderServiceStatus from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/OrderServiceStatus";
import ProductServiceComplaints from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/ProductServiceComplaints";
import FeedbackSuggestions from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/FeedbackSuggestions";
import CancellationReturn from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/CancellationReturn";
import Escalation from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/Escalation";
import OnboardingSetup from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/OnboardingSetup";
import Subscription from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/Subscription";
import VerificationQueries from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/VerificationQueries";
import ReplyPage from "./Pages/AdminPannel/CustomerQueries/CustomerQueriesByCategory/ReplyPage";
import Reviews from "./Pages/AdminPannel/Reviews/Reviews";
import PositiveReviews from "./Pages/AdminPannel/Reviews/PositiveReviews/PositiveReviews";
import AverageReviews from "./Pages/AdminPannel/Reviews/AverageReviews/AverageReviews";
import NegativeReviews from "./Pages/AdminPannel/Reviews/NegativeReviews/NegativeReviews";
import ReplyToReview from "./Pages/AdminPannel/Reviews/ReplyToReview";
import Issues from "./Pages/AdminPannel/Issues/Issues";
import PriorityIssue from "./Pages/AdminPannel/Issues/PriorityIssue/PriorityIssue";
import AppIssue from "./Pages/AdminPannel/Issues/AppIssue/AppIssue";
import ServiceIssue from "./Pages/AdminPannel/Issues/ServiceIssue/ServiceIssue";
import SupportIssue from "./Pages/AdminPannel/Issues/SupportIssue/SupportIssue";
import Suggestion from "./Pages/AdminPannel/Issues/Suggestion/Suggestion";
import IssueResolution from "./Pages/AdminPannel/Issues/IssueResolution";
import AdminReports from "./Pages/AdminPannel/Reports/Reports";
import VehicleOwnerReports from "./Pages/AdminPannel/Reports/VehicleOwnerReports/VehicleOwnerReports";
import InteractorReports from "./Pages/AdminPannel/Reports/InteractorReports/InteractorReports";
import ManageAppointment from "./Pages/AdminPannel/Appointments/ManageAppointment";
import ManageConcerns from "./Pages/AdminPannel/Concerns/ManageConcerns";
import ConcernChat from "./Pages/AdminPannel/Concerns/ConcernChat";
import DeleteAccountRequests from "./Pages/AdminPannel/DeleteAccountRequests/DeleteAccountRequests";
import ReportIssueList from "./Pages/AdminPannel/ReportsIssue/ReportIssueList";
import ChallanWebhookAdmin from "./Pages/AdminPannel/ChallanWebhook/ChallanWebhookAdmin";
import HRManager from "./Pages/AdminPannel/HRManager/HRManager";
import UserManagement from "./Pages/AdminPannel/UserManagement/UserManagement";
import Analytics from "./Pages/AdminPannel/Analytics/Analytics";

// Protected Routes
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";

// iOS App Pages
import {
  IOSLoginPage,
  VerifyNumber,
  VerifyEmail,
  VerifyOTP,
  AccountCreated,
  LoginSuccess,
  ResetPassword,
  PasswordChanged,
} from "./Pages/IOSAppPage/UserAuthentication";
import {
  Home,
  Profile,
  Notification,
  Chat,
  DocumentVault,
  MyOrder,
  TrackOrder,
  MyGarage,
  ReviewOrder,
  EditDeliveryAddress,
  Payment,
  OrderSuccessful,
  UpdateProfile,
  BasicDetails,
  PublicDetails,
  EmergencyContactsEmpty,
  EmergencyContactsList,
  EditEmergencyContact,
  AddEmergencyContact,
  ChangePassword,
  IOSAboutUs,
  IOSTermsConditions,
  IOSPrivacyPolicy,
  VehicleInfo,
} from "./Pages/IOSAppPage/IOSDashboard";

// Virtual QR Management Pages
import MyVirtualQREmpty from "./Pages/IOSAppPage/IOSDashboard/VirtualQR/MyVirtualQREmpty";
import MyVirtualQRList from "./Pages/IOSAppPage/IOSDashboard/VirtualQR/MyVirtualQRList";
import MyVirtualQRDetail from "./Pages/IOSAppPage/IOSDashboard/VirtualQR/MyVirtualQRDetail";
import SeoHead from "./Components/Seo/SeoHead";

// New User System (Frontend Foundation)
import UserProtectedRoute from "./features/auth/components/UserProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import OtpVerificationPage from "./features/auth/pages/OtpVerificationPage";
import AccountCreatedPage from "./features/auth/pages/AccountCreatedPage";
import LoginSuccessPage from "./features/auth/pages/LoginSuccessPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import PasswordChangedPage from "./features/auth/pages/PasswordChangedPage";
import AppLayout from "./features/shared/components/layout/AppLayout";
import MarketplaceLayout from "./features/shared/components/layout/MarketplaceLayout";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import MyGaragePage from "./features/vehicles/pages/MyGaragePage";
import AddVehiclePage from "./features/vehicles/pages/AddVehiclePage";
import VehicleDetailsPage from "./features/vehicles/pages/VehicleDetailsPage";
import MyVirtualQRPage from "./features/qr/pages/MyVirtualQRPage";
import MyVirtualQRListPage from "./features/qr/pages/MyVirtualQRListPage";
import MyVirtualQRDetailPage from "./features/qr/pages/MyVirtualQRDetailPage";
import OrdersPage from "./features/orders/pages/OrdersPage";
import CheckoutPage from "./features/orders/pages/CheckoutPage";
import TrackOrderPage from "./features/orders/pages/TrackOrderPage";
import ReviewOrderPage from "./features/orders/pages/ReviewOrderPage";
import EditDeliveryAddressPage from "./features/orders/pages/EditDeliveryAddressPage";
import PaymentPage from "./features/orders/pages/PaymentPage";
import OrderSuccessPage from "./features/orders/pages/OrderSuccessPage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import EmergencyContactsPage from "./features/profile/pages/EmergencyContactsPage";
import UpdateProfilePage from "./features/profile/pages/UpdateProfilePage";
import BasicDetailsPage from "./features/profile/pages/BasicDetailsPage";
import PublicDetailsPage from "./features/profile/pages/PublicDetailsPage";
import ChangePasswordPage from "./features/profile/pages/ChangePasswordPage";
import AddEmergencyContactPage from "./features/profile/pages/AddEmergencyContactPage";
import EditEmergencyContactPage from "./features/profile/pages/EditEmergencyContactPage";
import ChatPage from "./features/support/pages/ChatPage";
import DocumentVaultPage from "./features/documents/pages/DocumentVaultPage";
import MarketplaceHomePage from "./features/marketplace/pages/MarketplaceHomePage";
import BuyCarsPage from "./features/marketplace/pages/BuyCarsPage";
import SellCarsPage from "./features/marketplace/pages/SellCarsPage";
import BuyCarDetailsPage from "./features/marketplace/pages/BuyCarDetailsPage";
import BuyCarComparePage from "./features/marketplace/pages/BuyCarComparePage";
import SellerInstantQuotePage from "./features/marketplace/pages/SellerInstantQuotePage";
import SellerInspectionBookingPage from "./features/marketplace/pages/SellerInspectionBookingPage";
import SellerFinalOfferPage from "./features/marketplace/pages/SellerFinalOfferPage";
import SellerTransferTrackerPage from "./features/marketplace/pages/SellerTransferTrackerPage";
import MarketplaceTrustPage from "./features/marketplace/pages/MarketplaceTrustPage";
import MarketplaceReviewsPage from "./features/marketplace/pages/MarketplaceReviewsPage";
import MarketplaceSupportPage from "./features/marketplace/pages/MarketplaceSupportPage";
import MarketplaceEmiCalculatorPage from "./features/marketplace/pages/MarketplaceEmiCalculatorPage";
import MarketplaceServiceCostCalculatorPage from "./features/marketplace/pages/MarketplaceServiceCostCalculatorPage";

const SemanticPage = ({ children, label = "Page content" }) => (
  <section aria-label={label} className="w-full h-full">
    {children}
  </section>
);

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="w-full h-full">
      <SeoHead />
      <Routes>
        {/* New User System Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/otp" element={<OtpVerificationPage />} />
        <Route path="/login/verify-number" element={<Navigate to="/login" replace />} />
        <Route path="/login/verify-email" element={<Navigate to="/login" replace />} />
        <Route path="/account-created" element={<AccountCreatedPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        <Route path="/password-reset" element={<ResetPasswordPage />} />
        <Route path="/password-reset/changed" element={<PasswordChangedPage />} />

        <Route
          element={
            <UserProtectedRoute>
              <AppLayout />
            </UserProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<MyGaragePage />} />
          <Route path="/my-garage" element={<Navigate to="/vehicles" replace />} />
          <Route path="/vehicles/add" element={<AddVehiclePage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/vehicles/:id/qr" element={<MyVirtualQRPage />} />
          <Route path="/virtual-qr" element={<MyVirtualQRListPage />} />
          <Route path="/virtual-qr/:id" element={<MyVirtualQRDetailPage />} />
          <Route path="/my-virtual-qr-list" element={<Navigate to="/virtual-qr" replace />} />
          <Route path="/my-virtual-qr-detail/:id" element={<MyVirtualQRDetailPage />} />
          <Route path="/my-virtual-qr-empty" element={<Navigate to="/virtual-qr" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/checkout" element={<CheckoutPage />} />
          <Route path="/my-order" element={<Navigate to="/orders" replace />} />
          <Route path="/orders/:id/track" element={<TrackOrderPage />} />
          <Route path="/orders/:id/review" element={<ReviewOrderPage />} />
          <Route path="/orders/:id/delivery" element={<EditDeliveryAddressPage />} />
          <Route path="/orders/:id/payment" element={<PaymentPage />} />
          <Route path="/orders/:id/success" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/review-order" element={<ReviewOrderPage />} />
          <Route path="/edit-delivery-address" element={<EditDeliveryAddressPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-successful" element={<OrderSuccessPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/document-vault" element={<DocumentVaultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/update" element={<UpdateProfilePage />} />
          <Route path="/profile/basic-details" element={<BasicDetailsPage />} />
          <Route path="/profile/public-details" element={<PublicDetailsPage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          <Route path="/update-profile" element={<Navigate to="/profile/update" replace />} />
          <Route path="/basic-details" element={<Navigate to="/profile/basic-details" replace />} />
          <Route path="/public-details" element={<Navigate to="/profile/public-details" replace />} />
          <Route path="/change-password" element={<Navigate to="/profile/change-password" replace />} />
          <Route
            path="/profile/emergency-contacts"
            element={<EmergencyContactsPage />}
          />
          <Route path="/emergency-contacts-list" element={<Navigate to="/profile/emergency-contacts" replace />} />
          <Route path="/emergency-contacts-empty" element={<Navigate to="/profile/emergency-contacts" replace />} />
          <Route
            path="/profile/emergency-contacts/add"
            element={<AddEmergencyContactPage />}
          />
          <Route path="/add-emergency-contact" element={<Navigate to="/profile/emergency-contacts/add" replace />} />
          <Route
            path="/profile/emergency-contacts/:id/edit"
            element={<EditEmergencyContactPage />}
          />
        </Route>

        {/* MARKETPLACE ROUTES HIDDEN TEMPORARILY
        <Route
          element={
            <UserProtectedRoute>
              <MarketplaceLayout />
            </UserProtectedRoute>
          }
        >
          <Route path="/marketplace" element={<MarketplaceHomePage />} />
          <Route path="/marketplace/trust" element={<MarketplaceTrustPage />} />
          <Route path="/marketplace/reviews" element={<MarketplaceReviewsPage />} />
          <Route path="/marketplace/support" element={<MarketplaceSupportPage />} />
          <Route path="/marketplace/tools/emi" element={<MarketplaceEmiCalculatorPage />} />
          <Route path="/marketplace/tools/service-cost" element={<MarketplaceServiceCostCalculatorPage />} />
          <Route path="/marketplace/buy" element={<BuyCarsPage />} />
          <Route path="/marketplace/buy/compare" element={<BuyCarComparePage />} />
          <Route path="/marketplace/buy/:listingId" element={<BuyCarDetailsPage />} />
          <Route path="/marketplace/sell" element={<SellCarsPage />} />
          <Route path="/marketplace/sell/quote" element={<SellerInstantQuotePage />} />
          <Route path="/marketplace/sell/inspection" element={<SellerInspectionBookingPage />} />
          <Route path="/marketplace/sell/final-offer" element={<SellerFinalOfferPage />} />
          <Route path="/marketplace/sell/transfer-tracker" element={<SellerTransferTrackerPage />} />
          <Route path="/buy-cars" element={<Navigate to="/marketplace/buy" replace />} />
          <Route path="/sell-cars" element={<Navigate to="/marketplace/sell" replace />} />
        </Route>
        */}
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />

          {/* ✅ Other Pages */}
          <Route path="/about-us" element={<Aboutpage />} />
          <Route path="/updates-page" element={<Updatespage />} />
          <Route path="/news-page" element={<Newspage />} />
          <Route path="/login-page" element={<Loginpage />} />
          <Route path="/login-otp" element={<OtpLoginPage />} />
          <Route path="/user-login" element={<Navigate to="/login" replace />} />
          <Route path="/user-login-otp" element={<Navigate to="/login/otp" replace />} />
          <Route path="/contact-page" element={<Contactpage />} />
          <Route path="/Raise-concern-page" element={<RaiseConcern />} />
          <Route path="/concern-chat-user" element={<UserConcernChat />} />
          <Route
            path="/concern-chat-user/:tokenId"
            element={<UserConcernChat />}
          />
          <Route path="/visit-us-page" element={<VisitUs />} />
          <Route path="/pay-challan" element={<ChallanPay />} />
          <Route path="/Report-page" element={<Reports />} />
          <Route path="/explore-page" element={<Explorepage />} />
          <Route path="/order-qr" element={<OrderQrPage />} />
          <Route path="/career-page" element={<CareerPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />

          {/* Information page */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/digivahan-privacy-policy"
            element={<Navigate to="/privacy-policy" replace />}
          />
          <Route path="/protection-policy" element={<ProtectionPolicy />} />
          <Route
            path="/return-refund-policy"
            element={<ReturnRefundPolicy />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionsPage />}
          />
        </Route>

        <Route path="/digivahan/challan-pay/app" element={<ChallanPayForApp />} />

        <Route path="/digivahan/about-us" element={<SemanticPage label="About DigiVahan"><Aboutpage /></SemanticPage>} />
        <Route path="/digivahan/privacy-policy" element={<SemanticPage label="Privacy policy"><PrivacyPolicy /></SemanticPage>} />
        <Route
          path="/digivahan/protection-policy"
          element={<SemanticPage label="Data protection policy"><ProtectionPolicy /></SemanticPage>}
        />
        <Route
          path="/digivahan/terms-and-conditions"
          element={<SemanticPage label="Terms and conditions"><TermsAndConditionsPage /></SemanticPage>}
        />


        <Route
          path="/send-notification/:qr_id"
          element={<SemanticPage label="Send notification"><SendNotificationpage /></SemanticPage>}
        />

        <Route
          path="/connect-tabs/:qr_id/:issue_type"
          element={<SemanticPage label="Connect tabs"><ConnectTabs /></SemanticPage>}
        />

        <Route
          path="/accident-notification/:qr_id"
          element={<SemanticPage label="Accident notification"><AccidentNotification /></SemanticPage>}
        />

        <Route
          path="/emergency-notification/:qr_id"
          element={<SemanticPage label="Emergency contact notification"><EmergencyContactUspage /></SemanticPage>}
        />

        <Route
          path="/access-vehicle-doc/:qr_id"
          element={<SemanticPage label="Access vehicle documents"><AccessVehicleDoc /></SemanticPage>}
        />

        {/* iOS App Pages */}
        <Route path="/ios/login" element={<SemanticPage label="iOS login"><IOSLoginPage /></SemanticPage>} />
        <Route path="/ios/verify-number" element={<SemanticPage label="Verify number"><VerifyNumber /></SemanticPage>} />
        <Route path="/ios/verify-email" element={<SemanticPage label="Verify email"><VerifyEmail /></SemanticPage>} />
        <Route path="/ios/verify-otp" element={<SemanticPage label="Verify OTP"><VerifyOTP /></SemanticPage>} />
        <Route path="/ios/account-created" element={<SemanticPage label="Account created"><AccountCreated /></SemanticPage>} />
        <Route path="/ios/login-success" element={<SemanticPage label="Login success"><LoginSuccess /></SemanticPage>} />
        <Route path="/ios/reset-password" element={<SemanticPage label="Reset password"><ResetPassword /></SemanticPage>} />
        <Route path="/ios/password-changed" element={<SemanticPage label="Password changed"><PasswordChanged /></SemanticPage>} />
        <Route path="/ios/dashboard" element={<SemanticPage label="iOS dashboard"><Home /></SemanticPage>} />
        <Route path="/ios/profile" element={<SemanticPage label="Profile"><Profile /></SemanticPage>} />
        <Route path="/ios/notifications" element={<SemanticPage label="Notifications"><Notification /></SemanticPage>} />
        <Route path="/ios/chat" element={<SemanticPage label="Chat"><Chat /></SemanticPage>} />
        <Route path="/ios/document-vault" element={<SemanticPage label="Document vault"><DocumentVault /></SemanticPage>} />
        <Route path="/ios/my-order" element={<SemanticPage label="My order"><MyOrder /></SemanticPage>} />
        <Route path="/ios/track-order" element={<SemanticPage label="Track order"><TrackOrder /></SemanticPage>} />
        <Route path="/ios/my-garage" element={<SemanticPage label="My garage"><MyGarage /></SemanticPage>} />
        <Route path="/ios/vehicle-info" element={<SemanticPage label="Vehicle information"><VehicleInfo /></SemanticPage>} />
        <Route path="/ios/my-virtual-qr-empty" element={<SemanticPage label="Virtual QR empty state"><MyVirtualQREmpty /></SemanticPage>} />
        <Route path="/ios/my-virtual-qr-list" element={<SemanticPage label="Virtual QR list"><MyVirtualQRList /></SemanticPage>} />
        <Route
          path="/ios/my-virtual-qr-detail"
          element={<SemanticPage label="Virtual QR details"><MyVirtualQRDetail /></SemanticPage>}
        />
        <Route path="/ios/update-profile" element={<SemanticPage label="Update profile"><UpdateProfile /></SemanticPage>} />
        <Route path="/ios/basic-details" element={<SemanticPage label="Basic details"><BasicDetails /></SemanticPage>} />
        <Route path="/ios/public-details" element={<SemanticPage label="Public details"><PublicDetails /></SemanticPage>} />
        <Route
          path="/ios/emergency-contacts-empty"
          element={<SemanticPage label="Emergency contacts"><EmergencyContactsEmpty /></SemanticPage>}
        />
        <Route
          path="/ios/emergency-contacts-list"
          element={<SemanticPage label="Emergency contacts list"><EmergencyContactsList /></SemanticPage>}
        />
        <Route
          path="/ios/edit-emergency-contact"
          element={<SemanticPage label="Edit emergency contact"><EditEmergencyContact /></SemanticPage>}
        />
        <Route
          path="/ios/add-emergency-contact"
          element={<SemanticPage label="Add emergency contact"><AddEmergencyContact /></SemanticPage>}
        />
        <Route path="/ios/change-password" element={<SemanticPage label="Change password"><ChangePassword /></SemanticPage>} />
        <Route path="/ios/about-us" element={<SemanticPage label="About DigiVahan iOS"><IOSAboutUs /></SemanticPage>} />
        <Route path="/ios/terms-conditions" element={<SemanticPage label="iOS terms and conditions"><IOSTermsConditions /></SemanticPage>} />
        <Route path="/ios/privacy-policy" element={<SemanticPage label="iOS privacy policy"><IOSPrivacyPolicy /></SemanticPage>} />
        <Route path="/ios/review-order" element={<SemanticPage label="Review order"><ReviewOrder /></SemanticPage>} />
        <Route
          path="/ios/edit-delivery-address"
          element={<SemanticPage label="Edit delivery address"><EditDeliveryAddress /></SemanticPage>}
        />
        <Route path="/ios/payment" element={<SemanticPage label="Payment"><Payment /></SemanticPage>} />
        <Route path="/ios/order-successful" element={<SemanticPage label="Order successful"><OrderSuccessful /></SemanticPage>} />
        <Route
          element={
            <ProtectedRoutes>
              <AdminPannel />
            </ProtectedRoutes>
          }
        >
          <Route path="/admin-panel" element={<Dashboard />} />
          <Route path="/orders-panel" element={<Order />} />
          <Route
            path="/orders-panel/shiprocket"
            element={<ShiprocketOrders />}
          />
          <Route path="/orders-panel/delhivery" element={<DelhiveryOrders />} />
          <Route
            path="/orders-panel/generate-manifest"
            element={<GenerateManifest />}
          />
          <Route
            path="/orders-panel/delivery-partners"
            element={<DeliveryPartners />}
          />
          <Route path="/orders-panel/manage" element={<ManageOrder />} />
          <Route
            path="/orders-panel/pending-orders"
            element={<PendingOrders />}
          />
          <Route
            path="/orders-panel/confirmed-orders"
            element={<ConfirmedOrders />}
          />
          <Route
            path="/orders-panel/cancelled-orders"
            element={<CancelledOrders />}
          />
          <Route path="/qr-panel" element={<Qrmanagement />} />
          <Route path="/filter-qr" element={<FilterQR />} />
          <Route path="/generate-qr" element={<GenerateQR />} />
          <Route path="/check-assigned-qr" element={<AssignedQR />} />
          <Route path="/check-blocked-qr" element={<BlockedQR />} />
          <Route path="/allotted-qr-code" element={<AllottedQrCode />} />
          <Route path="/unassigned-qr" element={<UnassignedQR />} />
          <Route path="/sales-details-page" element={<SalesDetails />} />
          <Route path="/manage-user" element={<ManageUserApp />} />

          <Route path="/our-policies" element={<UpdatePolicies />} />
          <Route path="/edit-policy/:title" element={<Editpolicypage />} />
          <Route path="/fuel-Price" element={<FuelPriceManager />} />
          <Route path="/manage-tranding-car" element={<ManageTrendingCars />} />
          <Route path="/add-tranding-car" element={<AddTrandingCars />} />
          <Route path="/update-tranding-car" element={<UpdateTrandingCars />} />
          <Route path="/view-tranding-car" element={<ViewTrandingCars />} />
          <Route path="/delete-tranding-car" element={<DeleteTrandingCars />} />
          <Route
            path="/manage-popular-comparision"
            element={<ManagePopularComparision />}
          />
          <Route path="/manage-tips-info" element={<ManageTipsInfo />} />
          <Route path="/manage-news" element={<ManageNews />} />
          <Route path="/manage-qr-guide" element={<ManageQRGuide />} />
          <Route path="/manage-qr-benefits" element={<ManageQRBenefits />} />
          <Route path="/manage-app-info" element={<ManageAppInfo />} />
          <Route path="/customer-queries" element={<CustomerQueries />} />
          <Route path="/manage-concerns" element={<ManageConcerns />} />
          <Route
            path="/manage-concerns/:concernId"
            element={<ManageConcerns />}
          />
          <Route path="/concern-chat-admin" element={<ConcernChat />} />
          <Route
            path="/concern-chat-admin/:concernId"
            element={<ConcernChat />}
          />
          <Route
            path="/delete-account-requests"
            element={<DeleteAccountRequests />}
          />
          <Route path="/report-issues" element={<ReportIssueList />} />
          <Route path="/manage-appointment" element={<ManageAppointment />} />
          <Route path="/challan-webhook-admin" element={<ChallanWebhookAdmin />} />
          <Route path="/hr-manager" element={<HRManager />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/post-faq" element={<PostFAQ />} />
          <Route path="/delete-faq" element={<DeleteFAQ />} />
          <Route path="/update-faq" element={<UpdateFAQ />} />
          <Route
            path="/general-information-queries"
            element={<GeneralInformationQueries />}
          />
          <Route path="/technical-queries" element={<TechnicalQueries />} />
          <Route path="/account-related" element={<AccountRelated />} />
          <Route path="/payment-billing" element={<PaymentBilling />} />
          <Route
            path="/order-service-status"
            element={<OrderServiceStatus />}
          />
          <Route
            path="/product-service-complaints"
            element={<ProductServiceComplaints />}
          />
          <Route
            path="/feedback-suggestions"
            element={<FeedbackSuggestions />}
          />
          <Route path="/cancellation-return" element={<CancellationReturn />} />
          <Route path="/escalation" element={<Escalation />} />
          <Route path="/onboarding-setup" element={<OnboardingSetup />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route
            path="/verification-queries"
            element={<VerificationQueries />}
          />
          <Route path="/customer-queries/reply" element={<ReplyPage />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/reviews/positive" element={<PositiveReviews />} />
          <Route path="/admin/reviews/average" element={<AverageReviews />} />
          <Route path="/admin/reviews/negative" element={<NegativeReviews />} />
          <Route path="/admin/reviews/reply" element={<ReplyToReview />} />
          <Route path="/admin/issues" element={<Issues />} />
          <Route path="/admin/issues/priority" element={<PriorityIssue />} />
          <Route path="/admin/issues/app" element={<AppIssue />} />
          <Route path="/admin/issues/service" element={<ServiceIssue />} />
          <Route path="/admin/issues/support" element={<SupportIssue />} />
          <Route path="/admin/issues/suggestion" element={<Suggestion />} />
          <Route
            path="/admin/issues/resolution"
            element={<IssueResolution />}
          />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route
            path="/admin/reports/vehicle-owners"
            element={<VehicleOwnerReports />}
          />
          <Route
            path="/admin/reports/interactors"
            element={<InteractorReports />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
