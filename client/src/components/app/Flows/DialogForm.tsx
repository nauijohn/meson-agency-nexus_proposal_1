import React from "react";

import { Toaster } from "sonner";
import z from "zod";

import MultipleSelectDemo from "@/components/shadcn-studio/select/select-32";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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
} from "@/services/flow-step-activities/flow-step-activities.type";
import {
  useCreateFlowStepMutation,
  useDeleteFlowStepMutation,
  useUpdateFlowStepMutation,
} from "@/services/flow-steps/flow-steps.api";
import {
  createFlowStepSchema,
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

import MesonDialogForm from "../MesonDialogForm";

const formSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Flow name is required"),
  steps: z.array(
    z.object({
      id: z.uuid(),
      name: z.string().min(1, "Flow step name is required"),
      order: z.number(),
      activities: z.array(z.uuid()).min(1, "At least one activity is required"),
    }),
  ),
});

type FormType = z.infer<typeof formSchema>;
type FormStep = FormType["steps"][number];

type Props = {
  isEdit: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues: Flow;
};

const DialogForm = ({
  isEdit = false,
  open = false,
  setOpen,
  initialValues,
}: Props) => {
  const [createFlow, { isError, isSuccess, reset }] = useCreateFlowMutation();
  const [updateFlow] = useUpdateFlowMutation();
  const [updateFlowStep] = useUpdateFlowStepMutation();
  const [createFlowStep] = useCreateFlowStepMutation();
  const [createFlowStepActivity] = useCreateFlowStepActivityMutation();
  const [deleteFlowStepActivity] = useDeleteFlowStepActivityMutation();
  const [deleteFlowStep] = useDeleteFlowStepMutation();

  const { data: flowActivities } = useGetFlowActivitiesQuery();

  const flowActivityOptions = flowActivities?.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }));

  const form = useForm({
    defaultValues: {
      ...initialValues,
      steps:
        initialValues?.steps.map((step) => ({
          ...step,
          activities: step.activities.map((activity) => activity.activity.id),
        })) || [],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isEdit) {
        const result = await createFlow(createFlowSchema.parse(value)).unwrap();
        if (result) {
          setOpen(false);
          form.reset();
        }
      }

      if (isEdit) {
        const steps = value.steps;

        const newSteps = steps.filter((step) => !step.id);
        const existingSteps = steps.filter((step) => step.id) || [];

        const originalSteps = initialValues?.steps || [];

        // Create a fast lookup map
        const originalStepMap = new Map(originalSteps.map((s) => [s.id, s]));

        // -------------------------------------
        // Calculate activities to DELETE
        // -------------------------------------
        const flowStepActivitiesToDelete: string[] = [];

        for (const step of existingSteps) {
          const originalStep = step.id && originalStepMap.get(step.id);
          if (!originalStep) continue;

          const removedActivities = originalStep.activities.filter(
            (origAct) => !step.activities.includes(origAct.activity.id),
          );

          for (const removed of removedActivities) {
            flowStepActivitiesToDelete.push(removed.id);
          }
        }

        // -------------------------------------
        // Detect Flow Steps to DELETE
        // -------------------------------------
        const removedFlowSteps = originalSteps.filter(
          (orig) => !existingSteps.some((step) => step.id === orig.id),
        );

        // Prepare delete promises for removed steps
        const deleteRemovedFlowStepsPromise = removedFlowSteps.length
          ? Promise.all(
              removedFlowSteps.map((step) =>
                deleteFlowStep(idParamSchema.parse({ id: step.id })).unwrap(),
              ),
            )
          : Promise.resolve([]);

        // -------------------------------------
        // Calculate activities to CREATE
        // -------------------------------------
        const flowStepActivitiesToCreate: {
          flowActivityId: string;
          flowStepId: string;
        }[] = [];

        for (const step of existingSteps) {
          const originalStep = step.id && originalStepMap.get(step.id);
          if (!originalStep) continue;

          const originalActivityIds = new Set(
            originalStep.activities.map((a) => a.activity.id),
          );

          for (const activityId of step.activities) {
            if (!originalActivityIds.has(activityId)) {
              flowStepActivitiesToCreate.push({
                flowActivityId: activityId,
                flowStepId: step.id!,
              });
            }
          }
        }

        // -------------------------------------
        // Promises
        // -------------------------------------
        const updateFlowPromise = updateFlow(
          updateFlowSchema.parse(value),
        ).unwrap();

        const createNewFlowStepsPromise = newSteps.length
          ? Promise.all(
              newSteps.map((step) =>
                createFlowStep(
                  createFlowStepSchema.parse({ ...step, flowId: value.id }),
                ).unwrap(),
              ),
            )
          : Promise.resolve([]);

        const updateExistingFlowStepsPromise = existingSteps.length
          ? Promise.all(
              existingSteps.map((step) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { activities, ...data } = step;
                return updateFlowStep(
                  updateFlowStepSchema.parse(data),
                ).unwrap();
              }),
            )
          : Promise.resolve([]);

        const deleteRemovedStepActivitiesPromise =
          flowStepActivitiesToDelete.length
            ? Promise.all(
                flowStepActivitiesToDelete.map((id) =>
                  deleteFlowStepActivity(idParamSchema.parse({ id })).unwrap(),
                ),
              )
            : Promise.resolve([]);

        const createStepActivitiesPromise = flowStepActivitiesToCreate.length
          ? Promise.all(
              flowStepActivitiesToCreate.map((c) =>
                createFlowStepActivity(
                  createFlowStepActivitySchema.parse(c),
                ).unwrap(),
              ),
            )
          : Promise.resolve([]);

        // -------------------------------------
        // Execute all
        // -------------------------------------
        const result = await Promise.all([
          updateFlowPromise,
          updateExistingFlowStepsPromise,
          createNewFlowStepsPromise,
          createStepActivitiesPromise,
          deleteRemovedStepActivitiesPromise,
          deleteRemovedFlowStepsPromise,
        ]);

        if (result) {
          setOpen(false);
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
    <>
      <MesonDialogForm
        title={isEdit ? "Edit Flow" : "Create New Flow"}
        description="Make changes to a flow and its steps here. Click save when you're done."
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          form.reset();
        }}
        content={
          <form
            id="flow-form"
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

                            {/** Flow Activities*/}
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
                    </>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        }
        footerContent={
          <>
            <Button
              type="button"
              onClick={() => {
                form.setFieldValue("steps", (prev: FormStep[]) => {
                  const updated = [
                    ...prev,
                    {
                      id: "",
                      name: "",
                      order: prev.length + 1,
                      activities: [],
                    },
                  ];

                  return updated;
                });
              }}
            >
              Add Flow Step
            </Button>

            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={() => (
                <Button type="submit" form="flow-form">
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
