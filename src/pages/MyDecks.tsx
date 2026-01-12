import AppDialog from "@/components/ReusableComponents/AppInputDialog";
import Deck from "@/components/DeckComponents/Deck";
import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchDecks, pushDeck } from "@/state/userDecks/userDecksSlice";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function MyDecks() {

  const [open, onOpenChange] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const decks = useAppSelector(state => state.userDecks)
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState<string>("Untitled")
  const DECKS_LIMIT = 10
  const [showAll, setShowAll] = useState<boolean>(false)

  useEffect(() => {
    if (!user._id) return
    dispatch(fetchDecks(user._id))
  }, [user._id])

  const AppDialogFields = [
    {
      label: "Title",
      value: title,
      mutator: setTitle
    },
  ]

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const data = {title, authorID: user._id, public: true, color: "#bfdbfe", cards: [], category: null}
    dispatch(pushDeck(data))
    setTitle("Untitled")
    onOpenChange(false)
  };

  return (
    <>
      <main className="main-container">
        <section className="w-full mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AppDialog handleSubmit={handleSubmit} dialogTitle={"Create Deck"} inputFields={AppDialogFields} open={open} onOpenChange={onOpenChange}>
              <Button
                type="button"
                variant={"default"}
                className="font-semibold dark:text-foreground"
              >
                <span className="flex items-center justify-center gap-1">
                  <Plus /> Create Deck
                </span>
              </Button>
            </AppDialog>
          </div>
          
          {/* <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search decks..."
              className="pl-10 !border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
        </section>

        <section className="w-full mb-4 flex items-center justify-between h-fit">
          <div><p className="font-medium !text-2xl">Recent Decks</p></div>
          <Button
            variant="outline"
            className="font-medium"
            onClick={() => setShowAll((s) => !s)}
            aria-expanded={showAll}
          >
            {showAll ? "See Less" : "See More"}
          </Button>
        </section>

        <section className="w-full">
          {showAll ? (
            <section className="py-3 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(250px,17rem))] gap-7">
              {decks?.decks.map((data: any) => (
                <Deck key={data._id} deck={data} />
              ))}
            </section>
          ) : (
            <section className="max-w-screen">
              <Carousel
                opts={{
                  dragFree: true,
                }}
              >
                <CarouselContent className="max-w-3xl snap-none py-3">
                  {(() => {
                    const all = decks?.decks || [];
                    const shown = all.slice(0, DECKS_LIMIT);
                    return shown.map((data: any) => (
                      <CarouselItem key={data._id} className="min-w-[250px] max-w-[250px]">
                        <Deck deck={data} />
                      </CarouselItem>
                    ));
                  })()}
                </CarouselContent>
              </Carousel>
            </section>
          )}
        </section>

        <section className="w-full mt-10 pt-6 ">
          <div><p className="font-medium !text-2xl mb-6">Categories</p></div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="font-medium"
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "math" ? "default" : "outline"}
              onClick={() => setSelectedCategory("math")}
              className="font-medium"
            >
              Math
            </Button>
            <Button
              variant={selectedCategory === "science" ? "default" : "outline"}
              onClick={() => setSelectedCategory("science")}
              className="font-medium"
            >
              Science
            </Button>
            <Button
              variant={selectedCategory === "languages" ? "default" : "outline"}
              onClick={() => setSelectedCategory("languages")}
              className="font-medium"
            >
              Languages
            </Button>
            <Button
              variant={selectedCategory === "history" ? "default" : "outline"}
              onClick={() => setSelectedCategory("history")}
              className="font-medium"
            >
              History
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
