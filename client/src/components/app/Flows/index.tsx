import { Separator } from "@/components/ui/separator";

import CampaignFlowSteps from "./CampaignFlowSteps";
import FlowActivities from "./FlowActivities";
import Flows from "./Flows";

const FlowGroup = () => {
  return (
    <div className="flex flex-col justify-between gap-2">
      <FlowActivities />

      <Separator className="m-6" />

      <Flows />

      <Separator className="m-6" />

      <CampaignFlowSteps />

      <Separator className="m-6" />
    </div>
  );
};

export default FlowGroup;
