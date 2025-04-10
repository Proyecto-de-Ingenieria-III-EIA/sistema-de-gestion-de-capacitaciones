"use client"

import Header from "@/components/atomic-design/organisms/header" // Asegúrate del path
import React from "react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Header />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
