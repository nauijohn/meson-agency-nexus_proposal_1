/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

type Props<T> = {
  form: ReactFormExtendedApi<T>;
};
const TabsOutlinedDemo = ({ form }: Props) => {
  const [tabs, setTabs] = useState([
    {
      name: "Explore",
      value: "explore",
      content: (
        <>
          Discover{" "}
          <span className="font-semibold text-foreground">fresh ideas</span>,
          trending topics, and hidden gems curated just for you. Start exploring
          and let your curiosity lead the way!
        </>
      ),
    },
    {
      name: "Favorites",
      value: "favorites",
      content: (
        <>
          All your{" "}
          <span className="font-semibold text-foreground">favorites</span> are
          saved here. Revisit articles, collections, and moments you love, any
          time you want a little inspiration.
        </>
      ),
    },
    {
      name: "Surprise Me",
      value: "surprise",
      content: (
        <>
          <span className="font-semibold text-foreground">Surprise!</span>{" "}
          Here&apos;s something unexpected—a fun fact, a quirky tip, or a daily
          challenge. Come back for a new surprise every day!
        </>
      ),
    },
  ]);

  const [activeTab, setActiveTab] = useState("explore");

  const handleAddTab = () => {
    const newIndex = tabs.length + 1;
    const newTab = {
      name: `Step ${newIndex}`,
      value: `tab-${newIndex}`,
      content: (
        <FieldGroup className="m-4">
          {/** Flow Activity Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Flow Activity Name"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/** Flow Activity Type */}
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Flow Activity Type"
                    autoComplete="off"
                    type="text"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <Button type="submit">Submit</Button>
        </FieldGroup>
      ),
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.value);
  };

  return (
    <div className="w-full max-w-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
        <TabsList className="flex justify-between bg-background p-1 border">
          {/* All dynamic tabs */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </div>

          {/* Plus tab on far right */}
          <TabsTrigger
            key="add-tab"
            value="add-tab"
            onClick={handleAddTab}
            className="flex justify-center items-center hover:bg-muted border border-dashed w-8 h-8 transition"
          >
            <Plus className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        {/* Tab contents */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabsOutlinedDemo;
