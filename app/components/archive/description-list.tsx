import clsx from "clsx";

function DescriptionList({ className, ...rest }: JSX.IntrinsicElements["dl"]) {
  // Left aligned: https://tailwindui.com/components/application-ui/data-display/description-lists
  return (
    <dl
      className={clsx(className, "sm:divide-y sm:divide-gray-200")}
      {...rest}
    />
  );
}

DescriptionList.Group = function DescriptionListGroup({
  className,
  ...rest
}: JSX.IntrinsicElements["div"]) {
  return (
    <div
      className={clsx(
        className,
        "py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
      )}
      {...rest}
    />
  );
};

DescriptionList.Dt = function DescriptionListDt({
  className,
  ...rest
}: JSX.IntrinsicElements["dt"]) {
  return (
    <dt
      className={clsx(className, "text-sm font-medium text-gray-500")}
      {...rest}
    />
  );
};

DescriptionList.Dd = function DescriptionListDd({
  className,
  ...rest
}: JSX.IntrinsicElements["dd"]) {
  return (
    <dd
      className={clsx(
        className,
        "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
      )}
      {...rest}
    />
  );
};

DescriptionList.Item = function DescriptionListItem({
  term,
  description,
}: {
  term: string;
  description: string;
}) {
  return (
    <DescriptionList.Group>
      <DescriptionList.Dt>{term}</DescriptionList.Dt>
      <DescriptionList.Dd>{description}</DescriptionList.Dd>
    </DescriptionList.Group>
  );
};

export { DescriptionList };
