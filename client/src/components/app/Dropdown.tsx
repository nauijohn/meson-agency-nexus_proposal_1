import {
  useDispatch,
  useSelector,
} from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "@/store";
import { setCampaignId } from "@/store/campaigns.slice";
import { setClientId } from "@/store/clients.slice";
import { setUser } from "@/store/users.slice";

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

export type Option = {
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
        return setUser({ id: value });
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

  const selectedValue = useSelector((state: RootState) => {
    switch (dropDownType) {
      case "users":
        return state.users.id;
      case "clients":
        return state.clients.id;
      case "campaigns":
        return state.campaigns.id;
      default:
        return null;
    }
  });

  return (
    <Combobox
      data={values}
      // onOpenChange={(open) => console.log("Combobox is open?", open)}
      onValueChange={handleValueChange}
      type={dropDownType}
      value={selectedValue ?? ""}
    >
      <ComboboxTrigger className="w-full" />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxEmpty />
        <ComboboxList>
          <ComboboxGroup>
            {values.map(({ value, label }) => (
              <ComboboxItem key={value} value={value}>
                {label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default Dropdown;
