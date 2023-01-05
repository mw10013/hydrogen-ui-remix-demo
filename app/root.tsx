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
import clsx from "clsx";
import request from "graphql-request";
import { useWindowScroll } from "react-use";
import invariant from "tiny-invariant";
import { IconBag } from "./components/elements/icon";
import type { FragmentType } from "./lib/gql";
import { getFragmentData } from "./lib/gql";
import { graphql } from "./lib/gql/gql";
import type {
  LayoutMenusQueryQuery,
  MenuFragmentFragment,
} from "./lib/gql/graphql";
import { shopClient } from "./lib/utils";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export type ContextType = {};

const HEADER_MENU_HANDLE = "main-menu";
const FOOTER_MENU_HANDLE = "footer";

// export const MenuItemFragment = graphql(`
//   fragment MenuItemFragment on MenuItem {
//     id
//     resourceId
//     tags
//     title
//     type
//     url
//   }
// `);

export const MenuFragment = graphql(`
  fragment MenuFragment on Menu {
    id
    items {
      id
      resourceId
      title
      type
      url
      items {
        id
        resourceId
        title
        type
        url
      }
    }
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

  invariant(data.headerMenu, "Missing header menu");
  const customPrefixes = { BLOG: "", CATALOG: "products" };
  const headerMenu = enhanceMenu(data.headerMenu, customPrefixes);

  // const headerMenu = data?.headerMenu
  //   ? parseMenu(data.headerMenu, customPrefixes)
  //   : undefined;

  // const footerMenu = data?.footerMenu
  //   ? parseMenu(data.footerMenu, customPrefixes)
  //   : undefined;

  return json({
    headerMenu,
    shopName: data.shop.name,
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

function CartBadge({ dark }: { dark: boolean }) {
  // const {totalQuantity} = useCart();
  const totalQuantity = 0;

  if (totalQuantity < 1) {
    return null;
  }
  return (
    <div
      className={`${
        dark
          ? "text-primary bg-contrast dark:text-contrast dark:bg-primary"
          : "text-contrast bg-primary"
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{totalQuantity}</span>
    </div>
  );
}

export function DesktopHeader({
  title,
  isHome = true,
  menu,
}: {
  title: string;
  isHome?: boolean;
  menu: ReturnType<typeof enhanceMenu>;
}) {
  const { y } = useWindowScroll();

  const styles = {
    button:
      "relative flex items-center justify-center w-8 h-8 focus:ring-primary/5",
  };

  return (
    <header
      role="banner"
      className={clsx(
        isHome
          ? "bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader"
          : "bg-contrast/80 text-primary",
        y > 50 && !isHome && "shadow-lightHeader",
        "hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8"
      )}
    >
      <div className="flex gap-12">
        <Link className="font-bold" to="/">
          {title}
        </Link>
        <nav className="flex gap-8">
          {(menu?.items || []).map((item, i) => (
            <Link key={item.id} to={item.to} target={item.target}>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        {/* <form
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
    </Link> */}
        {/* <button onClick={openCart} className={styles.button}> */}
        <button className={styles.button}>
          <IconBag />
          <CartBadge dark={isHome} />
        </button>
      </div>
    </header>
  );
}

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { shopName, headerMenu, data } = useLoaderData<typeof loader>();
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
              <DesktopHeader title={shopName} menu={headerMenu} />
              <main role="main" id="mainContent" className="flex-grow">
                <Outlet context={context} />
              </main>
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

type EnhancedMenuItem = Omit<MenuItem, "items"> & {
  isExternal: boolean;
  target: string;
  to: string;
  items?: EnhancedMenuItem[];
};

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

/*
  Recursively adds `to` and `target` attributes to links based on their url
  and resource type.
  It optionally overwrites url paths based on item.type
*/
export function enhanceMenu(
  menuFragment: FragmentType<typeof MenuFragment>,
  customPrefixes = {}
) {
  const menu = getFragmentData(MenuFragment, menuFragment);
  invariant(menu.items.length > 0, "Missing menu items");

  return {
    ...menu,
    items: menu.items.map(enhanceMenuItem(customPrefixes)),
  };
}
