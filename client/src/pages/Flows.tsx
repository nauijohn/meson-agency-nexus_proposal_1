import { useState } from "react";

import {
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";

import DialogForm from "@/components/app/Flows/DialogForm";
import TableData from "@/components/app/TableData";
import Typography from "@/components/typography/Typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetFlowsQuery } from "@/services/flows/flows.api";
import { type Flow } from "@/services/flows/flows.type";
import type { ColumnDef } from "@tanstack/react-table";

const Flows = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialLoad, setInitialLoad] = useState<Flow>({
    id: "",
    name: "",
    steps: [],
  });
  const [page, setPage] = useState(1);
  const { data } = useGetFlowsQuery({ page });

  const columns: ColumnDef<Flow>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name") ?? ""}</div>
      ),
    },

    {
      accessorKey: "steps",
      header: "Steps",
      cell: ({ row }) => {
        const steps: Array<object> = row.getValue("steps");
        return <div className="font-medium">{steps.length}</div>;
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Date(row.getValue("createdAt")).toLocaleString("en-AU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const flow = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 w-8 h-8">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setShowForm(true);
                  setIsEdit(true);
                  setInitialLoad(flow);
                }}
              >
                Edit Flow
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(flow.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <section className="flex flex-col gap-5 mx-auto pt-5 w-full h-full container">
      <Typography.H1>Flows</Typography.H1>

      <TableData
        data={data?.items || []}
        columns={columns}
        paginationMeta={{ ...data, setPage }}
        // hoverContent={
        //   <div className="flex justify-between gap-4">
        //     <Avatar>
        //       <AvatarImage src="https://github.com/vercel.png" />
        //       <AvatarFallback>VC</AvatarFallback>
        //     </Avatar>
        //     <div className="space-y-1">
        //       <h4 className="font-semibold text-sm">@nextjs</h4>
        //       <p className="text-sm">
        //         The React Framework – created and maintained by @vercel.
        //       </p>
        //       <div className="text-muted-foreground text-xs">
        //         Joined December 2021
        //       </div>
        //     </div>
        //   </div>
        // }
      />

      <DialogForm
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        showForm={showForm}
        setShowForm={setShowForm}
        initialLoad={initialLoad}
      />
    </section>
  );
};

export default Flows;
