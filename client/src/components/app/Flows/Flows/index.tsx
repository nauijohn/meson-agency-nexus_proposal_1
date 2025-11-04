import Form from "./Form";
import Table from "./Table";

const Flows = () => {
  return (
    <div>
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Create a Flow
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

export default Flows;
