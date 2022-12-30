import clsx from "clsx";

function Checkbox({
  wrapperClassName,
  ...rest
}: { wrapperClassName?: string } & JSX.IntrinsicElements["input"]) {
  // https://tailwindui.com/components/application-ui/forms/checkboxes
  // List with description: <div class="flex items-center h-5">
  // List with checkboxes on right: <div class="ml-3 flex items-center h-5">
  return (
    <div className={clsx(wrapperClassName, "flex h-5 items-center")}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        {...rest}
      />
    </div>
  );
}

Checkbox.ListItem = function CheckboxListItem({
  labelProps: { className: labelClassName, ...restLabelProps },
  checkboxProps,
  children,
  ...rest
}: {
  labelProps: JSX.IntrinsicElements["label"];
  checkboxProps: JSX.IntrinsicElements["input"];
} & JSX.IntrinsicElements["div"]) {
  /*  
    Simple list with heading: https://tailwindui.com/components/application-ui/forms/checkboxes
    <div class="relative flex items-start py-4">
      <div class="min-w-0 flex-1 text-sm">
        <label for="person-1" class="select-none font-medium text-gray-700">Annette Black</label>
      </div>
      <div class="ml-3 flex h-5 items-center">
        <input id="person-1" name="person-1" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
      </div>
    </div>
    */
  return (
    <div className="relative flex items-start py-4">
      <div className="min-w-0 flex-1 text-sm">
        <label
          {...restLabelProps}
          className={clsx(
            labelClassName,
            "select-none font-medium text-gray-700"
          )}
        />
      </div>
      <Checkbox wrapperClassName="ml-3" {...checkboxProps} />
      {children}
    </div>
  );
};

export { Checkbox };
