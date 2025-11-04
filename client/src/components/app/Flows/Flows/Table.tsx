import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetFlowsQuery } from "@/services/flows/flows.api";
import type { Flow } from "@/services/flows/flows.type";
import type { ColumnDef } from "@tanstack/react-table";

import TableData from "../../TableData";

const columns: ColumnDef<Flow["steps"][number]>[] = [
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("order")}</div>
    ),
  },

  {
    accessorKey: "stepActivities",
    header: "Step Activities",
    cell: ({ row }) => {
      const stepActivities = row.getValue("stepActivities") as {
        activity: {
          name: string;
        };
      }[];

      return (
        <div className="font-medium">
          {stepActivities.map((s) => s.activity.name).join(", ")}
        </div>
      );
    },
  },

  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const user = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="p-0 w-8 h-8">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="w-4 h-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(user.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

const Table = () => {
  const { data } = useGetFlowsQuery();

  return (
    <>
      {data &&
        data?.map((flow) => (
          <div key={flow.id}>
            {flow.steps &&
              flow.steps.map((step) => (
                <TableData key={step.id} data={flow.steps} columns={columns} />
              ))}
          </div>
        ))}
    </>
  );
};

export default Table;
