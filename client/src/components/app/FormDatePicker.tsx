import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import type { AnyFieldApi } from "@tanstack/react-form";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Field,
  FieldError,
  FieldLabel,
} from "../ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

type Props = {
  field: AnyFieldApi;
  labelName: string;
};

const FormDatePicker = ({ field, labelName }: Props) => {
  const [open, setOpen] = useState(false);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{labelName}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
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
        <PopoverContent className="p-0 w-auto overflow-hidden" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            captionLayout="dropdown"
            onSelect={(date) => {
              field.setValue(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};

export default FormDatePicker;
