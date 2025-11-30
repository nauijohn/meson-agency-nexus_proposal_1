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
import { idParamSchema } from "@/services/base.type";
import {
  useGetFlowActivitiesQuery,
} from "@/services/flow-activities/flow-activities.api";
import {
  useCreateFlowStepActivityMutation,
  useDeleteFlowStepActivityMutation,
} from "@/services/flow-step-activities/flow-step-activities.api";
import {
  createFlowStepActivitySchema,
  type FlowStepActivity,
} from "@/services/flow-step-activities/flow-step-activities.type";
import {
  useCreateFlowStepMutation,
  useUpdateFlowStepMutation,
} from "@/services/flow-steps/flow-steps.api";
import {
  createFlowStepSchema,
  type FlowStep,
  updateFlowStepSchema,
} from "@/services/flow-steps/flow-steps.type";
import {
  useCreateFlowMutation,
  useUpdateFlowMutation,
} from "@/services/flows/flows.api";
import {
  createFlowSchema,
  type Flow,
  updateFlowSchema,
} from "@/services/flows/flows.type";
import { useForm } from "@tanstack/react-form";

const formSchema = z.object({
  id: z.uuid().nullish(),
  name: z.string().min(1, "Flow name is required"),
  steps: z.array(
    z.object({
      id: z.uuid().nullish(),
      name: z.string(),
      order: z.number(),
      activities: z.array(z.uuid()),
    }),
  ),
});

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
  const [createFlow, { isError, isSuccess, reset }] = useCreateFlowMutation();
  const [updateFlow] = useUpdateFlowMutation();
  const [updateFlowStep] = useUpdateFlowStepMutation();
  const [createFlowStep] = useCreateFlowStepMutation();
  const [createFlowStepActivity] = useCreateFlowStepActivityMutation();
  const [deleteFlowStepActivity] = useDeleteFlowStepActivityMutation();

  const { data: flowActivities } = useGetFlowActivitiesQuery();

  const flowActivityOptions = flowActivities?.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }));

  const form = useForm({
    defaultValues: isEdit
      ? ({
          ...initialLoad,
          steps:
            initialLoad?.steps.map((step) => ({
              ...step,
              activities: step.activities.map(
                (activity) => activity.activity.id,
              ),
            })) || [],
        } as z.infer<typeof formSchema>)
      : ({
          name: "",
          steps: [
            {
              name: "",
              order: 1,
              activities: [] as string[],
            },
          ],
        } as z.infer<typeof formSchema>),
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with value:", value);

      if (!isEdit) {
        console.log("NOT EDIT, CREATING FLOW....");
        const result = await createFlow(createFlowSchema.parse(value)).unwrap();
        // if successful, close the dialog
        if (result && setShowForm) {
          setShowForm(false);
          form.reset();
        }
      }

      if (isEdit) {
        const steps = value.steps;
        const newSteps = steps.filter((step) => !step.id);
        const existingSteps = steps.filter((step) => step.id);

        const originalSteps = initialLoad?.steps || [];

        const flowStepActivitiesToDelete = existingSteps
          .map((step) => {
            const originalStep = originalSteps.find((s) => s.id === step.id);
            if (originalStep) {
              const removedActivities = originalStep.activities.filter(
                (originalActivity) =>
                  !step.activities.includes(originalActivity.activity.id),
              );
              return removedActivities.map((activity) => activity.id);
            }
            return [];
          })
          .flat()
          .filter(Boolean);

        const flowStepActivitiesToCreate = existingSteps
          .map((step) => {
            const originalStep = originalSteps.find((s) => s.id === step.id);
            if (originalStep) {
              const flowStepActivitiesToCreate: {
                flowActivityId: string;
                flowStepId: string;
              }[] = [];
              const originalStepActivitiesIds = originalStep.activities.map(
                (a) => a.activity.id,
              );
              step.activities.forEach((activityId) => {
                if (!originalStepActivitiesIds.includes(activityId)) {
                  flowStepActivitiesToCreate.push({
                    flowActivityId: activityId,
                    flowStepId: step.id!,
                  });
                }
              });

              return flowStepActivitiesToCreate;
            }
            return [];
          })
          .flat()
          .filter(Boolean);

        const updateFlowPromise = updateFlow(
          updateFlowSchema.parse(value),
        ).unwrap();

        let createNewFlowStepsPromise: Promise<FlowStep[]> = Promise.resolve(
          [],
        );
        if (newSteps.length > 0) {
          console.log("Creating new flow steps....");
          createNewFlowStepsPromise = Promise.all(
            newSteps.map((step) =>
              createFlowStep(
                createFlowStepSchema.parse({ ...step, flowId: value.id }),
              ).unwrap(),
            ),
          );
        }

        let updateExistingFlowStepsPromise: Promise<FlowStep[]> =
          Promise.resolve([]);
        if (existingSteps.length > 0) {
          console.log("Updating existing flow steps....");
          console.log("Existing Steps to update:", existingSteps);
          updateExistingFlowStepsPromise = Promise.all(
            existingSteps.map((step) => {
              const { activities, ...data } = step;
              return updateFlowStep(updateFlowStepSchema.parse(data)).unwrap();
            }),
          );
        }

        let deleteRemovedStepActivitiesPromise: Promise<void[]> =
          Promise.resolve([]);
        if (flowStepActivitiesToDelete.length > 0) {
          console.log("Deleting removed flow step activities....");
          deleteRemovedStepActivitiesPromise = Promise.all(
            flowStepActivitiesToDelete.map((id) =>
              deleteFlowStepActivity(idParamSchema.parse({ id })).unwrap(),
            ),
          );
        }

        let createStepActivitiesPromise: Promise<FlowStepActivity[]> =
          Promise.resolve([]);
        if (flowStepActivitiesToCreate.length > 0) {
          createStepActivitiesPromise = Promise.all(
            flowStepActivitiesToCreate.map((c) =>
              createFlowStepActivity(
                createFlowStepActivitySchema.parse(c),
              ).unwrap(),
            ),
          );
        }

        const x = await Promise.all([
          updateFlowPromise,
          updateExistingFlowStepsPromise,
          createNewFlowStepsPromise,
          deleteRemovedStepActivitiesPromise,
          createStepActivitiesPromise,
        ]);

        // if successful, close the dialog
        if (x && setShowForm) {
          setShowForm(false);
          form.reset();
        }
      }
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
              {isEdit ? (
                <DialogTitle className="mb-5">Edit Flow</DialogTitle>
              ) : (
                <DialogTitle className="mb-5">Create New Flow</DialogTitle>
              )}
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
                          <FieldGroup key={`flow-step-field-group-${i}`}>
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
