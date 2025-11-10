import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import useMutationToast from "@/hooks/useMutationToast";
import {
  useGetCampaignsWithUnassignedFlowQuery,
  useUpdateCampaignMutation,
} from "@/services/campaigns/campaigns.api";
import { updateCampaignSchema } from "@/services/campaigns/campaigns.type";
import type { FlowStep } from "@/services/flow-steps/flow-steps.type";
import { useGetFlowsQuery } from "@/services/flows/flows.api";
import {
  useForm,
  useStore,
} from "@tanstack/react-form";

import DropdownInputForm from "../../DropdownInputForm";
import FormDatePicker from "../../FormDatePicker";

const campaignFlowStepSchema = z.object({
  scheduledAt: z.date().optional(),
  dueAt: z.date().optional(),
  flowStepId: z.uuid(),
});

const formSchema = z.object({
  id: z.uuid().min(1, "Campaign is required"),
  flowId: z.uuid().min(1, "Flow is required"),
  campaignFlowSteps: z
    .array(campaignFlowStepSchema)
    .nonempty("At least one flow step is required"),
});

const Form = () => {
  const [updateCampaign, { isError, isSuccess, reset }] =
    useUpdateCampaignMutation();

  const form = useForm({
    defaultValues: {
      id: "",
      flowId: "",
      campaignFlowSteps: [] as z.infer<typeof campaignFlowStepSchema>[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      updateCampaign(updateCampaignSchema.parse(value));
    },
  });

  const { data: campaigns } = useGetCampaignsWithUnassignedFlowQuery();
  const campaignOptions =
    campaigns?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) || [];

  const { data: flows } = useGetFlowsQuery();

  const selectedFlowId = useStore(form.store, (state) => state.values.flowId);

  const selectedCampaignId = useStore(form.store, (state) => state.values.id);

  const flowIdOfCampaign = selectedCampaignId
    ? campaigns?.find((campaign) => campaign.id === selectedCampaignId)?.flow
        ?.id
    : undefined;

  let flowOptions: { label: string; value: string }[] = [];

  if (selectedCampaignId) {
    flowOptions =
      flows?.map(({ id, name }) => ({
        label: name,
        value: id,
      })) || [];
  }

  if (flowIdOfCampaign) {
    flowOptions =
      flowOptions.filter((option) => option.value !== flowIdOfCampaign) || [];
  }

  let selectedFlowSteps: FlowStep[] | undefined = undefined;
  if (selectedFlowId)
    selectedFlowSteps =
      flows?.find((flow) => flow.id === selectedFlowId)?.steps || [];

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
        {/** Campaign */}
        <form.Field
          name="id"
          listeners={{
            onChange: (e) => {
              if (!e.value) {
                form.reset();
              }
            },
          }}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Campaign</FieldLabel>
                <DropdownInputForm
                  data={campaignOptions || []}
                  field={field}
                  labelName="campaigns"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/** Flow */}
        <form.Field
          name="flowId"
          children={(field) => {
            // if (!selectedCampaignId) {
            //   field.setValue("");
            // }
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Flow</FieldLabel>
                <DropdownInputForm
                  data={flowOptions}
                  field={field}
                  labelName="flows"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/** Campaign Flow Steps Schedule */}
        <FieldLabel>Flow Steps</FieldLabel>
        <form.Field name="campaignFlowSteps" mode="array">
          {() => {
            return (
              <>
                {selectedFlowSteps &&
                  selectedFlowSteps.map((_, i) => {
                    return (
                      <Field key={`campaign-flow-step-div-${i}`}>
                        <FieldLabel>{` ${_.name}`}</FieldLabel>
                        <FieldGroup className="flex flex-row justify-evenly gap-5">
                          {/** Flow Activity Name */}

                          <form.Field
                            name={`campaignFlowSteps[${i}].scheduledAt`}
                            children={(field) => {
                              return (
                                <FormDatePicker
                                  field={field}
                                  labelName="Scheduled At"
                                />
                              );
                            }}
                          />

                          <form.Field
                            name={`campaignFlowSteps[${i}].dueAt`}
                            children={(field) => {
                              return (
                                <FormDatePicker
                                  field={field}
                                  labelName="Due At"
                                />
                              );
                            }}
                          />

                          <form.Field
                            name={`campaignFlowSteps[${i}].flowStepId`}
                            defaultValue={_.id}
                            children={() => <></>}
                          />
                        </FieldGroup>
                      </Field>
                    );
                  })}
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
