import { Switch as HuiSwitch } from "@headlessui/react";
import clsx from "clsx";

function Switch({
  className,
  checked,
  children,
  ...rest
}: Parameters<typeof HuiSwitch>[0]) {
  return (
    <HuiSwitch
      {...rest}
      checked={checked}
      className={clsx(
        className,
        checked ? "bg-indigo-600" : "bg-gray-200",
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      )}
      children={
        children ? (
          children
        ) : (
          <span
            aria-hidden="true"
            className={clsx(
              checked ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        )
      }
    />
  );
}

Switch.Group = function SwitchGroup({
  as = "div",
  className,
  ...rest
}: Parameters<typeof HuiSwitch.Group>[0]) {
  return (
    <HuiSwitch.Group
      {...rest}
      as={as}
      className={className ? className : "flex items-center"}
    />
  );
};

Switch.Label = function SwitchLabel({
  as = "span",
  className,
  ...rest
}: Parameters<typeof HuiSwitch.Label>[0]) {
  return (
    <HuiSwitch.Label
      {...rest}
      as={as}
      className={clsx(className, "text-sm font-medium text-gray-900")}
    />
  );
};

export { Switch };
