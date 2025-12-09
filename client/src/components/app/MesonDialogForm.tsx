import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  content: React.ReactNode;
  footerContent: React.ReactNode;
};

const MesonDialogForm = ({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  content,
  footerContent,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-5">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="mt-5">{footerContent}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MesonDialogForm;
