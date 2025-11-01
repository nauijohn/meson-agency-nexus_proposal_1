import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multi-select";
import type { AnyFieldApi } from "@tanstack/react-form";

type Props = {
  data: { value: string; label: string }[];
  field: AnyFieldApi;
  label?: string;
  placeholder?: string;
};

const MultipleSelectDemo = ({ data, field, label, placeholder }: Props) => {
  return (
    <div className="space-y-2 w-full">
      {label && <Label>{label}</Label>}
      <MultipleSelector
        commandProps={{
          label: "Select categories",
        }}
        value={data.filter((d) => field.state.value?.includes(d.value))}
        defaultOptions={data}
        options={data}
        placeholder={placeholder}
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-sm text-center">No results found</p>}
        onChange={(e) => {
          field.setValue(e.map((item) => item.value));
        }}
        className="w-full"
      />
    </div>
  );
};

export default MultipleSelectDemo;
