import React from "react";

import { Toaster } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Client } from "@/services/clients/clients.type";
import { useForm } from "@tanstack/react-form";

import MesonDialogForm from "../MesonDialogForm";

const formSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Client name is required"),
});

type Props = {
  isEdit: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues: Client;
};

const DialogForm = ({
  isEdit = false,
  open = false,
  setOpen,
  initialValues,
}: Props) => {
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isEdit) {
      }

      if (isEdit) {
      }
    },
  });

  // useMutationToast({
  //   isError,
  //   isSuccess,
  //   reset,
  //   form,
  //   successMessage: "Client added to user successfully!",
  //   errorMessage: "An error occurred while adding the client to the user.",
  // });

  return (
    <>
      <MesonDialogForm
        title={isEdit ? "Edit Client" : "Create New Client"}
        description={
          "Make changes to a flow and its steps here. Click save when you're done."
        }
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          form.reset();
        }}
        content={
          <form
            id="client-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {/** Flow Activity Name */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Client Name"
                        autoComplete="off"
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        }
        footerContent={
          <>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={() => (
                <Button type="submit" form="client-form">
                  Submit
                </Button>
              )}
            />
          </>
        }
      />
      <Toaster duration={3000} />
    </>
  );
};

export default DialogForm;
