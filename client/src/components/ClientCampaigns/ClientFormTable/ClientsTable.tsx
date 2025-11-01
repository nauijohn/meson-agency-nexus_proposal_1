import { ArrowUpDown } from "lucide-react";

import TableData from "@/components/ContactsTable";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";

import { useClientCampaigns } from "../store/ClientCampaignsContextProvider";

export type Client = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  status: string;
};

const clientColumns: ColumnDef<Client>[] = [
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
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("businessName")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("status")}</div>
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

const ClientsTable = () => {
  const { clients } = useClientCampaigns();
  return <>{clients && <TableData data={clients} columns={clientColumns} />}</>;
};

export default ClientsTable;
