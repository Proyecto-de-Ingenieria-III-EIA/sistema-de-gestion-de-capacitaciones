import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { NavUser } from "../molecules/nav-user";
import { House, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface DropdownItem {
  name: string;
  description?: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface HeaderButton {
  label: string;
  href?: string;
  onClick?: () => void;
  dropdownItems?: DropdownItem[];
}

interface HeaderProps {
  buttons: HeaderButton[];
  firstLinkHref: string;
}

export default function Header({ buttons, firstLinkHref }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="bg-skyblue">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          {pathname !== "/" && (
            <Link href={firstLinkHref} className="grid grid-cols-1 ml-5 text-teal justify-items-center">
              <House width={40} height={40} color="teal" />
              <p>Home</p>
            </Link>
          )}
          {pathname == "/" && session?.user.roleName === "ADMIN" && (
            <Link href="/admin-dashboard" className="grid grid-cols-1 ml-5 text-teal justify-items-center">
              <LayoutDashboard width={40} height={40} color="teal" />
              <p>Dashboard</p>
            </Link>
          )}
        </div>
        <div className="flex lg:hidden">
          <Button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </Button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {buttons.map((button) => (
            <Popover key={button.label} className="relative">
              {button.href ? (
                <Link href={button.href}>
                  {button.label}
                </Link>
              ) : (
                <>
                  <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
                    {button.label}
                    {button.dropdownItems && (
                      <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                    )}
                  </PopoverButton>
                  {button.dropdownItems && (
                    <PopoverPanel className="absolute top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                      <div className="p-4">
                        {button.dropdownItems.map((item) => (
                          <div
                            key={item.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                          >
                            {item.icon && (
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                              />
                            )}
                            <div className="flex-auto">
                              <Link href={item.href}>
                                  {item.name}
                                  <span className="absolute inset-0" />
                              </Link>
                              {item.description && <p className="mt-1 text-gray-600">{item.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverPanel>
                  )}
                </>
              )}
            </Popover>
          ))}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <NavUser />
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/">
                <House
                width={40}
                height={40}
                color="teal"
                className="ml-5"
              />
            </Link>
            <Button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {buttons.map((button) => (
                  <div key={button.label} className="-mx-3">
                    {button.href ? (
                      <Link
                        href={button.href}
                        className="block rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {button.label}
                      </Link>
                    ) : (
                      <Disclosure>
                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                          {button.label}
                          {button.dropdownItems && (
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="h-5 w-5 flex-none group-data-open:rotate-180"
                            />
                          )}
                        </DisclosureButton>
                        {button.dropdownItems && (
                          <DisclosurePanel className="mt-2 space-y-2">
                            {button.dropdownItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </DisclosurePanel>
                        )}
                      </Disclosure>
                    )}
                  </div>
                ))}
              </div>
              <div className="py-6">
                <NavUser />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}