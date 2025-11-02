import { ArrowUpDown } from "lucide-react";

import TableData from "@/components/TableData";
import { Button } from "@/components/ui/button";
import api from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

type Campaign = {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  client: {
    id: string;
    name: string;
  };
  clientName: string;
};

const campaignColumns: ColumnDef<Campaign>[] = [
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
    accessorFn: (row) => row.client?.name ?? "",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <div className="font-medium">{value}</div>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("startDate")}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("endDate")}</div>
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

const CampaignTable = () => {
  const { data: campaigns } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: () => {
      return api.get("/campaigns");
    },
    select(data) {
      return data.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status,
        client: campaign.client,
        clientName: campaign.client.name,
      }));
    },
  });
  return (
    <>{campaigns && <TableData data={campaigns} columns={campaignColumns} />}</>
  );
};

export default CampaignTable;
