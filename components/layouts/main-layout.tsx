"use client"

import Header from "@/components/atomic-design/organisms/header" // Asegúrate del path
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import React from "react"

export default function MainLayout({ children }: { children: React.ReactNode }) {

  const { data: session } = useSession();
  const isAdmin = session?.user?.roleName === "ADMIN"

  const buttons = [
    {
      label: "Trainings",
      dropdownItems: [
        { name: "Public Trainings", description: "Enroll to your favorite trainings", href: "/trainings/public-trainings", icon: BuildingLibraryIcon },
      ],
    },
    {
      label: "Forum",
      href: "/forum", 
    },
    ...(isAdmin
      ? [
          {
            label: "Dashboard",
            href: "/admin-dashboard",
          },
        ]
      : []),
  ];
  return (
    <div className="flex flex-col min-h-screen">
      
      <Header buttons={buttons} firstLinkHref="/" />

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
