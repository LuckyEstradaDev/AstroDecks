import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import type { AppCreateCardDialogProps } from "@/types";
import { useEffect, useRef, useState } from "react";
import { nanoid } from 'nanoid';

export function FlashcardDialog({ children, handleSubmit, editCardData }: AppCreateCardDialogProps) {

  // this component is used for both adding and editing cards


  const [open, onOpenChange] = useState<boolean>()
  // this useEffect resets the values of the flashcards
  useEffect(() => {
  if (open && editCardData?._id !== undefined) {
    setTerm(editCardData.term || "")
    setDefinition(editCardData.definition || "")
  }

  // If it's a "new card", reset fields on open
  if (open && editCardData?._id === undefined) {
    setTerm("")
    setDefinition("")
  }
  }, [open, editCardData])

  const [term, setTerm] = useState<string>(editCardData?.term || "")
  const [definition, setDefinition] = useState<string>(editCardData?.definition || "")
  const termRef = useRef<HTMLTextAreaElement>(null);

  const handleBtnOnClick = () => {
    const _id = editCardData?._id ?? nanoid();
    let trimmedTerm = term.trim()
    let trimmedDefinition = definition.trim()
    
    if (!_id || !term) return   

    handleSubmit({ _id, term: trimmedTerm, definition: trimmedDefinition });
    setTerm("")
    setDefinition("")
    termRef.current?.focus()

    //edit flag
    if (editCardData?._id != undefined) {
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const _id = editCardData?._id ?? nanoid();
    let trimmedTerm = term.trim()
    let trimmedDefinition = definition.trim()

    if (!_id || !term) return
    if (e.key === "Enter" && e.shiftKey) {  
      e.preventDefault();
      handleSubmit({ _id, term: trimmedTerm, definition: trimmedDefinition });
      setTerm("")
      setDefinition("")
      termRef.current?.focus()

      //edit flag
      if (editCardData?._id != undefined) {
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      { children && (<DialogTrigger asChild>
        {children}
      </DialogTrigger>)
      }
      <DialogContent onEscapeKeyDown={(e: any) => e.preventDefault()} onPointerDownOutside={(e: any) => e.preventDefault()} className="overflow-hidden sm:max-w-[425px] bg-white dark:bg-foreground text-black-200" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editCardData?._id ? "Edit Card" : "Add a card to your deck"}
            </DialogTitle>
          </DialogHeader>
          <div className="gap-3 flex flex-col">
              <div>
                <Label>Front</Label>
                <Textarea ref={termRef} onKeyDown={handleKeyDown} className="mt-2 max-h-[10rem] !text-base bg-white dark:bg-foreground border-[2px] border-dark-200 resize-none overflow-auto" placeholder="Mitochondria" value={term} onChange={(e) => setTerm(e.target.value)}/>
              </div>
              <div>
                <Label>Back</Label>
                <Textarea onKeyDown={handleKeyDown} className="mt-2 max-h-[10rem] resize-none overflow-auto !text-base bg-white dark:bg-foreground border-[2px] border-dark-200" placeholder="The powerhouse of the cell." value={definition} onChange={(e) => setDefinition(e.target.value)}/>
              </div>
          </div>
          <DialogFooter className="flex items-center !justify-end">
            {/* <div className="flex items-center gap-2">
              <Switch id="airplane-mode" checked={isFrontAndBack} onClick={() => setFrontAndBack(prev => !prev)}/>
              <Label htmlFor="airplane-mode">Front and Back</Label>
            </div> */}
            <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline-light">Cancel</Button>
            </DialogClose>

            { 
            editCardData?._id ? 
              <Button className={!term || !definition ? "hidden": ""} type="button" onClick={handleBtnOnClick}>Save changes</Button>
              :
              <Button className={!term || !definition ? "hidden": ""} type="button" onClick={handleBtnOnClick}>Confirm</Button>
            }
            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
