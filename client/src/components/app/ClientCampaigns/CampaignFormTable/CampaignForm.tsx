import { Toaster } from "sonner";
import z from "zod";

import {
  useClientCampaigns,
} from "@/components/app/ClientCampaigns/store/ClientCampaignsContextProvider";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useMutationToast from "@/hooks/useMutationToast";
import { useAddCampaignMutation } from "@/services/campaigns/campaigns.api";
import { createCampaignSchema } from "@/services/campaigns/campaigns.type";
import { useForm } from "@tanstack/react-form";

import DropdownInputForm from "../../DropdownInputForm";
import FormDatePicker from "../../FormDatePicker";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().min(8, "Password must be at least 8 characters long"),
  startDate: z.date(),
  endDate: z.date(),
  clientId: z.string().min(1, "Client ID is required"),
});

const CampaignForm = () => {
  const { clients } = useClientCampaigns();
  const clientOptions =
    clients?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) || [];

  const [addCampaign, { isError, isSuccess, reset }] = useAddCampaignMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      clientId: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      addCampaign(createCampaignSchema.parse(value));
    },
    canSubmitWhenInvalid: false,
  });

  useMutationToast({
    isError,
    isSuccess,
    reset,
    form,
    successMessage: "Campaign created successfully!",
    errorMessage: "An error occurred while creating the campaign.",
  });

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="m-4">
        {/** Name */}
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
                  placeholder="John Doe Campaign"
                  autoComplete="off"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        {/** Description */}
        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Description of the campaign"
                  autoComplete="off"
                  type="text"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <div className="flex flex-row justify-evenly gap-5">
          {/** Start Date */}
          <form.Field
            name="startDate"
            children={(field) => {
              return <FormDatePicker field={field} labelName="Start Date" />;
            }}
          />

          {/** End Date */}
          <form.Field
            name="endDate"
            children={(field) => {
              return <FormDatePicker field={field} labelName="End Date" />;
            }}
          />
        </div>

        {/** Client */}
        <form.Field
          name="clientId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Client</FieldLabel>
                <DropdownInputForm
                  data={clientOptions}
                  field={field}
                  labelName="client"
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

export default CampaignForm;
