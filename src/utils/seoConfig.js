const SITE_NAME = "DigiVahan";
const SITE_URL = "https://digivahan.in";
const DEFAULT_IMAGE = "/logo.png";

const DEFAULT_TITLE = "DigiVahan | Smart Vehicle Safety & QR Solutions";
const DEFAULT_DESCRIPTION =
  "DigiVahan helps you manage vehicle safety, emergency contacts, reminders, and smart QR-powered road assistance from one platform.";
const DEFAULT_KEYWORDS =
  "DigiVahan, vehicle safety, smart QR, emergency contact, road assistance, digital vehicle services";

const PRIVATE_PATH_PREFIXES = [
  "/admin-panel",
  "/orders-panel",
  "/qr-panel",
  "/filter-qr",
  "/generate-qr",
  "/check-assigned-qr",
  "/check-blocked-qr",
  "/allotted-qr-code",
  "/sales-details-page",
  "/manage-user",
  "/our-policies",
  "/edit-policy",
  "/fuel-price",
  "/fuel-price",
  "/manage-tranding-car",
  "/add-tranding-car",
  "/update-tranding-car",
  "/view-tranding-car",
  "/delete-tranding-car",
  "/manage-popular-comparision",
  "/manage-tips-info",
  "/manage-news",
  "/manage-qr-guide",
  "/manage-qr-benefits",
  "/manage-app-info",
  "/customer-queries",
  "/manage-concerns",
  "/concern-chat-admin",
  "/delete-account-requests",
  "/report-issues",
  "/manage-appointment",
  "/post-faq",
  "/delete-faq",
  "/update-faq",
  "/general-information-queries",
  "/technical-queries",
  "/account-related",
  "/payment-billing",
  "/order-service-status",
  "/product-service-complaints",
  "/feedback-suggestions",
  "/cancellation-return",
  "/escalation",
  "/onboarding-setup",
  "/subscription",
  "/verification-queries",
  "/admin/",
];

const NO_INDEX_PREFIXES = [
  "/login-page",
  "/login-otp",
  "/user-login",
  "/user-login-otp",
  "/send-notification",
  "/connect-tabs",
  "/accident-notification",
  "/emergency-notification",
  "/access-vehicle-doc",
  "/raise-concern-page",
  "/concern-chat-user",
  "/delete-account",
  "/ios/login",
  "/ios/verify-number",
  "/ios/verify-email",
  "/ios/verify-otp",
  "/ios/account-created",
  "/ios/login-success",
  "/ios/reset-password",
  "/ios/password-changed",
  "/ios/profile",
  "/ios/notifications",
  "/ios/chat",
  "/ios/document-vault",
  "/ios/my-order",
  "/ios/track-order",
  "/ios/my-garage",
  "/ios/vehicle-info",
  "/ios/my-virtual-qr-empty",
  "/ios/my-virtual-qr-list",
  "/ios/my-virtual-qr-detail",
  "/ios/update-profile",
  "/ios/basic-details",
  "/ios/public-details",
  "/ios/emergency-contacts-empty",
  "/ios/emergency-contacts-list",
  "/ios/edit-emergency-contact",
  "/ios/add-emergency-contact",
  "/ios/change-password",
  "/ios/review-order",
  "/ios/edit-delivery-address",
  "/ios/payment",
  "/ios/order-successful",
  ...PRIVATE_PATH_PREFIXES,
];

const PAGE_META = [
  {
    match: (pathname) => pathname === "/",
    title: "DigiVahan | Smart Vehicle Services in India",
    description:
      "Explore DigiVahan smart vehicle services including safety QR features, renewal reminders, and emergency assistance tools.",
  },
  {
    match: (pathname) =>
      ["/about-us", "/digivahan/about-us", "/ios/about-us"].includes(pathname),
    title: "About Us | DigiVahan",
    description:
      "Learn about DigiVahan, our mission, and how we help make road journeys safer through digital vehicle solutions.",
  },
  {
    match: (pathname) => pathname === "/visit-us-page",
    title: "Visit Us | DigiVahan",
    description:
      "Get DigiVahan contact and office details to connect with our team for support and service guidance.",
  },
  {
    match: (pathname) => pathname === "/contact-page",
    title: "Contact Us | DigiVahan",
    description:
      "Reach out to DigiVahan support for assistance with services, concerns, and vehicle safety features.",
  },
  {
    match: (pathname) => pathname === "/login-page",
    title: "Login | DigiVahan",
    description: "Login to your DigiVahan account to access smart vehicle services and support.",
  },
  {
    match: (pathname) => pathname === "/login-otp",
    title: "OTP Verification | DigiVahan",
    description: "Verify your OTP to securely sign in to DigiVahan.",
  },
  {
    match: (pathname) => pathname === "/user-login",
    title: "User Login | DigiVahan Marketplace",
    description:
      "Login to DigiVahan Marketplace and access both buy and sell car journeys from one account.",
  },
  {
    match: (pathname) => pathname === "/user-login-otp",
    title: "User OTP Verification | DigiVahan Marketplace",
    description:
      "Verify your OTP to unlock buying and selling car features in DigiVahan Marketplace.",
  },
  {
    match: (pathname) => pathname === "/raise-concern-page",
    title: "Raise a Concern | DigiVahan",
    description: "Submit your issue or concern and get support from the DigiVahan team.",
  },
  {
    match: (pathname) => pathname.startsWith("/concern-chat-user"),
    title: "Concern Chat | DigiVahan",
    description: "Track and discuss your submitted concern with DigiVahan support.",
  },
  {
    match: (pathname) => pathname === "/delete-account",
    title: "Delete Account | DigiVahan",
    description: "Request account deletion and review the implications for your DigiVahan profile.",
  },
  {
    match: (pathname) => pathname.startsWith("/send-notification"),
    title: "Send Notification | DigiVahan",
    description: "Send urgent notifications related to a DigiVahan QR-linked vehicle.",
  },
  {
    match: (pathname) => pathname.startsWith("/connect-tabs"),
    title: "Connect Options | DigiVahan",
    description: "Choose the right communication option for vehicle-related assistance.",
  },
  {
    match: (pathname) => pathname.startsWith("/accident-notification"),
    title: "Accident Notification | DigiVahan",
    description: "Notify emergency contacts quickly in case of a road accident.",
  },
  {
    match: (pathname) => pathname.startsWith("/emergency-notification"),
    title: "Emergency Contact Notification | DigiVahan",
    description: "Trigger emergency contact notifications linked to DigiVahan QR data.",
  },
  {
    match: (pathname) => pathname.startsWith("/access-vehicle-doc"),
    title: "Access Vehicle Documents | DigiVahan",
    description: "Access uploaded vehicle documents for verified DigiVahan users.",
  },
  {
    match: (pathname) => pathname === "/explore-page",
    title: "Explore Features | DigiVahan",
    description:
      "Explore all DigiVahan features including QR-based vehicle safety, notifications, and smart assistance services.",
  },
  {
    match: (pathname) => pathname === "/updates-page",
    title: "Updates | DigiVahan",
    description: "Read the latest DigiVahan updates and product improvements.",
  },
  {
    match: (pathname) => pathname === "/news-page",
    title: "News | DigiVahan",
    description: "Stay informed with DigiVahan news and announcements.",
  },
  {
    match: (pathname) =>
      [
        "/privacy-policy",
        "/digivahan/privacy-policy",
        "/ios/privacy-policy",
      ].includes(pathname),
    title: "Privacy Policy | DigiVahan",
    description: "Read the DigiVahan privacy policy and data handling commitments.",
  },
  {
    match: (pathname) => ["/protection-policy", "/digivahan/protection-policy"].includes(pathname),
    title: "Data Protection Policy | DigiVahan",
    description:
      "Review DigiVahan data protection practices and user information safeguards.",
  },
  {
    match: (pathname) => pathname === "/return-refund-policy",
    title: "Return & Refund Policy | DigiVahan",
    description: "Review DigiVahan return and refund terms for relevant services.",
  },
  {
    match: (pathname) =>
      ["/terms-and-conditions", "/digivahan/terms-and-conditions", "/ios/terms-conditions"].includes(pathname),
    title: "Terms and Conditions | DigiVahan",
    description:
      "Read DigiVahan terms and conditions for usage, responsibilities, and service rules.",
  },
  {
    match: (pathname) => pathname === "/report-page",
    title: "Reports | DigiVahan",
    description: "Access reporting options and resources provided by DigiVahan.",
  },

  // iOS app routes
  {
    match: (pathname) => pathname === "/ios/login",
    title: "iOS Login | DigiVahan",
    description: "Securely log in to DigiVahan iOS to access your account.",
  },
  {
    match: (pathname) => pathname === "/ios/verify-number",
    title: "iOS Verify Number | DigiVahan",
    description: "Verify your mobile number to continue onboarding in the DigiVahan iOS app.",
  },
  {
    match: (pathname) => pathname === "/ios/verify-email",
    title: "iOS Verify Email | DigiVahan",
    description: "Confirm your email address for secure DigiVahan iOS account access.",
  },
  {
    match: (pathname) => pathname === "/ios/verify-otp",
    title: "iOS Verify OTP | DigiVahan",
    description: "Complete OTP verification to authenticate your DigiVahan iOS session.",
  },
  {
    match: (pathname) => pathname === "/ios/account-created",
    title: "Account Created | DigiVahan iOS",
    description: "Your DigiVahan iOS account has been created successfully.",
  },
  {
    match: (pathname) => pathname === "/ios/login-success",
    title: "Login Success | DigiVahan iOS",
    description: "You are signed in and ready to use DigiVahan iOS features.",
  },
  {
    match: (pathname) => pathname === "/ios/reset-password",
    title: "Reset Password | DigiVahan iOS",
    description: "Reset your DigiVahan iOS password securely.",
  },
  {
    match: (pathname) => pathname === "/ios/password-changed",
    title: "Password Changed | DigiVahan iOS",
    description: "Your DigiVahan iOS password has been updated.",
  },
  {
    match: (pathname) => pathname === "/ios/dashboard",
    title: "iOS Dashboard | DigiVahan",
    description:
      "Manage your DigiVahan account and vehicle services from the iOS dashboard.",
    robots: "noindex,nofollow",
  },
  {
    match: (pathname) => pathname === "/ios/profile",
    title: "iOS Profile | DigiVahan",
    description: "View and manage your DigiVahan iOS profile details.",
  },
  {
    match: (pathname) => pathname === "/ios/notifications",
    title: "iOS Notifications | DigiVahan",
    description: "Review your latest DigiVahan iOS notifications and alerts.",
  },
  {
    match: (pathname) => pathname === "/ios/chat",
    title: "iOS Chat | DigiVahan",
    description: "Connect via chat for support and communication in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/document-vault",
    title: "iOS Document Vault | DigiVahan",
    description: "Store and access important vehicle documents in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/my-order",
    title: "iOS My Orders | DigiVahan",
    description: "View your DigiVahan iOS order history and details.",
  },
  {
    match: (pathname) => pathname === "/ios/track-order",
    title: "iOS Track Order | DigiVahan",
    description: "Track your DigiVahan iOS order status in real time.",
  },
  {
    match: (pathname) => pathname === "/ios/my-garage",
    title: "iOS My Garage | DigiVahan",
    description: "Manage your saved vehicles in the DigiVahan iOS garage.",
  },
  {
    match: (pathname) => pathname === "/ios/vehicle-info",
    title: "iOS Vehicle Info | DigiVahan",
    description: "Review your vehicle information in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/my-virtual-qr-empty",
    title: "iOS Virtual QR | DigiVahan",
    description: "Start setting up your virtual QR in the DigiVahan iOS app.",
  },
  {
    match: (pathname) => pathname === "/ios/my-virtual-qr-list",
    title: "iOS Virtual QR List | DigiVahan",
    description: "View all your active virtual QR profiles in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/my-virtual-qr-detail",
    title: "iOS Virtual QR Details | DigiVahan",
    description: "Review and manage a selected virtual QR in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/update-profile",
    title: "iOS Update Profile | DigiVahan",
    description: "Update your account profile details in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/basic-details",
    title: "iOS Basic Details | DigiVahan",
    description: "Manage your basic user details in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/public-details",
    title: "iOS Public Details | DigiVahan",
    description: "Control public profile information in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/emergency-contacts-empty",
    title: "iOS Emergency Contacts | DigiVahan",
    description: "Add emergency contacts to activate critical alerts in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/emergency-contacts-list",
    title: "iOS Emergency Contacts List | DigiVahan",
    description: "View and manage your emergency contacts in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/edit-emergency-contact",
    title: "iOS Edit Emergency Contact | DigiVahan",
    description: "Edit an emergency contact used for DigiVahan alert workflows.",
  },
  {
    match: (pathname) => pathname === "/ios/add-emergency-contact",
    title: "iOS Add Emergency Contact | DigiVahan",
    description: "Add a new emergency contact in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/change-password",
    title: "iOS Change Password | DigiVahan",
    description: "Change your DigiVahan iOS password to keep your account secure.",
  },
  {
    match: (pathname) => pathname === "/ios/review-order",
    title: "iOS Review Order | DigiVahan",
    description: "Review order details before checkout in DigiVahan iOS.",
  },
  {
    match: (pathname) => pathname === "/ios/edit-delivery-address",
    title: "iOS Edit Delivery Address | DigiVahan",
    description: "Update your delivery address for DigiVahan iOS orders.",
  },
  {
    match: (pathname) => pathname === "/ios/payment",
    title: "iOS Payment | DigiVahan",
    description: "Complete secure payment for your DigiVahan iOS order.",
  },
  {
    match: (pathname) => pathname === "/ios/order-successful",
    title: "iOS Order Successful | DigiVahan",
    description: "Your DigiVahan iOS order has been placed successfully.",
  },

  // Admin routes
  {
    match: (pathname) => pathname === "/admin-panel",
    title: "Admin Dashboard | DigiVahan",
    description: "View key metrics and operations from the DigiVahan admin dashboard.",
  },
  {
    match: (pathname) => pathname === "/orders-panel",
    title: "Admin Orders | DigiVahan",
    description: "Manage orders and fulfillment workflows in the DigiVahan admin panel.",
  },
  {
    match: (pathname) => pathname === "/orders-panel/shiprocket",
    title: "Shiprocket Orders | DigiVahan Admin",
    description: "Track and manage Shiprocket orders in DigiVahan admin.",
  },
  {
    match: (pathname) => pathname === "/orders-panel/delhivery",
    title: "Delhivery Orders | DigiVahan Admin",
    description: "Track and manage Delhivery orders in DigiVahan admin.",
  },
  {
    match: (pathname) => pathname === "/orders-panel/generate-manifest",
    title: "Generate Manifest | DigiVahan Admin",
    description: "Generate shipping manifests for orders in DigiVahan admin.",
  },
  {
    match: (pathname) => pathname === "/orders-panel/delivery-partners",
    title: "Delivery Partners | DigiVahan Admin",
    description: "Manage delivery partner configurations in DigiVahan admin.",
  },
  {
    match: (pathname) => pathname === "/orders-panel/manage",
    title: "Manage Orders | DigiVahan Admin",
    description: "Perform order actions and monitor progress from a unified admin view.",
  },
  {
    match: (pathname) => pathname === "/qr-panel",
    title: "QR Management | DigiVahan Admin",
    description: "Manage QR lifecycle, status, and allocation in DigiVahan admin.",
  },
  {
    match: (pathname) => pathname === "/filter-qr",
    title: "Filter QR Codes | DigiVahan Admin",
    description: "Filter and search DigiVahan QR records efficiently.",
  },
  {
    match: (pathname) => pathname === "/generate-qr",
    title: "Generate QR Codes | DigiVahan Admin",
    description: "Generate new DigiVahan QR codes for vehicle profiles.",
  },
  {
    match: (pathname) => pathname === "/check-assigned-qr",
    title: "Assigned QR Codes | DigiVahan Admin",
    description: "Review assigned DigiVahan QR codes and their owners.",
  },
  {
    match: (pathname) => pathname === "/check-blocked-qr",
    title: "Blocked QR Codes | DigiVahan Admin",
    description: "Monitor blocked DigiVahan QR codes and associated actions.",
  },
  {
    match: (pathname) => pathname === "/allotted-qr-code",
    title: "Allotted QR Codes | DigiVahan Admin",
    description: "View allotted QR code inventory and assignment status.",
  },
  {
    match: (pathname) => pathname === "/sales-details-page",
    title: "Sales Details | DigiVahan Admin",
    description: "Review sales performance and transaction data in admin.",
  },
  {
    match: (pathname) => pathname === "/manage-user",
    title: "Manage User App Content | DigiVahan Admin",
    description: "Control app content modules and user-facing data from admin.",
  },
  {
    match: (pathname) => pathname === "/our-policies",
    title: "Manage Policies | DigiVahan Admin",
    description: "Maintain policy documents shown in the DigiVahan app.",
  },
  {
    match: (pathname) => pathname.startsWith("/edit-policy/"),
    title: "Edit Policy | DigiVahan Admin",
    description: "Update policy content and publish changes from admin.",
  },
  {
    match: (pathname) => pathname === "/fuel-price",
    title: "Fuel Price Manager | DigiVahan Admin",
    description: "Manage fuel price information available to users.",
  },
  {
    match: (pathname) => pathname === "/manage-tranding-car",
    title: "Manage Trending Cars | DigiVahan Admin",
    description: "Control trending car listings in DigiVahan user app.",
  },
  {
    match: (pathname) => pathname === "/add-tranding-car",
    title: "Add Trending Car | DigiVahan Admin",
    description: "Add new entries to the trending cars section.",
  },
  {
    match: (pathname) => pathname === "/update-tranding-car",
    title: "Update Trending Car | DigiVahan Admin",
    description: "Update existing trending car records in admin.",
  },
  {
    match: (pathname) => pathname === "/view-tranding-car",
    title: "View Trending Cars | DigiVahan Admin",
    description: "View all trending car entries from the admin portal.",
  },
  {
    match: (pathname) => pathname === "/delete-tranding-car",
    title: "Delete Trending Car | DigiVahan Admin",
    description: "Remove outdated trending car entries from app content.",
  },
  {
    match: (pathname) => pathname === "/manage-popular-comparision",
    title: "Manage Popular Comparison | DigiVahan Admin",
    description: "Manage popular vehicle comparison cards and content.",
  },
  {
    match: (pathname) => pathname === "/manage-tips-info",
    title: "Manage Tips Info | DigiVahan Admin",
    description: "Update user tips and informational content modules.",
  },
  {
    match: (pathname) => pathname === "/manage-news",
    title: "Manage News | DigiVahan Admin",
    description: "Publish and maintain news content in the DigiVahan app.",
  },
  {
    match: (pathname) => pathname === "/manage-qr-guide",
    title: "Manage QR Guide | DigiVahan Admin",
    description: "Maintain QR usage guides shown to end users.",
  },
  {
    match: (pathname) => pathname === "/manage-qr-benefits",
    title: "Manage QR Benefits | DigiVahan Admin",
    description: "Edit QR benefits content to help user awareness.",
  },
  {
    match: (pathname) => pathname === "/manage-app-info",
    title: "Manage App Info | DigiVahan Admin",
    description: "Update app-level informational content from admin.",
  },
  {
    match: (pathname) => pathname === "/customer-queries",
    title: "Customer Queries | DigiVahan Admin",
    description: "Handle incoming customer queries and support buckets.",
  },
  {
    match: (pathname) => pathname === "/customer-queries/reply",
    title: "Reply to Query | DigiVahan Admin",
    description: "Compose and send responses to customer queries.",
  },
  {
    match: (pathname) => pathname === "/manage-concerns" || pathname.startsWith("/manage-concerns/"),
    title: "Manage Concerns | DigiVahan Admin",
    description: "Review and process user concerns in the admin queue.",
  },
  {
    match: (pathname) => pathname === "/concern-chat-admin" || pathname.startsWith("/concern-chat-admin/"),
    title: "Concern Chat Admin | DigiVahan",
    description: "Interact with users and resolve concerns through admin chat.",
  },
  {
    match: (pathname) => pathname === "/delete-account-requests",
    title: "Delete Account Requests | DigiVahan Admin",
    description: "Review and process account deletion requests.",
  },
  {
    match: (pathname) => pathname === "/report-issues",
    title: "Reported Issues | DigiVahan Admin",
    description: "Track reported issues and assign action priorities.",
  },
  {
    match: (pathname) => pathname === "/manage-appointment",
    title: "Manage Appointments | DigiVahan Admin",
    description: "Manage support appointments and follow-up scheduling.",
  },
  {
    match: (pathname) => pathname === "/post-faq",
    title: "Post FAQ | DigiVahan Admin",
    description: "Create new FAQ entries for customer self-help.",
  },
  {
    match: (pathname) => pathname === "/delete-faq",
    title: "Delete FAQ | DigiVahan Admin",
    description: "Remove outdated FAQ entries from support content.",
  },
  {
    match: (pathname) => pathname === "/update-faq",
    title: "Update FAQ | DigiVahan Admin",
    description: "Edit existing FAQ entries and improve support content.",
  },
  {
    match: (pathname) => pathname === "/general-information-queries",
    title: "General Info Queries | DigiVahan Admin",
    description: "Handle general information related customer queries.",
  },
  {
    match: (pathname) => pathname === "/technical-queries",
    title: "Technical Queries | DigiVahan Admin",
    description: "Process technical issue queries from customers.",
  },
  {
    match: (pathname) => pathname === "/account-related",
    title: "Account Related Queries | DigiVahan Admin",
    description: "Handle account, profile, and login related user queries.",
  },
  {
    match: (pathname) => pathname === "/payment-billing",
    title: "Payment & Billing Queries | DigiVahan Admin",
    description: "Manage payment and billing support cases.",
  },
  {
    match: (pathname) => pathname === "/order-service-status",
    title: "Order & Service Status Queries | DigiVahan Admin",
    description: "Resolve customer queries about order and service status.",
  },
  {
    match: (pathname) => pathname === "/product-service-complaints",
    title: "Product & Service Complaints | DigiVahan Admin",
    description: "Track and resolve product or service complaints.",
  },
  {
    match: (pathname) => pathname === "/feedback-suggestions",
    title: "Feedback & Suggestions | DigiVahan Admin",
    description: "Review and categorize user feedback and suggestions.",
  },
  {
    match: (pathname) => pathname === "/cancellation-return",
    title: "Cancellation & Return Queries | DigiVahan Admin",
    description: "Manage cancellation and return-related customer queries.",
  },
  {
    match: (pathname) => pathname === "/escalation",
    title: "Escalation Queries | DigiVahan Admin",
    description: "Track escalated support cases and priority handling.",
  },
  {
    match: (pathname) => pathname === "/onboarding-setup",
    title: "Onboarding & Setup Queries | DigiVahan Admin",
    description: "Handle onboarding and setup assistance requests.",
  },
  {
    match: (pathname) => pathname === "/subscription",
    title: "Subscription Queries | DigiVahan Admin",
    description: "Manage subscription-related user questions and cases.",
  },
  {
    match: (pathname) => pathname === "/verification-queries",
    title: "Verification Queries | DigiVahan Admin",
    description: "Handle KYC and verification-related support cases.",
  },
  {
    match: (pathname) => pathname === "/admin/reviews",
    title: "Reviews | DigiVahan Admin",
    description: "View and moderate user reviews from the admin dashboard.",
  },
  {
    match: (pathname) => pathname === "/admin/reviews/positive",
    title: "Positive Reviews | DigiVahan Admin",
    description: "Review positive feedback submitted by users.",
  },
  {
    match: (pathname) => pathname === "/admin/reviews/average",
    title: "Average Reviews | DigiVahan Admin",
    description: "Review average sentiment feedback from users.",
  },
  {
    match: (pathname) => pathname === "/admin/reviews/negative",
    title: "Negative Reviews | DigiVahan Admin",
    description: "Review negative feedback and prioritize issue resolution.",
  },
  {
    match: (pathname) => pathname === "/admin/reviews/reply",
    title: "Reply to Review | DigiVahan Admin",
    description: "Post official responses to user reviews.",
  },
  {
    match: (pathname) => pathname === "/admin/issues",
    title: "Issues | DigiVahan Admin",
    description: "Track all reported app and service issues.",
  },
  {
    match: (pathname) => pathname === "/admin/issues/priority",
    title: "Priority Issues | DigiVahan Admin",
    description: "Monitor and resolve high-priority reported issues.",
  },
  {
    match: (pathname) => pathname === "/admin/issues/app",
    title: "App Issues | DigiVahan Admin",
    description: "Manage app functionality issues reported by users.",
  },
  {
    match: (pathname) => pathname === "/admin/issues/service",
    title: "Service Issues | DigiVahan Admin",
    description: "Manage operational and service-related issues.",
  },
  {
    match: (pathname) => pathname === "/admin/issues/support",
    title: "Support Issues | DigiVahan Admin",
    description: "Track support delivery issues and response quality.",
  },
  {
    match: (pathname) => pathname === "/admin/issues/suggestion",
    title: "Suggestions | DigiVahan Admin",
    description: "Review feature suggestions and product improvement ideas.",
  },
  {
    match: (pathname) => pathname === "/admin/issues/resolution",
    title: "Issue Resolution | DigiVahan Admin",
    description: "Resolve and close tracked issues from a central admin flow.",
  },
  {
    match: (pathname) => pathname === "/admin/reports",
    title: "Reports Dashboard | DigiVahan Admin",
    description: "Analyze reporting insights from the DigiVahan admin dashboard.",
  },
  {
    match: (pathname) => pathname === "/admin/reports/vehicle-owners",
    title: "Vehicle Owner Reports | DigiVahan Admin",
    description: "View report analytics focused on vehicle owner activity.",
  },
  {
    match: (pathname) => pathname === "/admin/reports/interactors",
    title: "Interactor Reports | DigiVahan Admin",
    description: "Review interaction-level reports and engagement trends.",
  },
];

function toTitleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function fallbackTitle(pathname) {
  if (pathname === "/") return DEFAULT_TITLE;

  const formattedPath = pathname.replace(/^\//, "");
  const segments = formattedPath.split("/").filter(Boolean);
  const leaf = segments[segments.length - 1] || "";
  const page = toTitleCase(leaf);

  if (!page) return DEFAULT_TITLE;
  return `${page} | ${SITE_NAME}`;
}

function startsWithAny(pathname, prefixes) {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

export function getSeoMeta(pathname = "/") {
  const normalizedPath = pathname.toLowerCase();
  const matchedMeta = PAGE_META.find((item) => item.match(normalizedPath));

  const robots =
    matchedMeta?.robots ||
    (startsWithAny(normalizedPath, NO_INDEX_PREFIXES)
      ? "noindex,nofollow"
      : "index,follow");

  return {
    title: matchedMeta?.title || fallbackTitle(normalizedPath),
    description: matchedMeta?.description || DEFAULT_DESCRIPTION,
    keywords: matchedMeta?.keywords || DEFAULT_KEYWORDS,
    image: matchedMeta?.image || DEFAULT_IMAGE,
    robots,
  };
}

export function getCanonicalUrl(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

export const seoSiteConfig = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultTitle: DEFAULT_TITLE,
  defaultDescription: DEFAULT_DESCRIPTION,
};
