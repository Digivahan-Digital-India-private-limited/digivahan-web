# DigiVahan Marketplace SRS Client Summary (v1.4)
## Unified Buy + Sell Vehicle Module (Spinny-like)

Date: 2026-04-09  
Product: DigiVahan Vehicle Marketplace Expansion  
Audience: Business stakeholders, product owners, operations teams, and implementation partners

---

## 1. Summary

DigiVahan is evolving from a QR-focused utility platform into a complete vehicle commerce platform with a Spinny-like experience.

The most important v1.4 requirement is:
- One verified user account can both buy and sell vehicles.

This means a user does not need two separate accounts. The same account can switch between Buyer Mode and Seller Mode, while keeping role-aware controls, secure permissions, and complete transaction traceability.

---

## 2. Business Objectives

- Launch a trusted used-car marketplace journey from listing to ownership transfer.
- Increase transaction conversion through integrated search, booking, and payment flow.
- Improve platform trust via KYC, moderation, fraud controls, and audit trails.
- Extend DigiVahan QR ownership system to support post-purchase QR re-issuance.

Target outcomes:
- Faster listing activation and higher listing quality.
- Higher booking-to-payment conversion.
- Reduced transfer delays with a structured workflow.
- Clear post-sale ownership record and QR continuity.

---

## 3. What Is New in v1.4

### 3.1 Unified User Identity (Buy + Sell in One Account)

Every verified user can be enabled for:
- Buying vehicles.
- Selling vehicles.

Key behavior:
- The user can switch active context between Buyer and Seller from the same profile.
- The user can sell one car and purchase another simultaneously.
- Access is controlled by permissions and ownership checks at API level.

### 3.2 End-to-End Marketplace Lifecycle

The module now covers:
- Seller onboarding and listing management.
- Vehicle discovery and comparison.
- Booking/reservation and checkout.
- Payment verification and order creation.
- Ownership transfer and document verification.
- QR update after successful transfer.

---

## 4. Core Functional Scope

### 4.1 Seller Experience

- Create draft listing with vehicle metadata.
- Upload images and required documents.
- Submit listing for moderation.
- Track listing state: draft, pending, live, reserved, sold.
- Receive updates for bookings and order progress.

### 4.2 Buyer Experience

- Search and filter by city, make, model, budget, fuel, transmission, and kilometers.
- View detailed vehicle profile and trust signals.
- Book test drive or reserve vehicle.
- Complete checkout and payment.
- Track order and transfer status.

### 4.3 Admin Experience

- Approve/reject/suspend listings.
- Manage KYC and fraud risk flags.
- Monitor bookings, payments, and transfer progress.
- Track and audit QR issuance after ownership changes.

---

## 5. Unified Buy + Sell Flow (Client View)

### 5.1 Sell Flow

Login -> Switch to Seller Mode -> Create Listing -> Upload Images/Docs -> Submit -> Admin Approval -> Listing Goes Live -> Vehicle Sold

### 5.2 Buy Flow

Login -> Switch to Buyer Mode -> Search/Filter -> Vehicle Details -> Reserve or Book -> Checkout -> Payment Success -> Order Created

### 5.3 Ownership and QR Flow

Order Paid -> Transfer Docs Uploaded -> Admin Verification -> Owner Updated -> New QR Issued -> Old QR Marked Replaced

---

## 6. Security, Trust, and Compliance

- KYC-based controls for critical actions.
- Role-based and ownership-based access checks.
- OTP safeguards and secure session handling.
- Payment signature verification and idempotent webhook processing.
- Fraud controls for suspicious patterns and duplicate listings.
- Full audit trail for moderation, payments, transfer actions, and QR operations.

---

## 7. Technical Delivery Snapshot

The current repository is frontend-only. Therefore, delivery is structured as:
- Frontend implementation and UX integration in current DigiVahan web app.
- Backend services and database implementation in dedicated backend system.

Frontend integration touchpoints include:
- Route updates for marketplace pages.
- Unified profile and mode switching in shared state.
- Buyer/seller/admin protected routes.
- Marketplace API client integration.

---

## 8. Release Plan (Phased)

### Phase 1: Marketplace MVP

- Listing creation and moderation.
- Search and vehicle details.
- Booking/reservation.
- Checkout and payment flow.

### Phase 2: Transfer + QR Automation

- Ownership transfer document flow.
- Verification process and owner update.
- Automated QR re-issuance and QR history linkage.

### Phase 3: Trust and Scale Enhancements

- Ratings and review moderation.
- Dispute workflows.
- Advanced analytics and operations dashboards.

---

## 9. Success Criteria and Acceptance Highlights

The release is considered successful when:

- A single verified user can both list and buy vehicles from the same account.
- Buyer and Seller mode switch works without re-authentication.
- Sell journey reaches sold state with valid moderation controls.
- Buy journey reaches paid order state through verified payment flow.
- Completed transfer updates ownership and issues a new QR.
- Admin controls and fraud checks are active and auditable.

---

## 10. Final Recommendation

Proceed with contract-first implementation and feature-flagged rollout.

Execution priority:
1. Unified identity and capability model.
2. Listing and search foundation.
3. Booking, payment, and order lifecycle.
4. Transfer and QR ownership automation.
5. Reviews, disputes, and analytics hardening.

This client summary aligns with the full DigiVahan SRS v1.3 and is intended for business-level review, planning alignment, and implementation sign-off.

---

## 11. v1.4 Marketplace Kickoff Note

Marketplace application has started on the responsive user system.

Non-negotiable rule:
- One verified user account must support both journeys: buy and sell.

Kickoff baseline in current frontend:
- Unified login and OTP flow for Marketplace user session.
- Shared dashboard shell for orders, vehicles, virtual QR, profile, notifications, chat, and document vault.
- Foundation established for upcoming buyer catalog and seller listing lifecycle modules.

This summary now aligns with full DigiVahan SRS v1.4.

---

## 12. Spinny-Like Implementation Start (Project Status)

Reference alignment source:
- https://www.spinny.com/sell-used-car/

What has started in this project:
- Unified user login and OTP flow for Marketplace user.
- One protected responsive user shell for dashboard, vehicles, orders, profile, notifications, chat, and document vault.
- Single-account capability model where one verified user can buy and sell both cars.

What is next for Spinny-like parity:
- Seller instant quote and inspection booking flow.
- Final offer acceptance and same-day payment lifecycle.
- RC transfer tracker and seller-protection lifecycle.
- Full buyer-side catalog/search/compare/reserve implementation.
