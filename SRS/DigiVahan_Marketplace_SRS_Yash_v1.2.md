# DigiVahan Software Requirements Specification (SRS)
## Vehicle Marketplace Expansion - Unified Buy and Sell Module (Spinny-like)

Document Title: DigiVahan Vehicle Marketplace Expansion SRS
Version: 1.4
Date: 2026-04-09
Prepared By: Yash Raj Anand (Web Developer Intern)
Organization: DigiVahan Digital India Private Limited
Repository Scope: Frontend codebase with backend requirements inferred from API usage and business design

---

## Important Scope Note

This workspace contains frontend implementation only (React + Vite).

- Existing behavior is validated from frontend routes, state usage, and API consumption.
- Backend sections in this SRS are implementation-ready requirements and contracts.
- Backend code, schema migrations, and services must be implemented in backend repository/services.

---

## 1. Executive Summary

DigiVahan is being expanded from a QR-first utility platform to a Spinny-like marketplace that supports full vehicle commerce.

Primary v1.3 update:
- A single verified user can both buy and sell vehicles from the same account.
- The same user can switch context between Buyer Mode and Seller Mode without separate registration.
- All key flows (listing, booking, payment, transfer, QR issuance, post-sale support) support this unified account model.

---

## 2. Product Goals and Success Criteria

### 2.1 Goals

- Enable complete sell journey: listing creation, review, publication, and order completion.
- Enable complete buy journey: search, compare, reserve, checkout, payment, ownership transfer.
- Enable dual-role users (buy + sell) in one account with secure role-aware access controls.
- Integrate post-purchase QR re-issuance tied to ownership transfer.

### 2.2 Success Metrics

- Listing to publish approval SLA < 24 hours.
- Search p95 latency < 300 ms.
- Booking to payment success conversion > 40% in MVP phase.
- Transfer completion within 7 business days average.
- 100% QR refresh for completed ownership transfers.

---

## 3. User Personas and Role Model

### 3.1 Personas

- Buyer: browses vehicles, books test drives, reserves and purchases.
- Seller: lists vehicle, uploads docs/images, tracks offers and sale progress.
- Dual-role user: same account can perform buyer and seller actions.
- Admin: moderation, KYC, fraud checks, operations, analytics.

### 3.2 Unified Role Model (v1.3 Required)

- User account is unique by phone/email.
- Role capability is additive, not exclusive.
- A verified user can have both capabilities enabled:
  - can_buy = true
  - can_sell = true
- Session context can be switched in UI:
  - active_mode = buyer or seller
- Permissions are enforced by API scope and ownership checks, not by creating separate accounts.

---

## 4. Current System Analysis (From Existing Frontend)

### 4.1 Existing Architecture

- Frontend SPA: React + Vite.
- Data layer: Axios + TanStack Query.
- Shared state/services: Context API (DataProvider).
- Real-time events: Socket.IO client in admin workflows.
- Deployment target: Vercel with SPA fallback routing.

### 4.2 Existing Functional Areas

- Public and marketing pages.
- QR scan and owner-notification journeys.
- Accident/emergency utilities.
- Concern and issue reporting.
- Appointment, FAQ, delete-account request.
- Admin panel with operations modules.

### 4.3 Current Gaps

- No production-ready buyer/seller authentication for marketplace.
- No complete listing lifecycle.
- No robust search/filter marketplace index.
- No transfer-to-QR ownership automation.
- No dual-role account support for buy and sell in one profile.

---

## 5. Scope of Marketplace Module (Spinny-like)

### 5.1 In Scope

- Unified account onboarding (buyer and seller capability).
- Seller listing flow with image and document upload.
- Vehicle discovery with filters, sort, and details page.
- Booking/test-drive/reservation flow.
- Checkout and payment integration.
- Order state machine and post-order tracking.
- Ownership transfer workflow with document verification.
- New QR issuance after transfer completion.
- Reviews/ratings and dispute initiation.
- Admin moderation and analytics.

### 5.2 Out of Scope for MVP

- Full financing partner marketplace.
- In-app bargaining chat with negotiation bot.
- Cross-border transfer support.

### 5.3 Spinny-Like Capability Alignment (Reference)

Reference used for expected sell-flow experience:
- https://www.spinny.com/sell-used-car/

Target capabilities to align in DigiVahan Marketplace:
- Instant quote flow from registration number and vehicle details.
- Free inspection scheduling (home or hub) with slot selection.
- Final offer lifecycle with validity window and acceptance state.
- Same-day seller payment after verification.
- Loan/NOC-assisted closure when vehicle is financed.
- Free RC transfer workflow with progress tracking in dashboard.
- Seller protection state until transfer completion.
- Documents checklist with validation before handover.

Business rule for this project:
- One verified user must be able to buy and sell both cars from one account.

---

## 6. Functional Requirements

### 6.1 Authentication and Profile

FR-01: User can register/login with phone/email and OTP/password options.
FR-02: User profile supports both buy and sell capabilities in one account.
FR-03: User can toggle active context between Buyer and Seller in UI.
FR-04: KYC status controls access to listing publication and high-value checkout.

### 6.2 Seller Journey

FR-05: Seller can create draft listing with complete vehicle metadata.
FR-06: Seller can upload images and required documents.
FR-07: Seller can submit listing for moderation.
FR-08: Seller can track listing state: draft, pending, live, reserved, sold, archived.
FR-09: Seller receives booking/offer/order updates.

### 6.3 Buyer Journey

FR-10: Buyer can search listings by city, make, model, budget, fuel, transmission, kms.
FR-11: Buyer can view details, inspection summary, and seller profile trust indicators.
FR-12: Buyer can book test drive or reserve vehicle.
FR-13: Buyer can complete checkout and payment.
FR-14: Buyer can track order and transfer progress.

### 6.4 Unified Buy + Sell Behavior

FR-15: Same user can buy one vehicle while selling another without account conflict.
FR-16: Role-sensitive menus and dashboards are shown by active_mode.
FR-17: API responses include mode-specific summary data (buyer orders, seller listings).
FR-18: Audit logs capture mode changes and sensitive state transitions.

### 6.5 Transfer, QR, and Closure

FR-19: Paid order starts ownership transfer workflow.
FR-20: Buyer and seller can upload required transfer documents.
FR-21: Admin verification gates transfer completion.
FR-22: On completion, vehicle owner_id is updated to buyer.
FR-23: New QR is generated for new owner; previous QR marked replaced.

### 6.6 Admin Operations

FR-24: Admin can approve/reject/suspend listings.
FR-25: Admin can review KYC and fraud flags.
FR-26: Admin can monitor bookings, payments, and transfers.
FR-27: Admin can trigger/validate QR issuance and view audit trails.
FR-28: Marketplace identity must support combined capability in one account (`can_buy=true` and `can_sell=true`) as a default target state for verified users.
FR-29: Mode switching (`active_mode=buyer|seller`) must never require re-registration or second account creation.
FR-30: Marketplace dashboards and APIs must preserve separate buyer and seller data scopes while remaining under one user identity.

### 6.7 Spinny-Like Sell Module Requirements

FR-31: System must support instant quote generation using registration number and vehicle attributes.
FR-32: Seller must be able to schedule free evaluation slots for doorstep or hub inspection.
FR-33: System must produce a final offer with explicit expiry and acceptance timeline.
FR-34: Seller payout must support same-day transfer after successful verification and handover.
FR-35: For financed vehicles, system must support loan closure assistance using bank NOC workflow.
FR-36: RC transfer tracking must be visible to seller in dashboard until completion state.
FR-37: Seller protection status must remain active until legal transfer completion.
FR-38: Document readiness checklist must validate RC, insurance, PUC, ID/address proof and optional finance documents.
FR-39: Fee policy must be explicit in product configuration (default: no hidden seller charges).
FR-40: Single-account user must access buyer and seller modules without separate registration paths.

---

## 7. Non-Functional Requirements

### 7.1 Security

- JWT with short-lived access token and refresh rotation.
- OTP retry and lock policy.
- RBAC + ownership checks at every protected endpoint.
- File upload validation, malware scan, and MIME checks.
- Payment webhook signature verification and idempotency.

### 7.2 Performance

- Listing search p95 < 300 ms.
- Booking creation p95 < 400 ms.
- Payment intent creation p95 < 500 ms.
- Admin moderation list p95 < 700 ms.

### 7.3 Reliability

- Retry-safe order and payment update operations.
- Async processing for image transforms, notifications, and QR issuance.
- Event logs for transfer and payment reconciliation.

### 7.4 Scalability

- Stateless APIs behind load balancer.
- Redis cache for hot listing queries and session controls.
- Queue workers for webhook and transfer jobs.

---

## 8. System Architecture

### 8.1 Logical Components

- Marketplace Web App (React frontend).
- API Gateway and Auth Service.
- Listings Service.
- Search Service/Index.
- Booking and Order Service.
- Payment Integration Service.
- Ownership Transfer Service.
- QR Issuance Service.
- Admin Moderation and Reporting Service.

### 8.2 Core Event Flow

- Listing created -> moderation queue -> publish.
- Buyer booking -> slot hold -> payment intent.
- Payment captured -> order paid state.
- Transfer approved -> owner switched.
- QR issued -> old QR replaced -> notifications dispatched.

---

## 9. Data Model Requirements

### 9.1 users

Required fields:
- user_id (PK)
- email (unique), phone (unique)
- full_name
- kyc_status (pending/verified/rejected)
- can_buy (bool), can_sell (bool)
- default_mode (buyer/seller)
- created_at, updated_at

### 9.2 vehicles

Required fields:
- vehicle_id (PK)
- seller_id (FK users)
- current_owner_id (FK users)
- make, model, variant, year
- fuel_type, transmission
- kms_driven, city
- expected_price
- status (draft/pending/live/reserved/sold/archived)
- created_at, updated_at

### 9.3 bookings

Required fields:
- booking_id (PK)
- vehicle_id (FK vehicles)
- buyer_id (FK users)
- booking_type (test_drive/reservation/purchase)
- booking_slot_at
- booking_status
- hold_expires_at

### 9.4 orders, payments, transfers, qr, reviews

- orders: maps buyer + seller + vehicle + monetary state machine.
- payments: provider refs, signature state, refund state.
- ownership_transfers: doc and verification workflow.
- qr: ownership-linked issuance and replacement history.
- reviews: post-order rating and moderation status.

---

## 10. API Requirements (Contract-Level)

### 10.1 Auth and Profile

- POST /api/marketplace/auth/register
- POST /api/marketplace/auth/login
- POST /api/marketplace/auth/verify-otp
- POST /api/marketplace/auth/logout
- GET /api/marketplace/profile
- PATCH /api/marketplace/profile/capabilities
- PATCH /api/marketplace/profile/mode

### 10.2 Listings and Search

- POST /api/marketplace/vehicles
- PUT /api/marketplace/vehicles/:id
- POST /api/marketplace/vehicles/:id/images
- POST /api/marketplace/vehicles/:id/submit
- GET /api/marketplace/vehicles/search
- GET /api/marketplace/vehicles/:id

### 10.3 Booking, Order, Payment

- POST /api/marketplace/bookings
- GET /api/marketplace/bookings/:id
- POST /api/marketplace/bookings/:id/cancel
- POST /api/marketplace/payments/create-intent
- POST /api/marketplace/payments/verify
- POST /api/marketplace/payments/webhook
- GET /api/marketplace/orders
- GET /api/marketplace/orders/:id
- PATCH /api/marketplace/orders/:id/status

### 10.4 Transfer and QR

- POST /api/marketplace/transfers
- POST /api/marketplace/transfers/:id/upload-docs
- POST /api/marketplace/transfers/:id/verify
- POST /api/marketplace/transfers/:id/complete
- POST /api/marketplace/orders/:id/generate-qr
- GET /api/marketplace/qr/:id

### 10.5 Admin

- GET /api/marketplace/admin/listings/pending
- POST /api/marketplace/admin/listings/:id/approve
- POST /api/marketplace/admin/listings/:id/reject
- PATCH /api/marketplace/admin/users/:id/status
- GET /api/marketplace/admin/reports/transactions

---

## 11. Frontend Integration Requirements

### 11.1 Existing Frontend Files to Update

- src/App.jsx (route groups and protected route wiring)
- src/Layout/Navbar.jsx (Buy/Sell/Orders navigation)
- src/Layout/Footer.jsx (marketplace links)
- src/ContextApi/DataProvider.jsx (shared identity and role context)
- src/ProtectedRoutes/ProtectedRoutes.jsx (buyer/seller/admin guards)
- src/utils/seoConfig.js (marketplace route metadata)

### 11.2 New Frontend Pages and Components

Suggested new pages:
- MarketplaceHome
- VehicleListingPage
- VehicleDetailsPage
- SellVehiclePage
- CheckoutPage
- OrderHistoryPage
- TransferStatusPage

Suggested components:
- VehicleCard
- FilterPanel
- ListingForm
- BookingWidget
- PaymentSummary

Suggested utilities/providers:
- src/utils/marketplaceApis.js
- src/utils/marketplaceValidation.js
- src/ContextApi/MarketplaceProvider.jsx

### 11.3 Unified Dashboard Requirement

User dashboard must expose two tabs in one account:
- Buy: active orders, wishlisted cars, transfer status.
- Sell: live listings, pending moderation, sold history.

### 11.4 Marketplace Application Baseline (Current Frontend)

This revision starts Marketplace application in the active responsive user system (non-iOS route tree).

Implemented route baseline:
- Auth: `/login`, `/login/otp`, `/password-reset`, `/password-reset/changed`, `/account-created`, `/login-success`
- Shell: `/dashboard`, `/vehicles`, `/virtual-qr`, `/orders`, `/notifications`, `/profile`, `/chat`, `/document-vault`
- Order flow: `/orders/:id/track`, `/orders/:id/review`, `/orders/:id/delivery`, `/orders/:id/payment`, `/orders/:id/success`
- Profile flow: `/profile/update`, `/profile/basic-details`, `/profile/public-details`, `/profile/change-password`, `/profile/emergency-contacts`

Dual-role baseline behavior:
- OTP login flow provisions one user session for Marketplace usage.
- Capability state is tracked as buy+sell in shared session context.
- Session design is single-account-first; buyer and seller capabilities are additive.

Planned extension to complete Marketplace application:
- Seller listing lifecycle pages and seller dashboard metrics.
- Buyer marketplace search/filter catalog pages.
- Unified mode switch UI that surfaces buyer/seller summaries in one profile.

---

## 12. Workflow Specifications

### 12.1 Sell Flow

Login -> Switch to Seller Mode -> Create Listing -> Upload Images/Docs -> Submit -> Admin Approval -> Listing Live -> Booking/Order -> Vehicle Sold

### 12.2 Buy Flow

Login -> Switch to Buyer Mode -> Search and Filter -> View Vehicle -> Reserve/Book -> Checkout -> Payment Success -> Order Created

### 12.3 Dual-Role Flow

User can keep active listing in Seller Mode and still purchase another vehicle from Buyer Mode in same account, with separate but linked activity streams.

### 12.4 Ownership and QR Flow

Order Paid -> Transfer Documents Uploaded -> Admin Verification -> Owner Updated -> QR Reissued to Buyer -> Previous QR Replaced

---

## 13. Security and Compliance Requirements

- Mandatory KYC for selling and transfer completion.
- PII minimization and encrypted storage for sensitive fields.
- Complete audit trail for moderation, payment, transfer, and QR actions.
- Fraud controls:
  - duplicate listing detection
  - velocity checks
  - suspicious activity flags
  - manual review queue

---

## 14. Deployment and Release Plan

### 14.1 Environment Variables

Frontend:
- VITE_BASE_URL
- VITE_MARKETPLACE_API_BASE_URL
- VITE_PAYMENT_PUBLIC_KEY
- VITE_MARKETPLACE_FEATURE_FLAG

Backend:
- DB connection URI
- JWT secrets
- Payment provider keys and webhook secret
- Cache/queue configuration
- Object storage credentials

### 14.2 Rollout Strategy

- Phase 0: Foundation routes, unified auth shell, and dual-role session baseline.
- Phase 1: Listing, search, booking, checkout (feature-flagged).
- Phase 2: Transfer and QR automation.
- Phase 3: Reviews, dispute, analytics hardening.

### 14.3 Rollback Strategy

- Feature flag kill switch.
- Blue/green deployment.
- Backward-compatible migrations.
- Reconciliation scripts for orders/payments.

---

## 15. Acceptance Criteria

AC-01: A single verified user can list a vehicle and purchase another from same account.
AC-02: Buyer and Seller mode switch works without re-authentication.
AC-03: End-to-end sell flow completes to sold state.
AC-04: End-to-end buy flow completes to paid order state.
AC-05: Transfer completion updates owner and generates new QR.
AC-06: Admin moderation and fraud checks are enforced for listing publication.
AC-07: API authorization denies cross-user ownership violations.

---

## 16. Final Recommendation

Proceed with contract-first implementation and phased release.

Priority order:
1. Unified authentication and profile capability model.
2. Listing and search foundation.
3. Booking, payment, and order state machine.
4. Transfer and QR ownership automation.
5. Reviews, disputes, and analytics enhancement.

This v1.3 SRS is updated specifically to support full buy and sell integration in a Spinny-like marketplace model, with unified user identity and role-aware workflows.

---

## 17. Marketplace Kickoff Statement (v1.3)

Marketplace implementation has now started from the responsive user foundation.

Mandatory rule for all upcoming modules:
- One verified user account must be able to buy and sell both.

This rule applies to:
- Authentication and session contracts.
- API authorization and data ownership checks.
- UI/UX flows and dashboard segmentation.

No design in v1.3+ may introduce separate buyer/seller account registration paths.

---

## 18. Additional Acceptance Criteria (v1.3)

AC-08: A verified user can access both buyer and seller features without logging into a second account.
AC-09: Buyer and seller records remain logically separated but linked to one user_id.
AC-10: Switching between buyer and seller views does not invalidate active user session.
AC-11: Marketplace auth endpoints preserve dual-role capability in session/token payload.

---

## 19. Spinny-Like Implementation Start Status (v1.4)

This project has started implementation from responsive Marketplace foundation.

Implemented in current repository (foundation complete):
- Unified user auth routes and OTP login session (`/login`, `/login/otp`).
- Single protected user shell (`/dashboard`, `/vehicles`, `/orders`, `/virtual-qr`, `/profile`, `/notifications`, `/chat`, `/document-vault`).
- Shared dual-role capability storage in session context (`canBuy`, `canSell`) for one-account buy+sell model.

Partially implemented:
- Order tracking and payment UI flow scaffold.
- Profile and emergency-contact management flow.

Not yet implemented (required for Spinny-like parity):
- Instant quote engine and valuation form for sellers.
- Inspection booking workflow (doorstep/hub).
- Final offer and acceptance timeline handling.
- Seller payout workflow and loan/NOC closure orchestration.
- RC transfer tracker module with lifecycle states and SLA visibility.
- Full buyer discovery marketplace (catalog, search, compare, reserve at scale).

Implementation principle:
- Continue on non-iOS responsive module only.
- Use iOS section only as reference for flow and UX consistency.
- Keep one-user-buy+sell rule as non-negotiable in all upcoming milestones.

---

## 20. Additional Acceptance Criteria (v1.4)

AC-12: Seller instant quote and inspection booking flow is available end-to-end.
AC-13: Same user can list a car for sale while purchasing another in parallel.
AC-14: Seller can track RC transfer status from dashboard until completed.
AC-15: Offer acceptance, payment initiation, and ownership-transfer audit logs are traceable per user_id.
