## ADDED Requirements

### Requirement: Stripe PaymentElement Integration

The system SHALL use Stripe's PaymentElement component for credit card payment collection. PaymentElement MUST automatically collect billing address information including postal code, card details, and handle 3D Secure authentication without requiring separate form fields.

#### Scenario: User completes payment with PaymentElement

- **WHEN** user proceeds to checkout and selects Stripe as payment method
- **THEN** PaymentElement component displays and collects card number, expiry, CVC, and billing address (including postal code) in a single unified form
- **AND** billing address postal code is collected automatically without separate input field
- **AND** user can complete payment without manually entering postal code separately

#### Scenario: Payment with 3D Secure authentication

- **WHEN** user's card requires 3D Secure authentication
- **THEN** PaymentElement automatically displays 3D Secure challenge modal
- **AND** user completes authentication within the PaymentElement interface
- **AND** payment proceeds automatically after successful authentication

#### Scenario: Payment error handling

- **WHEN** payment fails (declined card, insufficient funds, etc.)
- **THEN** PaymentElement displays appropriate error message
- **AND** user can correct payment details and retry without leaving checkout page

### Requirement: Billing Address Collection

The system SHALL collect billing address automatically through PaymentElement. Billing address MUST be separate from shipping address, which is collected earlier in the order flow.

#### Scenario: Billing address automatically collected

- **WHEN** user completes payment form via PaymentElement
- **THEN** billing address fields (street, city, state/province, postal code, country) are collected automatically
- **AND** billing address postal code is required and validated by Stripe
- **AND** billing address is sent to Stripe as part of payment confirmation

#### Scenario: Shipping address remains unchanged

- **WHEN** user completes payment with PaymentElement
- **THEN** shipping address collected earlier in order flow remains unchanged
- **AND** billing address collected by PaymentElement is separate from shipping address
- **AND** order is created with correct shipping address from earlier step

## MODIFIED Requirements

### Requirement: Payment Form Implementation

The checkout payment form SHALL use Stripe PaymentElement instead of CardElement. The form MUST provide a seamless payment experience consistent with Stripe's recommended best practices.

#### Scenario: Modern payment form display

- **WHEN** user reaches checkout page
- **THEN** PaymentElement displays with modern Stripe styling
- **AND** form includes card input, billing address fields, and submit button
- **AND** postal code is included as part of billing address collection (not separate field)
- **AND** form validates all fields before allowing submission

#### Scenario: Payment confirmation flow

- **WHEN** user submits payment form with valid card and billing details
- **THEN** system calls `stripe.confirmPayment()` with PaymentElement instance
- **AND** payment intent is confirmed with billing address included
- **AND** user is redirected to order success page upon successful payment
