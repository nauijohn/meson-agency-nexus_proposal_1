import { useEffect, useState } from "react";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Call, Device } from "@twilio/voice-sdk";

export function DialogCallButton() {
  const [open, setOpen] = useState(false);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if (open) {
      const deviceInit = async () => {
        try {
          console.log(`${import.meta.env.VITE_BACKEND_URL}/twilio/token`);
          const res2 = await axios.request({
            baseURL: `${import.meta.env.VITE_BACKEND_URL}/twilio/token`,
            // headers: {
            //   "ngrok-skip-browser-warning": "true",
            // },
            headers: {
              Accept: "application/json",
            },
          });
          console.log("res2: ", res2);
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/twilio/token`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            },
          );

          if (res.ok) {
            console.log("LATEST2...");
            const a = await res.text();

            console.log("a: ", a);

            const newDevice = new Device(res2.data.token, {
              codecPreferences: [Call.Codec.PCMU, Call.Codec.Opus],
            });

            await newDevice.register();

            const x = await newDevice.connect({
              params: {
                From: "+61348242513",
                To: "+61493233059",
              },
            });

            setCall(x);
          }
        } catch (error) {
          console.error("Error connecting device:", error);
        }
      };

      deviceInit();
    }
  }, [open]);

  return (
    <Dialog
      onOpenChange={() => {
        if (!open) {
          setOpen(true);
        } else {
          call?.disconnect();
          setOpen(false);
        }
      }}
    >
      <form>
        <DialogTrigger asChild>
          <Button variant="default">Call</Button>
        </DialogTrigger>
        <DialogContent
          className="w-full"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="gap-4 grid">
            <div className="gap-3 grid">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="gap-3 grid">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>

          {/* <OptionSelector /> */}

          <DialogFooter className="justify-center! items-center! flex!">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => {
                call?.disconnect();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
