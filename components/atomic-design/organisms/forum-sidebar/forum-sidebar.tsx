"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  HomeIcon,
  SquareTerminal,
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "../../molecules/nav-user"
import { Button } from "@/components/ui/button"
import router from "next/router"
import { useSession } from "next-auth/react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Date",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Newest First",
          url: "#",
        },
        {
          title: "Oldest First",
          url: "#",
        },
      ],
    },
    {
      title: "Interactions",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Most Popular",
          url: "#",
        },
        {
          title: "Less Popular",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "My Posts",
      url: "#",
      icon: Frame,
    },
  ],
}

export function ForumAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: session } = useSession();

  const handleRedirect = () => {
    const isAdmin = session?.user?.roleName === "ADMIN";
    router.push(isAdmin ? "/admin-dashboard" : "/");
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Button onClick={handleRedirect}> 
          <HomeIcon/>
          Home
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
