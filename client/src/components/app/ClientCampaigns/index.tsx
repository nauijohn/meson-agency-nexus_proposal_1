import { Separator } from "@radix-ui/react-dropdown-menu";

import CampaignFormTable from "./CampaignFormTable/CampaignFormTable";
import ClientFormTable from "./ClientFormTable";
import ClientCampaignsContextProvider
  from "./store/ClientCampaignsContextProvider";

const ClientCampaigns = () => {
  return (
    <ClientCampaignsContextProvider>
      <ClientFormTable />

      <Separator className="m-6" />

      <CampaignFormTable />
    </ClientCampaignsContextProvider>
  );
};

export default ClientCampaigns;
