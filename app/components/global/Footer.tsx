import { Link, useLocation } from "@remix-run/react";
import { Section } from "../elements/Section";
import type { EnhancedMenu, EnhancedMenuItem } from "../../root";
import { Disclosure } from "@headlessui/react";
import { Heading } from "../elements/Heading";
import { IconCaret } from "../elements/Icon";

export function FooterMenu({ menu }: { menu: EnhancedMenu }) {
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

export function Footer({ menu }: { menu: EnhancedMenu }) {
  const location = useLocation();
  const pathname = location.pathname;

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : null;

  const isHome = pathname === `/${countryCode ? countryCode + "/" : ""}`;
  // const itemsCount = menu.items.length + 1 > 4 ? 4 : menu.items.length + 1;

  return (
    <Section
      divider={isHome ? "none" : "top"}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 
        border-b md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      {/* <section className="grid gap-4 w-full md:max-w-[335px] md:ml-auto">
              <Heading size="lead" className="cursor-default" as="h3">
                Country
              </Heading>
              <CountrySelector />
            </section> */}
      <div className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-3`}>
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project. This website is carbon&nbsp;neutral.
      </div>
    </Section>
  );
}
