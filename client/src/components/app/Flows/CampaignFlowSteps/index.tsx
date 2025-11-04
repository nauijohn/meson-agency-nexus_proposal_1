import Form from "./Form";
import Table from "./Table";

const CampaignFlowSteps = () => {
  return (
    <div>
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Assign a Flow to a Campaign
      </h1>

      <div className="flex flex-row justify-between gap-10 m-4">
        <div className="flex-1">
          <Form />
        </div>

        <div className="flex-1">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default CampaignFlowSteps;
