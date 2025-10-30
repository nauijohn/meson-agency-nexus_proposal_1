import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";

const Admin = () => {
  return (
    <div className="mx-auto p-6 w-full max-w-6xl">
      <h1 className="font-extrabold text-4xl text-balance tracking-tight scroll-m-20">
        Create a User
      </h1>

      <div className="flex flex-row justify-between gap-10">
        <UserForm />
        <UserTable />
      </div>
    </div>
  );
};

export default Admin;
