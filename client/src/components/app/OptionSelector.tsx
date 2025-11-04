import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const OptionSelector = () => {
  // return (
  //   <ToggleGroup
  //     type="single"
  //     orientation="vertical"
  //     className="flex flex-col items-center gap-3"
  //   >
  //     <ToggleGroupItem
  //       value="option-a"
  //       className="data-[state=on]:bg-blue-600 w-40 data-[state=on]:text-white"
  //     >
  //       Option A
  //     </ToggleGroupItem>
  //     <ToggleGroupItem
  //       value="option-b"
  //       className="data-[state=on]:bg-blue-600 w-40 data-[state=on]:text-white"
  //     >
  //       Option B
  //     </ToggleGroupItem>
  //     <ToggleGroupItem
  //       value="option-c"
  //       className="data-[state=on]:bg-blue-600 w-40 data-[state=on]:text-white"
  //     >
  //       Option C
  //     </ToggleGroupItem>
  //   </ToggleGroup>
  // );

  return (
    <ToggleGroup
      className="flex flex-col items-center gap-3"
      type="multiple"
      variant="outline"
      spacing={2}
      size="sm"
      // orientation="vertical"
    >
      <ToggleGroupItem
        value="star"
        aria-label="Toggle star"
        className="data-[state=on]:bg-yellow-500 w-full data-[state=on]:text-white"
      >
        Star
      </ToggleGroupItem>
      <ToggleGroupItem
        value="heart"
        aria-label="Toggle heart"
        className="data-[state=on]:bg-yellow-500 w-full data-[state=on]:text-white"
      >
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem
        value="bookmark"
        aria-label="Toggle bookmark"
        className="data-[state=on]:bg-yellow-500 w-full data-[state=on]:text-white"
      >
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default OptionSelector;
