import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HydrateClient } from "@/trpc/server";
import { Separator } from "@radix-ui/react-separator";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger type="button" className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Boards list</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
