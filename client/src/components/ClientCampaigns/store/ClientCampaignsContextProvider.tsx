import { createContext, type FC, type ReactNode, useContext } from "react";

import type { Client } from "@/components/ClientCampaigns/ClientFormTable/ClientsTable";
import api from "@/utils/request";
import { useQuery } from "@tanstack/react-query";

type ClientCampaignsContextType = {
  clients: Client[] | undefined;
};

const ClientCampaignsContext = createContext<ClientCampaignsContextType>({
  clients: [],
});

type Props = {
  children: ReactNode;
};

const ClientCampaignsContextProvider: FC<Props> = ({ children }) => {
  const { data: clients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => {
      return api.get("/clients");
    },
    select(data) {
      return data.map((client) => ({
        id: client.id,
        email: client.email,
        name: client.name,
        businessName: client.businessName,
        status: client.status,
      }));
    },
  });

  return (
    <ClientCampaignsContext.Provider value={{ clients: clients }}>
      {children}
    </ClientCampaignsContext.Provider>
  );
};

export default ClientCampaignsContextProvider;

export const useClientCampaigns = () => useContext(ClientCampaignsContext);
