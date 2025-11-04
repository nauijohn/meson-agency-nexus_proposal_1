import { useState } from "react";

import {
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

type Props = {
  data: { label: string; value: string }[];
  field: AnyFieldApi;
  labelName: string;
};

const DropdownInputForm = ({ data, field, labelName }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[200px]"
        >
          {data
            ? data.find(({ value }) => value === field.state.value)?.label
            : `Select ${labelName?.toLowerCase()}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput
            placeholder={`Search ${labelName?.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No {labelName?.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {data.map(({ label, value }) => (
                <CommandItem
                  key={value}
                  value={value}
                  onSelect={(currentValue) => {
                    field.setValue(
                      currentValue === field.state.value ? "" : currentValue,
                    );
                    setOpen(false);
                  }}
                >
                  {label}
                  <Check
                    className={cn(
                      "ml-auto",
                      field.state.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownInputForm;
