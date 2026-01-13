import { FlashcardDialog } from "@/components/FlashcardComponents/FlashcardDialog";
import { DeckDropdown } from "@/components/DeckComponents/DeckDropdown";
import FlashcardComponent from "@/components/FlashcardComponents/FlashcardPreview";
import { Button } from "@/components/ui/button";
import CategoryDropdown from "@/components/DeckComponents/CategoryDropdown";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { addCard, changeVisibility, updateDeckCards } from "@/state/userDecks/userDecksSlice";
import type { CardInterface, DeckInterface } from "@/types";
import { LockKeyhole, Plus, UnlockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import { LearnDeckSettings } from "@/components/DeckComponents/LearnDeckSettings";
import { AlertComponent } from "@/components/ReusableComponents/Alert";
import axios from "axios";

export default function DeckDetails() {
  const dispatch = useAppDispatch();
  const query = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate()

  const [learnDeckSettings, setLearnDeckSettings] = useState(false)
  const [hasUnsavedChanges, setUnsavedChanges] = useState(false);
  const [isPublic, setPublic] = useState<boolean | null>(null)
  const [status, setStatus] = useState<"success" | "error" | null>(null)
  const [statusMsg, setStatusMsg] = useState<string>("");

  const userDeck = useAppSelector((state) => state.userDecks.decks.find(deck => deck._id === query.id));
  // the reference to all the user's decks narrwed down to the specific deck
  const [deck, setDeck] = useState<DeckInterface | undefined>(userDeck)

  const [isOwner, setIsOwner] = useState<boolean | null>(null)

  

  useEffect(() => {
    const fetchDeckDetails = async () => {
      if (userDeck) {
        //if user has the deck based on the query, just get it in the redux state
        setDeck(userDeck)
        setPublic(userDeck.public);
        setIsOwner(userDeck.authorID === user._id)
      } else {
        //if user doesnt have the deck, fetch it on the database
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/decks/deck/${query.id}`);
          setDeck(data)
          setPublic(data.public);
          setIsOwner(data.authorID === user._id)
      }
    }

    fetchDeckDetails()
    
  }, []);

  


  // prevents the users from going to a different page when the changes arent saved
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  //debounce for toggling visibility
  useEffect(() => {
    if (!deck || !deck._id) return;

    const debouncedToggle = debounce(() => {
      dispatch(changeVisibility({ _id: deck._id!, public: isPublic! }));
    }, 1000); // adjust delay as needed

    debouncedToggle();

    // Clean up to avoid memory leaks if component unmounts
    return () => {
      debouncedToggle.cancel?.();
    };
  }, [isPublic]);

  //autosave debounce so that it doesnt push everything on req write
  //prevent saving if the user does not own the deck
  useEffect(() => {
    if (!deck || !deck._id || isOwner === false || !userDeck) return;
    setUnsavedChanges(true);

    const debouncedToggle = debounce(() => {
      dispatch(updateDeckCards(userDeck))
      setDeck(userDeck)
      setUnsavedChanges(false);
      setStatus("success")
      setStatusMsg("Changes Saved")
      setTimeout(() => {
        setStatus(null)
      }, 1000);
    }, 1000)

    debouncedToggle()

    return () => {
      debouncedToggle.cancel?.();
    };
  }, [userDeck])

  const learnDeckHandler = () => {
    setLearnDeckSettings(true)
  }

  

  const confirmDeckSettingsHandler = (type: string) => {
    if (type == "learn") {
      navigate(`/learn/${deck?._id}`)
    } else {
      if(deck && deck?.cards.length >= 4) {
        navigate(`/quiz/${deck?._id}`)
      } else {
        setStatus("error")
        setStatusMsg("Atleast 4 cards is needed.")
        setTimeout(() => {
          setStatus(null)
        }, 3000);
      }
    }
  }

  const handleSubmit = (cardData: CardInterface) => {
    dispatch(addCard({ _id: deck?._id, cardData: cardData }));
  };

  return (
    <main className="h-[80%]">
    {status && <AlertComponent message={statusMsg} type={status}></AlertComponent>}
      {
        deck && (deck.public || isOwner) && 
        <header className="fixed top-[2rem] dark:bg-background bg-background w-full main-container !pt-[5rem] !pb-[1rem] !h-fit">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-md`} style={{backgroundColor: deck?.color}}></div>
              <div className="flex items-center min-w-[70vw] !max-w-[20vw] gap-2">
                <h1 className="text-2xl tracking-wide font-semibold truncate">
                  {deck?.title}
                </h1>
                {deck && <DeckDropdown deck={deck}></DeckDropdown>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 mt-5">
            <div className="max-w-8 max-h-8">
              {user.imageUrl && (
                <img className="rounded-full" src={user.imageUrl}></img>
              )}
            </div>
            <p>{isOwner ? user.username : deck.authorName}</p>
          </div>
          <div className="flex items-center gap-3 mb-3">
            {isOwner && <CategoryDropdown deck={deck} setDeck={setDeck} isOwner={isOwner} />}
          </div>
          <div className="flex items-center gap-2 my-8 flex-wrap">
              { deck.authorID === user._id && (
                <>
                  <Button
                    type="button" 
                    onClick={() => setPublic((prev) => !prev)}
                    variant={isPublic ? "outline": "default"}
                    className={isPublic ? "!bg-background hover:!bg-foreground hover:!text-background !border-foreground text-foreground": "bg-foreground text-background hover:!bg-foreground/90"}
                  >
                    {isPublic ? <UnlockKeyhole /> : <LockKeyhole />}

                    {isPublic ? "Public" : "Private"}
                  </Button>
                  <FlashcardDialog handleSubmit={handleSubmit}>
                    <Button type="button" variant={"default"}>
                      <Plus /> Add Card
                    </Button>
                  </FlashcardDialog>
                </>
                )}
              <Button onClick={learnDeckHandler}>Learn Deck</Button>
              <LearnDeckSettings title={deck.title} open={learnDeckSettings} onOpenChange={setLearnDeckSettings} desc={""} handleSubmit={confirmDeckSettingsHandler}></LearnDeckSettings>
            </div>
        </header>
      }

      {
        deck && ((isOwner == false && deck.public) || (isOwner == true))? 
        <section className="h-[80%] mt-[16rem] main-container">
          {!deck.cards || deck.cards.length === 0 ? (
            <article className="w-full h-[80%] items-center justify-center flex-col flex gap-5">
              <h1 className="font-semibold text-4xl text-center">
                { isOwner ? "Add a card to get started.": "This deck has no cards yet."}
              </h1>
            </article>
          ) : (
            <FlashcardComponent deck={deck} cards={deck.cards}></FlashcardComponent>
          )}
        </section> :
        <section className="h-[100%]">
          <article className="w-full h-[100%] items-center justify-center flex-col flex gap-5">
            <h1 className="font-semibold text-4xl">
              Deck not found or this deck is private. 
            </h1>
          </article>
        </section> 
      }
    </main>
  );
}
