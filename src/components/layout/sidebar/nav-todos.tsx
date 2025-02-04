"use client";

import { Folder, MoreHorizontal, Plus, Share, Trash2 } from "lucide-react";

import { BoardCreateDialog } from "@/app/board-create-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function NavTodos() {
  const { isMobile } = useSidebar();
  const { data } = useSession();
  const [boards] = api.post.getAll.useSuspenseQuery();
  const [openCreate, setOpenCreate] = useState(false);
  const { mutateAsync: deleteBoard } = api.post.delete.useMutation();
  const queryClient = api.useUtils();
  const pathName = usePathname();
  const router = useRouter();

  const onBoardDelete = async (id: string) => {
    try {
      await deleteBoard(id);
      if (pathName === `/board/${id}`) {
        router.push("/");
      }
      queryClient.post.getAll.setData(undefined, (oldData) =>
        oldData?.filter((board) => board.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete board", error);
    }
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {boards.map((item) => {
            const role = item.boardAccess.find(
              (access) => access.userId === data?.user?.id,
            )?.role;
            const isOnBoard = pathName === `/board/${item.id}`;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/board/${item.id}`} passHref>
                    {isOnBoard && (
                      <div className="rounded-full bg-orange-500 w-1 h-1 mr-2" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem asChild>
                      <Link href={`/board/${item.id}`} passHref>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {role === "OWNER" && (
                      <DropdownMenuItem asChild>
                        <button
                          className="w-full"
                          onClick={() => onBoardDelete(item.id)}
                        >
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete Project</span>
                        </button>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpenCreate(true)}>
              <Plus />
              <span>Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <BoardCreateDialog open={openCreate} onOpenChange={setOpenCreate} />
    </>
  );
}
