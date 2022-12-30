import { useCatch } from "@remix-run/react";

export function GenericCatchBoundary() {
  const caught = useCatch();
  return (
    <div className="py-16">
      <div className="prose mx-auto max-w-xl px-4">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        {typeof caught.data === "string" ? <pre>{caught.data}</pre> : null}
      </div>
    </div>
  );
}

export function GenericErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <div className="py-16">
      <div className="prose mx-auto max-w-xl px-4">
        <h1>Application Error</h1>
        <pre>{error.message}</pre>
      </div>
    </div>
  );
}
