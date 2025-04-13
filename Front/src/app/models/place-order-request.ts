// src/app/models/place-order-request.ts
export interface PlaceOrderRequest {
    shippingAddress: string;
    shippingMethod: string;
    paymentMethod: string;
    discountApplied?: number;  // Add this field
  discountType?: string;    // Optional: 'percentage' or 'fixed'
  }
  