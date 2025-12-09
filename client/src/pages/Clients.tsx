import { useState } from "react";

import {
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";

import DialogForm from "@/components/app/Clients/DialogForm";
import TableActionDropdown from "@/components/app/TableActionDropdown";
import TableData from "@/components/app/TableData";
import Typography from "@/components/typography/Typography";
import { Button } from "@/components/ui/button";
import { useGetClientsQuery } from "@/services/clients/clients.api";
import type { Client } from "@/services/clients/clients.type";
import type { ColumnDef } from "@tanstack/react-table";

const init: Client = {
  id: "",
  name: "",
};

const Clients = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialValues, setInitialValues] = useState(init);
  const [page, setPage] = useState(1);
  const { data } = useGetClientsQuery({ page });

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name") ?? ""}</div>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Date(row.getValue("createdAt")).toLocaleString("en-AU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        return (
          <TableActionDropdown
            trigger={
              <Button variant="ghost" className="p-0 w-8 h-8">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            }
            dropdownItems={[
              {
                label: "Edit",
                onClick: () => {
                  setOpen(true);
                  setIsEdit(true);
                  setInitialValues(row.original);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <section className="flex flex-col gap-5 mx-auto pt-5 w-full h-full container">
      <Typography.H1>Clients</Typography.H1>

      <TableData
        data={data?.items || []}
        columns={columns}
        paginationMeta={{ ...data, setPage }}
        dialogFormTrigger={
          <Button
            onClick={() => {
              setOpen(true);
              setInitialValues(init);
            }}
          >
            Create
          </Button>
        }
      />

      <DialogForm
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
        initialValues={initialValues}
      />
    </section>
  );
};

export default Clients;
