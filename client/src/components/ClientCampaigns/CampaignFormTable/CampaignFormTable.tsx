import CampaignForm from "./CampaignForm";
import CampaignsTable from "./CampaignTable";

const CampaignFormTable = () => {
  return (
    <>
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Create a Campaign for a Client
      </h1>

      <div className="flex flex-row justify-between gap-10">
        <div className="flex-1">
          <CampaignForm />
        </div>
        <div className="flex-1">
          <CampaignsTable />
        </div>
      </div>
    </>
  );
};

export default CampaignFormTable;
