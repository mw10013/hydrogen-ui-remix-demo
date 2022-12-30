import { Link, useMatches } from "@remix-run/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

function Breadcrumbs() {
  const matches = useMatches();
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {matches
          .filter((match) => match.handle && match.handle.breadcrumb)
          .map((match, index) => (
            <li key={match.pathname}>
              <div className="flex items-center">
                {index ? (
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                ) : null}
                {typeof match.handle?.breadcrumb === "function" ? (
                  match.handle.breadcrumb(match)
                ) : (
                  <Link
                    to={match.pathname}
                    className={clsx(
                      index ? "ml-4" : "",
                      "text-sm font-medium text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {match.handle?.breadcrumb}
                  </Link>
                )}
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
}

function PageHeader({
  title,
  meta,
  side, // Should be fragment if more than 1 item for flex
}: {
  title?: string;
  meta?: React.ReactNode;
  side?: React.ReactNode;
}) {
  // With page heading and stacked list
  // https://tailwindui.com/components/application-ui/page-examples/detail-screens
  // With meta, actions, and breadcrumbs
  // https://tailwindui.com/components/application-ui/headings/page-headings
  return (
    <header className="py-8">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <Breadcrumbs />
          {title ? (
            // sm:leading-snug otherwise sm:truncate's overflow hidden will cut off lowercase g's
            <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:leading-snug">
              {title}
            </h2>
          ) : null}
          {meta}
        </div>
        {side ? <div className="mt-5 flex lg:mt-0 lg:ml-4">{side}</div> : null}
      </div>
    </header>
  );
}

export { PageHeader };
