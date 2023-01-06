import clsx from "clsx";

export function Button({
  type = "button",
  variant = "primary",
  className,
  children,
  ...rest
}: {
  variant?: "primary" | "white" | "red";
} & JSX.IntrinsicElements["button"]) {
  return (
    <button
      type={type}
      className={clsx(
        className,
        "disabled:opacity-50",
        variant === "primary"
          ? "inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          : variant === "white"
          ? "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          : "inline-flex items-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
