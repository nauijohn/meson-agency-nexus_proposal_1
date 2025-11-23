"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import CampaignContactFlowSteps
  from "@/components/app/CampaignContactFlowSteps";
import Dropdown, {
  type Option,
  toOptions,
} from "@/components/app/Dropdown";
import TableData from "@/components/app/TableData";
import { Separator } from "@/components/ui/separator";
import { useGetCampaignsQuery } from "@/services/campaigns/campaigns.api";
import type { Client } from "@/services/clients/clients.type";
import {
  useGetUserClientsQuery,
} from "@/services/user-clients/user-clients.api";
import type {
  AppDispatch,
  RootState,
} from "@/store";
import { setCampaignId } from "@/store/campaigns.slice";
import { setClientId } from "@/store/clients.slice";
import {
  paymentColumns,
  payments,
} from "@/utils/dummy";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: RootState) => state.users.id);
  const clientId = useSelector((state: RootState) => state.clients.id);

  // ✅ local state for dropdown options
  const [clientsOptions, setClientsOptions] = useState<Option[]>([]);
  const [campaignsOptions, setCampaignsOptions] = useState<Option[]>([]);

  // USER CLIENTS
  const { data: userClients } = useGetUserClientsQuery(
    { userId },
    { skip: !userId },
  );

  // Update clientsOptions when userClients changes
  useEffect(() => {
    if (userClients && userClients.length > 0) {
      const opts = toOptions(
        userClients
          ? userClients
              .map((uc) => uc.client ?? null)
              .filter((c): c is Client => c !== null)
          : [],
        (c) => c.name,
        (c) => c.id,
      );
      setClientsOptions(opts);
    } else {
      setClientsOptions([]);
    }
  }, [userClients]);

  // CAMPAIGNS
  const { data: campaigns } = useGetCampaignsQuery(
    { clientId },
    { skip: !clientId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setCampaignsOptions(
        toOptions(
          campaigns,
          (c) => c.name,
          (c) => c.id,
        ),
      );
    } else {
      setCampaignsOptions([]);
    }
  }, [campaigns]);

  // ✅ Reset logic
  useEffect(() => {
    // When user changes, reset everything
    dispatch(setClientId(null));
    dispatch(setCampaignId(null));
    setClientsOptions([]);
    setCampaignsOptions([]);
  }, [userId, dispatch]);

  useEffect(() => {
    // When client changes, reset campaign
    dispatch(setCampaignId(null));
    setCampaignsOptions([]);
  }, [clientId, dispatch]);

  return (
    <div className="my-12">
      <div className="flex justify-around items-center gap-5 font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex gap-5 w-full">
            <div className="flex flex-col w-full">
              <h4 className="font-semibold text-xl tracking-tight scroll-m-20">
                Client
              </h4>

              <Dropdown dropDownType="clients" values={clientsOptions} />
            </div>

            <div className="flex flex-col w-full">
              <h4 className="font-semibold text-xl tracking-tight scroll-m-20">
                Campaign
              </h4>

              <Dropdown dropDownType="campaigns" values={campaignsOptions} />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <CampaignContactFlowSteps />

      <Separator className="mx-auto my-4 w-full max-w-6xl" />

      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Calls
      </h1>

      <TableData data={payments} columns={paymentColumns} />
    </div>
  );
};

export default Home;
