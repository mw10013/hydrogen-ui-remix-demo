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
import request from "graphql-request";
import invariant from "tiny-invariant";
import { Footer } from "./components/global/footer";
import { Header } from "./components/global/header";
import { graphql } from "./lib/gql/gql";
import type { MenuFragmentFragment } from "./lib/gql/graphql";
import { shopClient } from "./lib/utils";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export type ContextType = {};

const HEADER_MENU_HANDLE = "main-menu";
const FOOTER_MENU_HANDLE = "footer";

export const MenuFragment = graphql(`
  fragment MenuFragment on Menu {
    id
    items {
      ...MenuItemFragment
      items {
        ...MenuItemFragment
      }
    }
  }
`);

export const MenuItemFragment = graphql(`
  fragment MenuItemFragment on MenuItem {
    id
    resourceId
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
      ...MenuFragment
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...MenuFragment
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
  invariant(data.headerMenu, "Missing header menu");
  const headerMenu = enhanceMenu(data.headerMenu, customPrefixes);
  invariant(data.footerMenu, "Missing footer menu");
  const footerMenu = enhanceMenu(data.footerMenu, customPrefixes);

  return json({
    shopName: data.shop.name,
    headerMenu,
    footerMenu,
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

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { shopName, headerMenu, footerMenu, data } =
    useLoaderData<typeof loader>();
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
            <div className="flex flex-col min-h-screen bg-slate-300">
              <div className="">
                <a href="#mainContent" className="sr-only">
                  Skip to content
                </a>
              </div>
              <Header title={shopName} menu={headerMenu} />
              <main role="main" id="mainContent" className="flex-grow">
                <Outlet context={context} />
              </main>
            </div>
            <Footer menu={footerMenu} />
          </CartProvider>
        </ShopifyProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function resolveToFromType(
  {
    customPrefixes,
    pathname,
    type,
  }: {
    customPrefixes: Record<string, string>;
    pathname?: string;
    type?: string;
  } = {
    customPrefixes: {},
  }
) {
  if (!pathname || !type) return "";

  /*
    MenuItemType enum
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
  */
  const defaultPrefixes = {
    BLOG: "blogs",
    COLLECTION: "collections",
    COLLECTIONS: "collections", // Collections All (not documented)
    FRONTPAGE: "frontpage",
    HTTP: "",
    PAGE: "pages",
    CATALOG: "collections/all", // Products All
    PRODUCT: "products",
    SEARCH: "search",
    SHOP_POLICY: "policies",
  };

  const pathParts = pathname.split("/");
  const handle = pathParts.pop() || "";
  const routePrefix: Record<string, string> = {
    ...defaultPrefixes,
    ...customPrefixes,
  };

  switch (true) {
    // special cases
    case type === "FRONTPAGE":
      return "/";

    case type === "ARTICLE": {
      const blogHandle = pathParts.pop();
      return routePrefix.BLOG
        ? `/${routePrefix.BLOG}/${blogHandle}/${handle}/`
        : `/${blogHandle}/${handle}/`;
    }

    case type === "COLLECTIONS":
      return `/${routePrefix.COLLECTIONS}`;

    case type === "SEARCH":
      return `/${routePrefix.SEARCH}`;

    case type === "CATALOG":
      return `/${routePrefix.CATALOG}`;

    // common cases: BLOG, PAGE, COLLECTION, PRODUCT, SHOP_POLICY, HTTP
    default:
      return routePrefix[type]
        ? `/${routePrefix[type]}/${handle}`
        : `/${handle}`;
  }
}

type MenuItem = Omit<MenuFragmentFragment["items"][number], "items"> & {
  items?: MenuItem[];
};

export type EnhancedMenuItem = Omit<MenuItem, "items"> & {
  isExternal: boolean;
  target: string;
  to: string;
  items?: EnhancedMenuItem[];
};

export type EnhancedMenu = ReturnType<typeof enhanceMenu>;

function enhanceMenuItem(customPrefixes = {}) {
  return function (item: MenuItem): EnhancedMenuItem {
    // Currently the MenuAPI only returns online store urls e.g — xyz.myshopify.com/..
    // Note: update logic when API is updated to include the active qualified domain
    invariant(item.url, "Menu item missing url");
    const { pathname } = new URL(item.url);
    const isInternalLink = /\.myshopify\.com/g.test(item.url);
    const parsedItem = isInternalLink
      ? {
          isExternal: false,
          target: "_self",
          to: resolveToFromType({ type: item.type, customPrefixes, pathname }),
        }
      : {
          isExternal: true,
          target: "_blank",
          to: item.url,
        };

    return {
      ...item,
      ...parsedItem,
      items: item.items?.map(enhanceMenuItem(customPrefixes)),
    };
  };
}

export function enhanceMenu(menu: MenuFragmentFragment, customPrefixes = {}) {
  invariant(menu.items.length > 0, "Missing menu items");
  return {
    ...menu,
    items: menu.items.map(enhanceMenuItem(customPrefixes)),
  };
}
