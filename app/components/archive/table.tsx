import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";
import React from "react";

// With white background: https://tailwindui.com/components/application-ui/lists/tables
// <div className="mt-8 flex flex-col">
//   <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
//     <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
//       <table className="min-w-full divide-y divide-gray-300">
// With white background and borders: https://tailwindui.com/components/application-ui/lists/tables
// <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">
//   <table className="min-w-full divide-y divide-gray-300">
function Table({
  headers,
  children,
}: {
  headers: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>{headers}</tr>
            </thead>
            <tbody className="divide-y divide-gray-200">{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Table.Th = function TableTh({
  sr = false,
  children,
}: {
  sr?: boolean;
  children: React.ReactNode;
}) {
  // With white background: https://tailwindui.com/components/application-ui/lists/tables
  // First th: py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0
  // Remaining th: py-3.5 px-3 text-left text-sm font-semibold text-gray-900
  // Screen reader (rightmost col): relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0
  // Tailwind comment: relative needed to work around issue on safari mobile.
  return (
    <th
      scope="col"
      className={clsx(
        sr
          ? "relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
          : "py-3.5 px-3 text-left text-sm font-semibold text-gray-900 first:pl-4 first:pr-3 first:sm:pl-6 first:md:pl-0"
      )}
    >
      {sr ? <span className="sr-only">{children}</span> : children}
    </th>
  );
};

Table.Td = function TableTd({
  prominent = false,
  children,
}: {
  prominent?: boolean;
  children: React.ReactNode;
}) {
  // With white background: https://tailwindui.com/components/application-ui/lists/tables
  // Prominent first td: whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0
  // Remaining td: whitespace-nowrap py-4 px-3 text-sm text-gray-500
  // With condensed content
  // First td not prominent: whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6
  // Second td prominent: whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900
  // Remaining td: whitespace-nowrap px-2 py-2 text-sm text-gray-900
  return (
    <td
      className={clsx(
        "whitespace-nowrap py-4 px-3 text-sm first:pl-4 first:pr-3 first:sm:pl-6 first:md:pl-0",
        prominent ? "font-medium text-gray-900" : "text-gray-500"
      )}
    >
      {children}
    </td>
  );
};

// Intended for link in last column since text-right.
Table.TdLink = function TableTdLink({
  children,
  to,
  onClick,
}: { children: React.ReactNode } & Pick<RemixLinkProps, "to" | "onClick">) {
  // With white background: https://tailwindui.com/components/application-ui/lists/tables
  // Td link: relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0
  // link: "text-indigo-600 hover:text-indigo-900"
  // content: Edit<span className="sr-only">, {person.name}</span>
  // Tailwind comment: relative needed to work around issue on safari mobile if sr-only in children?
  // Remaining td: whitespace-nowrap py-4 px-3 text-sm text-gray-500
  // Th screen reader (rightmost col): relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0

  return (
    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
      <Link
        to={to}
        className="text-indigo-600 hover:text-indigo-900"
        onClick={onClick}
      >
        {children}
      </Link>
    </td>
  );
};

export { Table };
