import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import request from "graphql-request";
import { useWindowScroll } from "react-use";
import { graphql } from "./lib/gql/gql";
import type { LayoutMenusQueryQuery } from "./lib/gql/graphql";
import { parseMenu, shopClient } from "./lib/utils";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { FragmentType, useFragment } from "./gql/fragment-masking";

export type ContextType = {};

const HEADER_MENU_HANDLE = "main-menu";
const FOOTER_MENU_HANDLE = "footer";

export const MenuItemFragment = graphql(`
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
`);

const query = graphql(`
  query LayoutMenusQuery(
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) {
    shop {
      name
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
`);

export const loader = (async () => {
  const data = await request({
    url: shopClient.getStorefrontApiUrl(),
    document: query,
    variables: {
      headerMenuHandle: HEADER_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
    requestHeaders: shopClient.getPublicTokenHeaders(),
  });

  const customPrefixes = { BLOG: "", CATALOG: "products" };

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  return json({
    data,
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

export function DesktopHeader({
  title,
  isHome = true,
  menu,
}: {
  title: string;
  isHome?: boolean;
  menu: LayoutMenusQueryQuery["headerMenu"];
}) {
  const { y } = useWindowScroll();
  console.log({ y, title, isHome });

  const styles = {
    button:
      "relative flex items-center justify-center w-8 h-8 focus:ring-primary/5",
    container: `${
      isHome
        ? "bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader"
        : "bg-contrast/80 text-primary"
    } ${
      y > 50 && !isHome ? "shadow-lightHeader " : ""
    }hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`,
  };

  return (
    <header role="banner" className={styles.container}>
      <div className="flex gap-12">
        <Link className="font-bold" to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item, i) => (
            <pre key={i}>{JSON.stringify(item, null, 2)}</pre>
            // <Link key={item.id} to={item.to} target={item.target}>
            //   {item.title}
            // </Link>
          ))}
        </nav>
      </div>
      {/* <div className="flex items-center gap-1">
    <form
      action={`/${countryCode ? countryCode + '/' : ''}search`}
      className="flex items-center gap-2"
    >
      <Input
        className={
          isHome
            ? 'focus:border-contrast/20 dark:focus:border-primary/20'
            : 'focus:border-primary/20'
        }
        type="search"
        variant="minisearch"
        placeholder="Search"
        name="q"
      />
      <button type="submit" className={styles.button}>
        <IconSearch />
      </button>
    </form>
    <Link to={'/account'} className={styles.button}>
      <IconAccount />
    </Link>
    <button onClick={openCart} className={styles.button}>
      <IconBag />
      <CartBadge dark={isHome} />
    </button>
  </div> */}
    </header>
  );
}

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
            <div className="flex flex-col min-h-screen">
              <div className="">
                <a href="#mainContent" className="sr-only">
                  Skip to content
                </a>
              </div>
              <DesktopHeader title={data.shop.name} menu={data.headerMenu} />
              <main role="main" id="mainContent" className="flex-grow">
                <Outlet context={context} />
              </main>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </CartProvider>
        </ShopifyProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
