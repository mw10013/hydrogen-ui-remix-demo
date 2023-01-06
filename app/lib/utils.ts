import { createStorefrontClient } from "@shopify/hydrogen-react";
import type { MoneyV2, UserError } from "@shopify/hydrogen-react/storefront-api-types";

// @ts-expect-error types not available
import typographicBase from "typographic-base";

export function classNames(
  ...classes: (false | null | undefined | string)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export const shopClient = createStorefrontClient({
  storeDomain: "hydrogen-preview",
  // TODO: convert to 'privateStorefrontToken'!
  publicStorefrontToken: "3b580e70970c4528da70c98e097c2fa0",
  storefrontApiVersion: "2022-10",
});

export function missingClass(string?: string, prefix?: string) {
  if (!string) {
    return true;
  }

  const regex = new RegExp(` ?${prefix}`, "g");
  return string.match(regex) === null;
}

export function formatText(input?: string | React.ReactNode) {
  if (!input) {
    return;
  }

  if (typeof input !== "string") {
    return input;
  }

  return typographicBase(input, { locale: "en-us" }).replace(
    /\s([^\s<]+)\s*$/g,
    "\u00A0$1"
  );
}

export function isNewArrival(date: string, daysOld = 30) {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  );
}

export function isDiscounted(price: MoneyV2, compareAtPrice: MoneyV2) {
  if (compareAtPrice?.amount > price?.amount) {
    return true;
  }
  return false;
}

export function getExcerpt(text: string) {
  const regex = /<p.*>(.*?)<\/p>/;
  const match = regex.exec(text);
  return match?.length ? match[0] : text;
}

export function getApiErrorMessage(
  field: string,
  data: Record<string, any>,
  errors: UserError[]
) {
  if (errors?.length) return errors[0].message ?? errors[0];
  if (data?.[field]?.customerUserErrors?.length)
    return data[field].customerUserErrors[0].message;
  return null;
}

export function statusMessage(status: string) {
  const translations: Record<string, string> = {
    ATTEMPTED_DELIVERY: "Attempted delivery",
    CANCELED: "Canceled",
    CONFIRMED: "Confirmed",
    DELIVERED: "Delivered",
    FAILURE: "Failure",
    FULFILLED: "Fulfilled",
    IN_PROGRESS: "In Progress",
    IN_TRANSIT: "In transit",
    LABEL_PRINTED: "Label printed",
    LABEL_PURCHASED: "Label purchased",
    LABEL_VOIDED: "Label voided",
    MARKED_AS_FULFILLED: "Marked as fulfilled",
    NOT_DELIVERED: "Not delivered",
    ON_HOLD: "On Hold",
    OPEN: "Open",
    OUT_FOR_DELIVERY: "Out for delivery",
    PARTIALLY_FULFILLED: "Partially Fulfilled",
    PENDING_FULFILLMENT: "Pending",
    PICKED_UP: "Displayed as Picked up",
    READY_FOR_PICKUP: "Ready for pickup",
    RESTOCKED: "Restocked",
    SCHEDULED: "Scheduled",
    SUBMITTED: "Submitted",
    UNFULFILLED: "Unfulfilled",
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}

export function emailValidation(email: HTMLInputElement) {
  if (email.validity.valid) return null;

  return email.validity.valueMissing
    ? "Please enter an email"
    : "Please enter a valid email";
}

export function passwordValidation(password: HTMLInputElement) {
  if (password.validity.valid) return null;

  if (password.validity.valueMissing) {
    return "Please enter a password";
  }

  return "Password must be at least 6 characters";
}
