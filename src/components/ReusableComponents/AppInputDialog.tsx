import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import type { AppDialogProps } from "@/types";

export default function AppInputDialog({ handleSubmit, inputFields, dialogTitle, children, open, onOpenChange, description }: AppDialogProps) {

  // this is a reusable dialog component
  // input fields represents the input to render. See the structure below

  //   const AppDialogFields = [
  //   {
  //     label: "Title",
  //     value: title,
  //     mutator: setTitle
  //   },
  // ]

  // mutator is a setState in useState

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      { children && (<DialogTrigger asChild>
        {children}
      </DialogTrigger>)}
      <DialogContent showCloseButton={false} className="sm:max-w-[425px] bg-white dark:bg-foreground border-none dark:text-background" aria-describedby={description ? "dialog-description-id" : undefined}>
        <form onSubmit={(e) => {handleSubmit(e)}} className="flex-col gap-8 flex">
          <DialogHeader>
            <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
              {description && (
                <DialogDescription id="dialog-description-id">
                  {description}
                </DialogDescription>
              )}
          </DialogHeader>
          {inputFields?.map((item, index) => {
            return (
              <div className="grid gap-4" key={index}>
                <div className="grid gap-3">
                  <Label>{item.label}</Label>
                  <Input
                    id={item.label + index}
                    name={item.label}
                    placeholder={item.value}
                    defaultValue={item.value}
                    required
                    onChange={(e) => {
                      item.mutator(e.target.value);
                    }}
                  />
                </div>
              </div>
            );
          })}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline-light">Cancel</Button>
            </DialogClose>
              <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
