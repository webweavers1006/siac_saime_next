"use client"

import {
  ChevronsUpDown,
  LogOut,
  Palette,
  Paintbrush,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { logoutAction } from "@/features/auth/actions/auth.logout.action"
import { useTheme } from "next-themes"
import { useThemePreset, PRESET_OPTIONS, EFFECT_OPTIONS } from "@/components/shared/providers/theme-provider"
import { SIDEBAR_CONFIG } from "@/features/shared";

const { LABELS } = SIDEBAR_CONFIG.UI;

export function SidebarUser({ user }) {
  const { isMobile } = useSidebar()
  const { theme = "system", setTheme } = useTheme()
  const { preset, setPreset, effect, setEffect } = useThemePreset()

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                   {user.role.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.role}</span>
                <span className="truncate text-xs">{user.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.role.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.role}</span>
                  <span className="truncate text-xs">{user.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                {LABELS.THEME_MODE}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="system">{LABELS.THEME_SYSTEM}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">{LABELS.THEME_LIGHT}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">{LABELS.THEME_DARK}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>



            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Paintbrush className="mr-2 h-4 w-4" />
                {LABELS.VISUAL_THEME}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={preset} onValueChange={setPreset}>
                  {PRESET_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>



            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sparkles className="mr-2 h-4 w-4" />
                {LABELS.EFFECTS}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={effect} onValueChange={setEffect}>
                  {EFFECT_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>


            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {LABELS.LOGOUT}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
