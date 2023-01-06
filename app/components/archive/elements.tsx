import clsx from "clsx";

function H3({ className, ...rest }: JSX.IntrinsicElements["h3"]) {
  return (
    <h3
      className={clsx(
        className,
        "text-lg font-medium leading-6 text-gray-900"
      )}
      {...rest}
    />
  );
}

export { H3 };
