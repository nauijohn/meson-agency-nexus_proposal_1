import z from "zod";

import MultipleSelectDemo from "@/components/shadcn-studio/select/select-32";
import { Button } from "@/components/ui/button";
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
import { createFlowSchema } from "@/services/flows/flows.type";
import { useForm } from "@tanstack/react-form";

const formSchema = z.object({
  name: z.string().min(1, "Flow name is required"),
  steps: z.array(
    z.object({
      name: z.string(),
      order: z.number(),
      activities: z.array(z.uuid()),
    }),
  ),
});

const Form = () => {
  const [addFlow, { isError, isSuccess, reset }] = useAddFlowMutation();

  const { data: flowActivities } = useGetFlowActivitiesQuery();

  const flowActivityOptions = flowActivities?.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }));

  const form = useForm({
    defaultValues: {
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
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submitting flow activity:", value);
      addFlow(createFlowSchema.parse(value));
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="m-4">
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

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    <FieldGroup key={`flow-step-field-group-${i}`} className="">
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
                                <FieldError errors={field.state.meta.errors} />
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
                                <FieldError errors={field.state.meta.errors} />
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
                          const updatedSteps = newSteps.map((step, index) => ({
                            ...step,
                            order: index + 1,
                          }));
                          field.setValue(updatedSteps);
                        }}
                      >
                        Remove Step
                      </Button>
                    </FieldGroup>
                  );
                })}
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
              </>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => <Button type="submit">Submit</Button>}
        />
      </FieldGroup>
    </form>
  );
};

export default Form;
