import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

const FormTest = () => {
  const formTest = [
    { type: "text", name: "name", label: "Name" },
    { type: "text", name: "name2", label: "Name2" },
    { type: "text", name: "name3", label: "Name3" },
  ];

  const defVal = formTest.map((x) => ({
    [x.name]: "",
  }));

  const form = useForm({
    defaultValues: defVal,
    // validators: {
    //   // onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {},
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
        {formTest.map((x) => {
          switch (x.type) {
            case "text":
              return (
                <form.Field
                  name={x.name as any}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{x.label}</FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value as any)
                          }
                          aria-invalid={isInvalid}
                          placeholder={x.label}
                          autoComplete="off"
                        />

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              );
          }
        })}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => <Button type="submit">Submit</Button>}
        />
      </FieldGroup>
    </form>
  );
};

export default FormTest;
