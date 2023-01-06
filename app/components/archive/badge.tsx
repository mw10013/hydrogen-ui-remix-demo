import clsx from "clsx";

const colors = {
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  indigo: "bg-indigo-100 text-indigo-800",
} as const;

function Badge({
  color = "indigo",
  large = false,
  className,
  ...rest
}: {
  color?: keyof typeof colors;
  large?: boolean;
} & JSX.IntrinsicElements["span"]) {
  // https://tailwindui.com/components/application-ui/elements/badges
  // <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"> Badge </span>
  // <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800"> Badge </span>
  // https://tailwindui.com/components/application-ui/lists/stacked-lists
  // With right-justified second column
  // <p class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Full-time</p>
  return (
    <span
      className={clsx(
        className,
        colors[color],
        large ? "px-3 text-sm" : "px-2.5 text-xs",
        "inline-flex items-center rounded-full font-medium "
      )}
      {...rest}
    />
  );
}

export { Badge };
