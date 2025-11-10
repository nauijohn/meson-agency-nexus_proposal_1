import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useGetCampaignFlowStepsQuery,
} from "@/services/campaign-flow-steps/campaign-flow-steps.api";
import type {
  CampaignFlowStep,
} from "@/services/campaign-flow-steps/campaign-flow-steps.type";
import type { Campaign } from "@/services/campaigns/campaigns.type";
import type { FlowStep } from "@/services/flow-steps/flow-steps.type";
import type { ColumnDef } from "@tanstack/react-table";

import TableData from "../../TableData";

const columns: ColumnDef<CampaignFlowStep>[] = [
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
      const campaign: Campaign = row.getValue("campaign");
      return <div className="lowercase">{campaign["name"]}</div>;
    },
  },

  {
    id: "campaignClient",
    accessorKey: "campaign",
    header: "Client",
    cell: ({ row }) => {
      const campaign: Campaign = row.getValue("campaign");
      return <div className="font-medium">{campaign.client.name}</div>;
    },
  },

  {
    accessorKey: "flowStep",
    header: "Flow Step Name",
    cell: ({ row }) => {
      const flowStep: FlowStep = row.getValue("flowStep");
      return <div className="font-medium">{flowStep.name}</div>;
    },
  },

  {
    id: "flowStepOrder",
    accessorKey: "flowStep",
    header: "Order",
    cell: ({ row }) => {
      const flowStep: FlowStep = row.getValue("flowStep");
      return <div className="font-medium">{flowStep.order}</div>;
    },
  },

  {
    accessorKey: "scheduledAt",
    header: "Scheduled At",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("scheduledAt")}</div>;
    },
  },

  {
    accessorKey: "dueAt",
    header: "Due At",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("dueAt")}</div>;
    },
  },
];

const Table = () => {
  const { data } = useGetCampaignFlowStepsQuery();

  return <>{data && <TableData data={data} columns={columns} />}</>;
};

export default Table;
