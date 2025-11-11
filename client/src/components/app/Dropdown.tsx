import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store";
import { setCampaignId } from "@/store/campaigns.slice";
import { setClientId } from "@/store/clients.slice";
import { setUserId } from "@/store/users.slice";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "../ui/shadcn-io/combobox";

type Option = {
  label: string;
  value: string;
};

export function toOptions<T extends object>(
  items: T[] = [],
  getLabel: (item: T) => string,
  getValue: (item: T) => string,
): Option[] {
  return items.map((item) => ({
    label: getLabel(item),
    value: getValue(item),
  }));
}

type Props = {
  values: Option[];
  dropDownType: string;
};

const Dropdown = ({ values, dropDownType }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const setValue = (value: string) => {
    switch (dropDownType) {
      case "users":
        return setUserId(value);
      case "clients":
        return setClientId(value);
      case "campaigns":
        return setCampaignId(value);
      default:
        break;
    }
  };

  const handleValueChange = (value: string) => {
    const action = setValue(value);
    if (action) {
      dispatch(action);
    }
  };

  return (
    <Combobox
      data={values}
      // onOpenChange={(open) => console.log("Combobox is open?", open)}
      onValueChange={handleValueChange}
      type={dropDownType}
    >
      <ComboboxTrigger className="w-full" />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxEmpty />
        <ComboboxList>
          <ComboboxGroup>
            {values.map((v) => (
              <ComboboxItem key={v.value} value={v.value}>
                {v.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default Dropdown;
