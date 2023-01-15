import { Form } from "@remix-run/react";
import { Heading } from "../elements/Heading";
import { Input } from "../elements/Input";
import { PageHeader } from "../global/PageHeader";

export function SearchPage({
  searchTerm,
  children,
}: {
  searchTerm?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageHeader>
        <Heading as="h1" size="copy">
          Search
        </Heading>
        <Form className="relative flex w-full text-heading">
          <Input
            defaultValue={searchTerm}
            placeholder="Search…"
            type="search"
            variant="search"
            name="q"
          />
          <button className="absolute right-0 py-2" type="submit">
            Go
          </button>
        </Form>
      </PageHeader>
      {children}
    </>
  );
}
