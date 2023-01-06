import { Disclosure } from "@headlessui/react";
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
  useLocation,
} from "@remix-run/react";
import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react";
import clsx from "clsx";
import request from "graphql-request";
import { useWindowScroll } from "react-use";
import invariant from "tiny-invariant";
import { Heading } from "./components/elements/heading";
import { IconBag, IconCaret } from "./components/elements/icon";
import { Section } from "./components/elements/section";
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

  const customPrefixes = { BLOG: "", CATALOG: "products" };
  invariant(data.headerMenu, "Missing header menu");
  const headerMenu = enhanceMenu(data.headerMenu, customPrefixes);
  invariant(data.footerMenu, "Missing footer menu");
  const footerMenu = enhanceMenu(data.footerMenu, customPrefixes);
  console.log(JSON.stringify(footerMenu, null, 2));

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

function MobileHeader({
  title,
  isHome = true,
}: // openCart,
// openMenu,
{
  title: string;
  isHome?: boolean;
  // openCart: () => void;
  // openMenu: () => void;
}) {
  const { y } = useWindowScroll();

  const styles = {
    button: "relative flex items-center justify-center w-8 h-8",
    container: `${
      isHome
        ? "bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader"
        : "bg-contrast/80 text-primary"
    } ${
      y > 50 && !isHome ? "shadow-lightHeader " : ""
    }flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`,
  };

  return (
    <header role="banner" className={styles.container}>
      {/* <div className="flex items-center justify-start w-full gap-4">
        <button onClick={openMenu} className={styles.button}>
          <IconMenu />
        </button>
        <form
          action={`/${countryCode ? countryCode + '/' : ''}search`}
          className="items-center gap-2 sm:flex"
        >
          <button type="submit" className={styles.button}>
            <IconSearch />
          </button>
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
        </form>
      </div> */}

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading className="font-bold text-center" as={isHome ? "h1" : "h2"}>
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        {/* <Link to={'/account'} className={styles.button}>
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

export function FooterMenu({ menu }: { menu: ReturnType<typeof enhanceMenu> }) {
  const styles = {
    section: "grid gap-4",
    nav: "grid gap-2 pb-6",
  };

  return (
    <>
      {(menu?.items || []).map((item: EnhancedMenuItem) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item.items && item.items.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? "up" : "down"} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item.items && item.items.length > 0 && (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Disclosure.Panel static>
                      <nav className={styles.nav}>
                        {item.items.map((subItem) =>
                          subItem.isExternal ? (
                            <a
                              key={subItem.id}
                              href={subItem.to}
                              target={subItem.target}
                            >
                              {subItem.title}
                            </a>
                          ) : (
                            <Link
                              key={subItem.id}
                              to={subItem.to}
                              target={subItem.target}
                            >
                              {subItem.title}
                            </Link>
                          )
                        )}
                      </nav>
                    </Disclosure.Panel>
                  </div>
                )}
              </>
            )}
          </Disclosure>
        </section>
      ))}{" "}
    </>
  );
}

export function Footer({ menu }: { menu: ReturnType<typeof enhanceMenu> }) {
  const location = useLocation();
  const pathname = location.pathname;

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : null;

  const isHome = pathname === `/${countryCode ? countryCode + "/" : ""}`;
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? "none" : "top"}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 
        border-b md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      {/* <section className="grid gap-4 w-full md:max-w-[335px] md:ml-auto">
        <Heading size="lead" className="cursor-default" as="h3">
          Country
        </Heading>
        <CountrySelector />
      </section> */}
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project. This website is carbon&nbsp;neutral.
      </div>
    </Section>
  );
}

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
              <DesktopHeader title={shopName} menu={headerMenu} />
              <MobileHeader title={shopName} />
              <main role="main" id="mainContent" className="flex-grow">
                <Outlet context={context} />
              </main>
            </div>
            <Footer menu={footerMenu} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
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
export function enhanceMenu(menu: MenuFragmentFragment, customPrefixes = {}) {
  invariant(menu.items.length > 0, "Missing menu items");
  return {
    ...menu,
    items: menu.items.map(enhanceMenuItem(customPrefixes)),
  };
}
