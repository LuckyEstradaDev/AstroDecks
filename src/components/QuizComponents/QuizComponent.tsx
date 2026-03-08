import _ from "lodash";
import { useEffect, useState } from "react";

export default function QuizComponent({question, index, length, choices, answer, handleScore}: {question: string, choices: string[], answer: string, index: number, length: number, handleScore: (isCorrect: boolean) => void}) {

  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]); 
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setCorrect] = useState<boolean | null>(null);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>();
  useEffect(() => {
    setShuffledChoices(_.shuffle([...choices, answer]))
  }, [index])

  return (
    <div className="w-full max-w-2xl">
      {/* Question Counter */}
      <div className="text-sm text-gray-500 mb-2">Question {index + 1} of {length}</div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-center mb-8">
        {question}
      </h2>

      {/* Answer Options */}
      <div className="space-y-3">
        {/* <button className="w-full p-4 text-left border-2 border-gray-300 rounded-lg transition-all duration-200 font-medium hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
          London
        </button>
        <button className="w-full p-4 text-left border-2 border-gray-300 rounded-lg transition-all duration-200 font-medium hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
          Paris
        </button>
        <button className="w-full p-4 text-left border-2 border-gray-300 rounded-lg transition-all duration-200 font-medium hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
          Berlin
        </button>
        <button className="w-full p-4 text-left border-2 border-gray-300 rounded-lg transition-all duration-200 font-medium hover:border-blue-500 hover:bg-blue-50 cursor-pointer">
          Madrid
        </button> */}

        {shuffledChoices.map((choice, i) => (
          <button
          key={i}
          disabled={isButtonDisabled}
          onClick={() => {
            setSelectedIndex(i)
            setButtonDisabled(true);
            if(choice == answer) {
              setCorrect(true);
              setTimeout(() => {
                setSelectedIndex(null)
                setButtonDisabled(false);
              }, 1000)
              handleScore(true)
            } else {
              setCorrect(false)
              setTimeout(() => {
                setSelectedIndex(null)
                setButtonDisabled(false);
              }, 1000)
              handleScore(false);
            }
          }}
            className={
              `w-full p-4 text-left border-2 hover:bg-foreground hover:text-background border-gray-300 rounded-lg transition-all duration-200 font-medium cursor-pointer
              ${selectedIndex === i && isCorrect && "bg-green-500 hover:bg-green-500 !text-foreground"}
              ${selectedIndex === i && !isCorrect && "bg-red-500 hover:bg-red-500 !text-foreground"}`
            }
          >
            {choice}
          </button>
        ))}

      </div>
    </div>
  );
}
