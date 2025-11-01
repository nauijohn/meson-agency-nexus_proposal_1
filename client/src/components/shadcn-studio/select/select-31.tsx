import { useId } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnyFieldApi } from "@tanstack/react-form";

type Props = {
  data: {
    id: string;
    src: string;
    fallback: string;
    name: string;
  }[];
  field: AnyFieldApi;
  labelName: string;
  placeholder?: string;
};

const SelectWithAvatarsDemo = ({
  data,
  field,
  labelName,
  placeholder,
}: Props) => {
  const id = useId();

  return (
    <div className="space-y-2 border-amber-300 w-full">
      <Label htmlFor={field.name}>{labelName}</Label>
      <Select
        name={field.name}
        defaultValue={undefined}
        onValueChange={field.setValue}
        value={field.state.value}
      >
        <SelectTrigger
          id={id}
          className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 pl-2 w-full [&>span_img]:shrink-0"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2">
          <SelectGroup>
            <SelectLabel className="pl-2">Impersonate user</SelectLabel>
            {data.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                <Avatar className="size-5">
                  <AvatarImage
                    className="rounded-full"
                    src={item.src}
                    alt={item.name}
                  />
                  <AvatarFallback className="text-xs">
                    {item.fallback}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{item.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithAvatarsDemo;
