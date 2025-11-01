import { useState } from "react";

import { Check, ChevronDownIcon, ChevronsUpDown } from "lucide-react";
import { toast, Toaster } from "sonner";
import z from "zod";

import { useClientCampaigns } from "@/components/ClientCampaigns/store/ClientCampaignsContextProvider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import api from "@/utils/request";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().min(8, "Password must be at least 8 characters long"),
  startDate: z.date(),
  endDate: z.date(),
  clientId: z.string().min(1, "Client ID is required"),
});

const CampaignForm = () => {
  const queryClient = useQueryClient();
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const { clients } = useClientCampaigns();
  const [openClient, setOpenClient] = useState(false);
  // const [date, setDate] = useState<Date | undefined>(undefined);
  const { mutate, isError, isSuccess, reset } = useMutation({
    mutationFn: (campaign: {
      name: string;
      description: string;
      startDate: Date;
      endDate: Date;
      clientId: string;
    }) => {
      return api.post("/campaigns", campaign);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

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
      console.log("Submitting campaign:", value);
      mutate(value);
    },
    canSubmitWhenInvalid: false,
  });

  if (isError) {
    toast.error("An error occurred while creating the user.", {
      richColors: true,
    });
    reset();
  }

  if (isSuccess) {
    toast.success("User created successfully!", {
      richColors: true,
    });
    form.reset();
    reset();
  }

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
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                  <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between w-48 font-normal"
                      >
                        {field.state.value
                          ? field.state.value.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-auto overflow-hidden"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.setValue(date ?? new Date());
                          setOpenStartDate(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/** End Date */}
          <form.Field
            name="endDate"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                  <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between w-48 font-normal"
                      >
                        {field.state.value
                          ? field.state.value.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-auto overflow-hidden"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.setValue(date ?? new Date());
                          setOpenEndDate(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
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
                <Popover open={openClient} onOpenChange={setOpenClient}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openClient}
                      className="justify-between w-[200px]"
                    >
                      {clients
                        ? clients.find(
                            (client) => client.id === field.state.value,
                          )?.name
                        : "Select client..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[200px]">
                    <Command>
                      <CommandInput
                        placeholder="Search client..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                          {clients?.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.id}
                              onSelect={(currentValue) => {
                                field.setValue(
                                  currentValue === field.state.value
                                    ? "tes"
                                    : currentValue,
                                );
                                setOpenClient(false);
                              }}
                            >
                              {client.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field.state.value === client.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
