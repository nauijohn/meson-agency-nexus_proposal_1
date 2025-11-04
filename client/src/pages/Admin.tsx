import AssignClientToUser from "@/components/app/AssignClientsToUser";
import ClientCampaigns from "@/components/app/ClientCampaigns";
import FlowGroup from "@/components/app/Flows";
import UserForm from "@/components/app/UserForm";
import UserTable from "@/components/app/UserTable";
import { Separator } from "@/components/ui/separator";

const Admin = () => {
  return (
    <div className="py-6">
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Create a User
      </h1>

      <div className="flex justify-center gap-10 min-h-[500px]">
        <div className="flex-1">
          <UserForm />
        </div>
        <div className="flex-1">
          <UserTable />
        </div>
      </div>

      <Separator className="m-6" />

      <ClientCampaigns />

      <Separator className="m-6" />

      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Assign a Client to a User
      </h1>

      <AssignClientToUser />

      <Separator className="m-6" />

      <FlowGroup />
    </div>
  );
};

export default Admin;
