import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export type ContextType = {};

export const loader = (async () => {
  return json({
    data: "data",
  });
}) satisfies LoaderFunction;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Hydrogen UI Sandbox",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useLoaderData<typeof loader>();
  const context: ContextType = {};

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: `hydrogen-preview`,
            storefrontToken: "3b580e70970c4528da70c98e097c2fa0",
            storefrontApiVersion: "2022-10",
            locale: "EN-US",
          }}
        >
          <CartProvider>
            <Outlet context={context} />
          </CartProvider>
        </ShopifyProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
