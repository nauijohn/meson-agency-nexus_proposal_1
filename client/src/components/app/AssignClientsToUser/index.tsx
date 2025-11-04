import Form from "./Form";
import Table from "./Table";

const AssignClientsToUser = () => {
  return (
    <div className="flex flex-row justify-between gap-10 m-4">
      <div className="flex-1">
        <Form />
      </div>

      <div className="flex-1">
        <Table />
      </div>
    </div>
  );
};

export default AssignClientsToUser;
