"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { ChatSession } from "@/hooks/use-chat-sessions"

export function ChatHistorySidebar<M>({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  sessions: ChatSession<M>[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-3">
        <Button
          onClick={onNew}
          variant="outline"
          className="w-full justify-start"
        >
          <HugeiconsIcon icon={Add01Icon} />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  No chats yet.
                </p>
              ) : (
                sessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton
                      isActive={session.id === activeId}
                      onClick={() => onSelect(session.id)}
                    >
                      <HugeiconsIcon icon={Message01Icon} />
                      <span className="truncate">{session.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      onClick={(event) => {
                        event.stopPropagation()
                        onDelete(session.id)
                      }}
                    >
                      <HugeiconsIcon icon={Delete02Icon} />
                      <span className="sr-only">Delete chat</span>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
