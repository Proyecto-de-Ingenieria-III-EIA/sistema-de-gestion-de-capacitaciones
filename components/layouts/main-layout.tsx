"use client"

import Header from "@/components/atomic-design/organisms/header" // Asegúrate del path
import { ChartPieIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import React from "react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const buttons = [
    {
      label: "Trainings",
      dropdownItems: [
        { name: "Task1", description: "Description for Task1", href: "#", icon: ChartPieIcon },
        { name: "Task2", description: "Description for Task2", href: "#", icon: CursorArrowRaysIcon },
      ],
    },
    {
      label: "Forum",
      href: "/forum", // No dropdown for this button
    },
    {
      label: "Progress",
      href: "/progress", // No dropdown for this button
    },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Header buttons={buttons} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
