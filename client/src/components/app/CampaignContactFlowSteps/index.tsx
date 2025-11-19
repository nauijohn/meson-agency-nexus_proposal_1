import { ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  useGetUserClientsQuery,
} from "@/services/user-clients/user-clients.api";
import type { UserClient } from "@/services/user-clients/user-clients.type";
import type { RootState } from "@/store";
import type { ColumnDef } from "@tanstack/react-table";

import TableData from "../TableData";

const columns: ColumnDef<UserClient>[] = [
  {
    accessorKey: "campaign",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Campaign
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="lowercase">{row.getValue("campaign") ?? ""}</div>;
    },
  },

  {
    id: "campaignClient",
    accessorKey: "campaign",
    header: "Client",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("campaign") ?? ""}</div>
      );
    },
  },

  {
    accessorKey: "flowStep",
    header: "Flow Step Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("flowStep") ?? ""}</div>
      );
    },
  },

  {
    id: "flowStepOrder",
    accessorKey: "flowStep",
    header: "Order",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("flowStep") ?? ""}</div>
      );
    },
  },

  {
    accessorKey: "scheduledAt",
    header: "Scheduled At",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("scheduledAt") ?? ""}</div>
      );
    },
  },

  {
    accessorKey: "dueAt",
    header: "Due At",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("dueAt") ?? ""}</div>;
    },
  },
];

const CampaignContactFlowSteps = () => {
  const userId = useSelector((state: RootState) => state.users.userId);
  console.log("User ID in CampaignContactFlowSteps: ", userId);

  const { data: userClients } = useGetUserClientsQuery(
    { userId },
    { skip: !userId },
  );

  console.log("User Clients Data: ", userClients);

  return (
    <>
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Client Contacts
      </h1>

      <TableData data={[]} columns={columns} />
    </>
  );
};

export default CampaignContactFlowSteps;
