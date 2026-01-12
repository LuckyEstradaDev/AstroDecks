import { useState } from "react";

export default function Flashcard({front, back, definitionsFirst}: {front: string, back: string, definitionsFirst: boolean}) {
  const [isFlipped, setFlipped] = useState<boolean>(definitionsFirst === true && true)
  return (
    <div className="w-[100%] max-w-[40rem] h-[50vw] min-h-[15rem] max-h-[25rem] [perspective:800px]" onClick={() => setFlipped((prev) => back != "" && !prev)}>
      <div
        className={`${
          isFlipped ? "" : "[transform:rotateY(180deg)]"
        } [transform-style:preserve-3d] w-full h-full transition-transform duration-500 relative ${!back ? "": "cursor-pointer"}`}>

        <div className="absolute w-full h-full p-4 md:p-8 overflow-y-auto border-2 border-black text-black-200 bg-white dark:bg-foreground rounded-md shadow-md backface-hidden">
            <p className="!text-xl md:!text-2xl font-semibold whitespace-pre-line">{front}</p>
        </div>
        
        <div className="absolute [transform:rotateY(180deg)] p-4 md:p-8 overflow-y-auto  backface-hidden border-2 border-black text-black-200 bg-white dark:bg-foreground rounded-md shadow-md w-full h-full">
            <p className="!text-xl md:!text-2xl whitespace-pre-line">{back}</p>
        </div>
      </div>
    </div>
  );
}
