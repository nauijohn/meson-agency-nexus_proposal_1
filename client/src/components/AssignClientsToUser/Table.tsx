import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetTransformedUserClientsQuery } from "@/services/user-clients/user-clients.api";
import type { TransformedUserClient } from "@/services/user-clients/user-clients.type";
import type { ColumnDef } from "@tanstack/react-table";

import TableData from "../TableData";

const columns: ColumnDef<TransformedUserClient>[] = [
  {
    accessorKey: "clientName",
    header: "Client Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "assignedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assigned Date
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">
        {new Date(row.getValue("assignedDate")).toISOString()}
      </div>
    ),
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
  const { data } = useGetTransformedUserClientsQuery();
  return <>{data && <TableData data={data} columns={columns} />}</>;
};

export default Table;
