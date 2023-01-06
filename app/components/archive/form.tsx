import type { FormProps } from "@remix-run/react";
import { Form as RemixForm, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import { Button } from "./button";

function Form({
  stacked = false,
  className,
  children,
  ...rest
}: FormProps & { stacked?: boolean }) {
  return (
    // Simple stacked: https://tailwindui.com/components/application-ui/forms/form-layouts
    <RemixForm
      className={clsx(
        className,
        stacked && "space-y-8 divide-y divide-gray-200"
      )}
      {...rest}
    >
      {children}
    </RemixForm>
  );
}

Form.H3 = function FormH3({
  prominent = false,
  className,
  children,
  ...rest
}: { prominent?: boolean } & JSX.IntrinsicElements["h3"]) {
  return (
    <h3
      className={clsx(
        className,
        prominent
          ? "text-center text-3xl font-extrabold"
          : "text-lg font-medium leading-6",
        "text-gray-900"
      )}
      {...rest}
    >
      {children}
    </h3>
  );
};

Form.P = function FormP({
  prominent = false,
  className,
  children,
  ...rest
}: { prominent?: boolean } & JSX.IntrinsicElements["p"]) {
  return (
    <p
      className={clsx(
        className,
        prominent ? "mt-2 text-center text-gray-600" : "mt-1 text-gray-500",
        "text-sm "
      )}
      {...rest}
    >
      {children}
    </p>
  );
};

Form.Header = function FormHeader({
  title,
  description,
  errors,
  children,
  ...rest
}: {
  description?: React.ReactNode;
  errors?: string[];
} & JSX.IntrinsicElements["div"]) {
  return (
    <div {...rest}>
      {title ? <Form.H3>{title}</Form.H3> : null}
      {description ? (
        <p className={"mt-1 text-sm text-gray-500"}>{description}</p>
      ) : null}
      {children}
      {errors && errors.length > 0 ? <Form.Errors errors={errors} /> : null}
    </div>
  );
};

Form.Body = function FormBody({
  stacked = false,
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["div"] & { stacked?: boolean }) {
  return (
    <div
      className={clsx(
        className,
        stacked
          ? "space-y-8 divide-y divide-gray-200"
          : "mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Form.Section = function FormSection({
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["div"]) {
  return (
    <div className={clsx(className, "pt-8 first:pt-0")} {...rest}>
      {children}
    </div>
  );
};

Form.SectionHeader = function FormSectionHeader({
  title,
  description,
  errors,
  children,
  ...rest
}: { description?: string; errors?: string[] } & JSX.IntrinsicElements["div"]) {
  return (
    <div {...rest}>
      {title ? <Form.H3>{title}</Form.H3> : null}
      {description ? (
        <Form.SectionDescription>{description}</Form.SectionDescription>
      ) : null}
      {errors && errors.length > 0 ? <Form.Errors errors={errors} /> : null}
      {children}
    </div>
  );
};

Form.SectionDescription = function FormSectionDescription({
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["p"]) {
  return (
    <p className={clsx(className, "mt-1 text-sm text-gray-500")} {...rest}>
      {children}
    </p>
  );
};

Form.SectionContent = function FormSectionContent({
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["div"]) {
  return (
    <div
      className={clsx(
        className,
        "mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

const groupSpan = {
  whole: "sm:col-span-6",
  half: "sm:col-span-3",
  third: "sm:col-span-2",
  "three-quarters": "sm:col-span-4",
} as const;

Form.Group = function FormGroup({
  span = "whole",
  className,
  children,
}: {
  span?: keyof typeof groupSpan;
} & JSX.IntrinsicElements["div"]) {
  return <div className={clsx(className, groupSpan[span])}>{children}</div>;
};

Form.Label = function FormLabel({
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["label"]) {
  return (
    <label
      className={clsx(className, "block text-sm font-medium text-gray-700")}
      {...rest}
    >
      {children}
    </label>
  );
};

Form.Control = function FormControl({
  className,
  children,
  invalid,
  ...rest
}: { invalid: boolean } & JSX.IntrinsicElements["div"]) {
  // Input with label and help text, Input with validation error
  // https://tailwindui.com/components/application-ui/forms/input-groups
  // <div class="mt-1">
  // <div class="relative mt-1 rounded-md shadow-sm">
  return (
    <div
      className={clsx(
        className,
        invalid ? "relative mt-1 rounded-md shadow-sm" : "mt-1"
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Form.Input = function FormInput({
  className,
  invalid,
  ...rest
}: { invalid: boolean } & JSX.IntrinsicElements["input"]) {
  // Input with label and help text, Input with validation error
  // https://tailwindui.com/components/application-ui/forms/input-groups
  // <input type="email" name="email" id="email" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="you@example.com" aria-describedby="email-description">
  // <input type="email" name="email" id="email" class="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" placeholder="you@example.com" value="adamwathan" aria-invalid="true" aria-describedby="email-error" />
  // Removed pr-10 from invalid
  return (
    <input
      className={clsx(
        className,
        "block w-full rounded-md sm:text-sm",
        invalid
          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
          : "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      )}
      {...rest}
    />
  );
};

Form.Errors = function FormErrors({
  className,
  errors,
  ...rest
}: { errors?: string[] } & JSX.IntrinsicElements["p"]) {
  return errors && errors.length > 0 ? (
    <p className={clsx(className, "mt-6 text-sm text-red-600")} {...rest}>
      {errors.join(". ")}
    </p>
  ) : null;
};

Form.Field = function FormField({
  id,
  label,
  children, // only 1 child.
  errors,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  errors?: string[];
}) {
  const child = React.Children.only(children);
  const invalid = Boolean(errors && errors.length > 0);
  return (
    <Form.Group>
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <Form.Control invalid={invalid}>
        {React.isValidElement(child)
          ? React.cloneElement(child, {
              className: clsx(
                child.props.className,
                "block w-full rounded-md sm:text-sm",
                invalid
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
                  : "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ),
            })
          : null}
      </Form.Control>
      {errors ? (
        <Form.Errors id={`${id}-error`} role="alert" errors={errors} />
      ) : null}
    </Form.Group>
  );
};

Form.List = function FormList({
  className,
  ...rest
}: Parameters<typeof Form.Group>[0]) {
  // Simple list with heading
  // https://tailwindui.com/components/application-ui/forms/checkboxes
  // <div class="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
  return (
    <Form.Group
      className={clsx(
        className,
        // "-mb-8 divide-y divide-gray-200 border-t border-gray-200"
        "divide-y divide-gray-200 border-t border-gray-200"
      )}
      {...rest}
    />
  );
};

Form.Footer = function FormFooter({
  stacked = false,
  className,
  children,
  ...rest
}: JSX.IntrinsicElements["div"] & { stacked?: boolean }) {
  return (
    <div
      className={clsx(className, "flex justify-end", stacked ? "pt-5" : "pt-6")}
      {...rest}
    >
      {children}
    </div>
  );
};

Form.SubmitButton = function FormSubmitButton({
  wide = false,
  className,
  ...rest
}: Parameters<typeof Button>[0] & { wide?: boolean }) {
  return (
    <Button
      type="submit"
      className={clsx(className, wide ? "grow justify-center" : "ml-3")}
      {...rest}
    />
  );
};

Form.CancelButton = function FormCancelButton({
  className,
  children,
  ...rest
}: Parameters<typeof Button>[0]) {
  const navigate = useNavigate();
  return (
    <Button
      variant="white"
      className={clsx(className, "ml-auto")}
      onClick={() => navigate(-1)}
      {...rest}
    >
      {children || "Cancel"}
    </Button>
  );
};
Form.DangerButton = function FormDangerButton({
  ...rest
}: Parameters<typeof Button>[0]) {
  return <Button variant="red" {...rest} />;
};

export { Form };
