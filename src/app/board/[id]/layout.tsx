import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/trpc/server";

export default async function BoardPage(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await props.params;
  const board = await api.post.get({ id });

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger type="button" className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Boards list</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{board.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <span className="text-sm text-muted-foreground">
          {board.description}
        </span>

        <div>{props.children}</div>
      </div>
    </div>
  );
}
