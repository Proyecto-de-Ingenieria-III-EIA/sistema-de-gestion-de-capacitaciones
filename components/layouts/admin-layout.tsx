"use client"

import Header from "@/components/atomic-design/organisms/header"
import { BuildingLibraryIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const buttons = [
        {
          label: "Users",
          href: "/admin/users",
        },
        {
          label: "Trainings",
          dropdownItems: [
            { name: "New training", description: "Create a new training", href: "/trainings/create", icon: ChartPieIcon },
            { name: "Public Trainings", description: "Enroll to your favorite trainings", href: "/trainings/public-trainings", icon: BuildingLibraryIcon },
          ],
        },
      ];
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Header buttons={buttons} firstLinkHref="/" />

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
