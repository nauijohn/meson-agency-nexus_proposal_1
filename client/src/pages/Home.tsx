"use client";

import Campaign from "@/components/Campaign";
import TableData from "@/components/ContactsTable";
import { Separator } from "@/components/ui/separator";
import { paymentColumns, payments } from "@/utils/dummy";

const Home = () => {
  return (
    <>
      <div className="flex justify-around items-center gap-5 mx-auto p-6 w-full max-w-4xl font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        <div className="flex flex-col w-full">
          <h4 className="font-semibold text-xl tracking-tight scroll-m-20">
            Campaign
          </h4>

          <Campaign />
        </div>

        <div className="flex flex-col w-full">
          <h4 className="font-semibold text-xl tracking-tight scroll-m-20">
            Client
          </h4>

          <Campaign />
        </div>
      </div>

      <Separator className="my-4" />

      <h1 className="mx-auto p-6 w-full max-w-4xl font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Client Contacts
      </h1>

      <TableData data={payments} columns={paymentColumns} />

      <Separator className="mx-auto my-4 w-full max-w-6xl" />

      <h1 className="mx-auto p-6 w-full max-w-4xl font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Calls
      </h1>

      <TableData data={payments} columns={paymentColumns} />
    </>
  );
};

export default Home;
