import React from "react";

import { Toaster } from "sonner";
import z from "zod";

import MultipleSelectDemo from "@/components/shadcn-studio/select/select-32";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useMutationToast from "@/hooks/useMutationToast";
import {
  useGetFlowActivitiesQuery,
} from "@/services/flow-activities/flow-activities.api";
import { useAddFlowMutation } from "@/services/flows/flows.api";
import {
  createFlowSchema,
  type Flow,
} from "@/services/flows/flows.type";
import { useForm } from "@tanstack/react-form";

const createFormSchema = z.object({
  name: z.string().min(1, "Flow name is required"),
  steps: z.array(
    z.object({
      name: z.string(),
      order: z.number(),
      activities: z.array(z.uuid()),
    }),
  ),
});

const editFormSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Flow name is required"),
  steps: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      order: z.number(),
      activities: z.array(z.uuid()),
    }),
  ),
});

// const createFlowsDefaultValues = {
//   name: "",
//   steps: [
//     {
//       name: "",
//       order: 1,
//       activities: [] as string[],
//     },
//   ],
// };

const DialogForm = ({
  isEdit = false,
  showForm = false,
  setShowForm,
  initialLoad,
  setIsEdit,
}: {
  isEdit?: boolean;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  showForm?: boolean;
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
  initialLoad?: Flow;
}) => {
  const [addFlow, { isError, isSuccess, reset }] = useAddFlowMutation();

  const { data: flowActivities } = useGetFlowActivitiesQuery();

  const flowActivityOptions = flowActivities?.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }));

  const form = useForm({
    defaultValues: isEdit
      ? {
          ...initialLoad,
          steps:
            initialLoad?.steps.map((step) => ({
              ...step,
              activities: step.activities.map((activity) => activity.id),
            })) || [],
        }
      : {
          name: "",
          steps: [
            {
              name: "",
              order: 1,
              activities: [] as string[],
            },
          ],
        },
    validators: {
      onSubmit: isEdit ? editFormSchema : createFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submitting flow:", value);
      if (!isEdit) addFlow(createFlowSchema.parse(value));
    },
  });

  useMutationToast({
    isError,
    isSuccess,
    reset,
    form,
    successMessage: "Client added to user successfully!",
    errorMessage: "An error occurred while adding the client to the user.",
  });

  return (
    <div>
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          console.log("open: ", open);
          if (setShowForm) {
            if (!open) {
              console.log("closing ....");
              form.reset();
              reset();
              if (setIsEdit) setIsEdit(false);
            }

            setShowForm(open);
          }
        }}
      >
        <DialogTrigger asChild>
          {/* {isEdit ? (
            <Button className="cursor-pointer" variant="ghost">
              Edit Flow
            </Button>
          ) : ( */}
          <Button variant="default">Create New Flow</Button>
          {/* )} */}
        </DialogTrigger>

        <DialogContent className="max-h-[60vh] overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle className="mb-5">Create New Flow</DialogTitle>
              {/* <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription> */}
            </DialogHeader>

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
                        placeholder="Flow Name"
                        autoComplete="off"
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/** Flow Steps */}
              <FieldLabel>Flow Steps</FieldLabel>
              <form.Field name="steps" mode="array">
                {(field) => {
                  return (
                    <>
                      {field.state.value.map((_, i) => {
                        return (
                          <FieldGroup
                            key={`flow-step-field-group-${i}`}
                            className=""
                          >
                            {/** Flow Activity Name */}
                            <FieldLabel>{`Step ${i + 1}`}</FieldLabel>
                            <form.Field
                              name={`steps[${i}].name`}
                              children={(field) => {
                                const isInvalid =
                                  field.state.meta.isTouched &&
                                  !field.state.meta.isValid;
                                return (
                                  <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                      Flow Step Name
                                    </FieldLabel>
                                    <Input
                                      name={field.name}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      aria-invalid={isInvalid}
                                      placeholder="Flow Activity Name"
                                      autoComplete="off"
                                    />
                                    {isInvalid && (
                                      <FieldError
                                        errors={field.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                );
                              }}
                            />

                            {/** Client */}
                            {/** activity Ids */}
                            <form.Field
                              name={`steps[${i}].activities`}
                              mode="array"
                              children={(field) => {
                                const isInvalid =
                                  field.state.meta.isTouched &&
                                  !field.state.meta.isValid;

                                return (
                                  <Field data-invalid={isInvalid}>
                                    <MultipleSelectDemo
                                      data={flowActivityOptions || []}
                                      field={field}
                                      label="Activities"
                                    />
                                    {isInvalid && (
                                      <FieldError
                                        errors={field.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                );
                              }}
                            />

                            {/** Remove Step Button */}
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                const newSteps = [...field.state.value];
                                newSteps.splice(i, 1);
                                const updatedSteps = newSteps.map(
                                  (step, index) => ({
                                    ...step,
                                    order: index + 1,
                                  }),
                                );
                                field.setValue(updatedSteps);
                              }}
                            >
                              Remove Step
                            </Button>
                          </FieldGroup>
                        );
                      })}
                      <DialogFooter className="mt-5">
                        <Button
                          onClick={() => {
                            field.pushValue({
                              name: "",
                              order: field.state.value.length + 1,
                              activities: [],
                            });
                          }}
                          type="button"
                        >
                          Add Flow Step
                        </Button>

                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <form.Subscribe
                          selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                          ]}
                          children={() => <Button type="submit">Submit</Button>}
                        />
                      </DialogFooter>
                    </>
                  );
                }}
              </form.Field>
            </FieldGroup>
            {/* <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={() => <Button type="submit">Submit</Button>}
              />
            </DialogFooter> */}
          </form>
        </DialogContent>
      </Dialog>
      <Toaster duration={3000} />
    </div>
  );
};

export default DialogForm;
