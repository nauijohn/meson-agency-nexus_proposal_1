import { useEffect } from "react";

import { toast, Toaster } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { useAddUserClientMutation } from "@/services/user-clients/user-clients.api";
import {
  useGetTransformedUsersQuery,
  useGetUserWithUnassignedClientsQuery,
} from "@/services/users/users.api";
import { skipToken } from "@reduxjs/toolkit/query";
import { useForm, useStore } from "@tanstack/react-form";

import SelectWithAvatarsDemo from "../shadcn-studio/select/select-31";
import MultipleSelectDemo from "../shadcn-studio/select/select-32";

const formSchema = z.object({
  userId: z.string().min(1, "User is required"),
  clientIds: z.array(z.string()).min(1, "At least one client must be selected"),
});

const Form = () => {
  const form = useForm({
    defaultValues: {
      userId: "",
      clientIds: [] as string[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value: { userId, ...body } }) => {
      const x = await Promise.all(
        body.clientIds?.map((clientId) => addUserClient({ userId, clientId })),
      );

      console.log("Add user client results:", x);
    },
  });

  const [addUserClient, { isError, isSuccess, reset }] =
    useAddUserClientMutation();

  // 👇 dynamically trigger the query when userId changes
  const userId = useStore(form.store, (state) => state.values.userId);
  const { data: user } = useGetUserWithUnassignedClientsQuery(
    userId ? { id: userId } : skipToken, // ✅ only fetch when userId exists
    { skip: !userId },
  );

  // ✅ Run side effects safely after render
  useEffect(() => {
    if (isError) {
      toast.error("An error occurred while creating the client.", {
        richColors: true,
      });
      form.reset();
      reset();
    }

    if (isSuccess) {
      toast.success("Client created successfully!", {
        richColors: true,
      });
      form.reset();
      reset();
    }
  }, [isSuccess, isError, reset, form]);

  const { data: users } = useGetTransformedUsersQuery();
  const userAvatars =
    users?.map(({ id, name }) => ({
      id,
      name,
      src: "",
      fallback: name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0),
    })) || [];

  const selectedUserUnassignedClients = user?.unassignedClients
    ? user.unassignedClients.map((client) => ({
        value: client.id,
        label: client.name,
      }))
    : [];

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="m-4">
        {/** User Id */}
        <form.Field
          name="userId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <SelectWithAvatarsDemo
                  labelName="User"
                  data={userAvatars}
                  field={field}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/** Client Ids */}
        <form.Field
          name="clientIds"
          mode="array"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <MultipleSelectDemo
                  data={selectedUserUnassignedClients}
                  field={field}
                  label="Clients"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <Button type="submit">Submit</Button>
      </FieldGroup>
      <Toaster duration={3000} />
    </form>
  );
};

export default Form;
