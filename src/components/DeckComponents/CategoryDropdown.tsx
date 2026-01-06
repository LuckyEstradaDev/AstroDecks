import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2 } from "lucide-react";
import type { DeckInterface } from "@/types";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { changeCategory } from "@/state/userDecks/userDecksSlice";

type Props = {
  deck?: DeckInterface;
  setDeck: React.Dispatch<React.SetStateAction<DeckInterface | undefined>>;
  setUnsavedChanges: (b: boolean) => void;
  isOwner?: boolean | null;
};

export default function CategoryDropdown({
  deck,
  setDeck,
  setUnsavedChanges,
}: Props) {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<string[]>([
    "General",
    "Science",
    "Math",
    "History",
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if(!deck) return
    setSelectedCategory(deck.category || null);
  }, [deck]);

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    if (!categories.includes(trimmed)) {
      setCategories((p) => [trimmed, ...p]);
    }

    setSelectedCategory(trimmed);
    setDeck((prev) => (prev ? { ...prev, category: trimmed } : prev));

    setNewCategory("");
    setAddingCategory(false);
    setUnsavedChanges(true);
  };

  const handleDeleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));

    if (selectedCategory === cat) {
      setSelectedCategory(null);
      setDeck((prev) =>
        prev ? { ...prev, category: null } : prev
      );
    }

    setUnsavedChanges(true);
  };

  const handleSetSelectedCategory = (category: string) => { // sets a category to the deck
    setSelectedCategory(category)
    dispatch(changeCategory({ _id: deck?._id!, category: category }))
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit justify-between">
            <span className="truncate">
              {selectedCategory ?? "Uncategorized"}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[260px]"
          onKeyDownCapture={(e) => {
            // Capture phase prevents Radix's internal "type-to-select" behavior
            const k = e.key;
            if (k && k.length === 1 && /[a-zA-Z0-9]/.test(k)) {
              const target = e.target as HTMLElement | null;
              const tag = target?.tagName ?? "";
              if (tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }}
        >
          <DropdownMenuLabel>Choose category</DropdownMenuLabel>

          {categories.map((c) => (
            <div key={c} className="flex items-center justify-between">
              <DropdownMenuItem
                className="flex-1 truncate"
                onSelect={() => {
                  handleSetSelectedCategory(c);
                  setDeck((prev) => (prev ? { ...prev, category: c } : prev));
                  setUnsavedChanges(true);
                }}
              >
                {c}
              </DropdownMenuItem>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteCategory(c);
                }}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-r-md cursor-pointer"
                aria-label={`Delete ${c}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <DropdownMenuSeparator />

          {addingCategory ? (
            <div className="flex items-center gap-2 py-2 px-1">
              <input
                className="px-2 py-1 rounded-md max-w-[70%] bg-transparent border-2"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          ) : (
            <DropdownMenuItem onSelect={(e) => {e.preventDefault(); setAddingCategory(true)}}>
              <Plus className="mr-2 size-4" />
              Add Category
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
