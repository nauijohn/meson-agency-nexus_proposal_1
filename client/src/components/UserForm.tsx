import { toast, Toaster } from "sonner";
import z from "zod";

import api from "@/utils/request";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const formSchema = z.object({
  email: z.email().min(5, "Email must be at least 5 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const UserForm = () => {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, reset } = useMutation({
    mutationFn: (user: { email: string; password: string }) => {
      return api.post("/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
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
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="johndoe@mesonagency.com"
                  autoComplete="off"
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Password"
                  autoComplete="off"
                  type="password"
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

export default UserForm;
