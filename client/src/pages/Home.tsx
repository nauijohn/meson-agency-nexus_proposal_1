"use client";

import { useSelector } from "react-redux";

import Dropdown from "@/components/app/Dropdown";
import TableData from "@/components/app/TableData";
import { Separator } from "@/components/ui/separator";
import { useGetCampaignsQuery } from "@/services/campaigns/campaigns.api";
import {
  useGetUserClientsQuery,
} from "@/services/user-clients/user-clients.api";
import { useGetUsersQuery } from "@/services/users/users.api";
import type { RootState } from "@/store";
import {
  paymentColumns,
  payments,
} from "@/utils/dummy";

const Home = () => {
  const { data: users, isFetching } = useGetUsersQuery();
  const usersOptions = users
    ? users?.map(({ id, firstName, lastName }) => ({
        label: `${firstName} ${lastName}`,
        value: id,
      }))
    : [];

  const userId = useSelector((state: RootState) => state.users.userId);

  const { data: userClients } = useGetUserClientsQuery(
    { userId },
    {
      skip: !userId,
    },
  );
  const clients = userClients?.map((uc) => uc.client) || [];
  const clientsOptions = clients
    ? clients?.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
    : [];

  const clientId = useSelector((state: RootState) => state.clients.id);

  const { data: campaigns } = useGetCampaignsQuery(
    { clientId },
    { skip: !clientId },
  );

  console.log("campaigns:", campaigns);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-12">
      <div className="flex justify-around items-center gap-5 font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col w-full">
            <h4 className="font-semibold text-xl tracking-tight scroll-m-20">
              Log in as user:
            </h4>

            <Dropdown dropDownType="users" values={usersOptions} />
          </div>

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

              <Dropdown dropDownType="campaigns" values={usersOptions} />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Client Contacts
      </h1>

      <TableData data={payments} columns={paymentColumns} />

      <Separator className="mx-auto my-4 w-full max-w-6xl" />

      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Calls
      </h1>

      <TableData data={payments} columns={paymentColumns} />
    </div>
  );
};

export default Home;
