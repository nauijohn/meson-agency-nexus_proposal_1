import ClientForm from "./ClientForm";
import ClientsTable from "./ClientsTable";

const ClientFormTable = () => {
  return (
    <>
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Create a Client
      </h1>

      <div className="flex flex-row justify-between gap-10">
        <div className="flex-1">
          <ClientForm />
        </div>
        <div className="flex-1">
          <ClientsTable />
        </div>
      </div>
    </>
  );
};

export default ClientFormTable;
