export type Money = Readonly<{ amountCents: number; currency: string }>;

export type Coupon = Readonly<{
  code: string;
  percentOff: number;
  isActive: boolean;
}>;

export type CardAuthorization = Readonly<{
  availableCents: number;
  isCaptureConfirmed: boolean;
}>;

export type CartSubtotal = Readonly<{ subtotalCents: number }>;

export type PayableDecision =
  | { ok: true; discountCents: number; payableCents: number }
  | { ok: false; reason: string };

const clampPercent = (n: number): number => Math.min(100, Math.max(0, n));

const roundMoneyCents = (n: number): number => Math.round(n);

export function evaluateCouponAgainstBalance(
  cart: CartSubtotal,
  coupon: Coupon,
  authorization: CardAuthorization
): PayableDecision {
  if (!coupon.isActive) {
    return { ok: false, reason: "COUPON_INACTIVE" };
  }

  if (cart.subtotalCents <= 0) {
    return { ok: false, reason: "INVALID_SUBTOTAL" };
  }

  const percent = clampPercent(coupon.percentOff);
  const discountCents = roundMoneyCents((cart.subtotalCents * percent) / 100);
  const payableCents = roundMoneyCents(cart.subtotalCents - discountCents);

  if (payableCents < 0) {
    return { ok: false, reason: "NEGATIVE_PAYABLE" };
  }

  if (!authorization.isCaptureConfirmed) {
    return { ok: false, reason: "PAYMENT_NOT_CAPTURED" };
  }

  if (authorization.availableCents < payableCents) {
    return { ok: false, reason: "INSUFFICIENT_BALANCE_FOR_NET_TOTAL" };
  }

  return { ok: true, discountCents, payableCents };
}
