import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";
import * as usersSlice from "@/store/usersSlice";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "./ui/shadcn-io/combobox";

type Props = {
  values: { value: string; label: string }[];
  dropDownType: string;
};

const Dropdown = ({ values, dropDownType }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector((state: RootState) => state.users.userId);

  console.log(dropDownType, data);

  const setValue = (value: string) => {
    switch (dropDownType) {
      case "users":
        return usersSlice.setUserId(value);
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
      onOpenChange={(open) => console.log("Combobox is open?", open)}
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
