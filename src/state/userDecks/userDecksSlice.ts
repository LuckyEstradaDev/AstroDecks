import type { DeckInterface } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const pushDeck = createAsyncThunk(
  'userDecks/pushDeck',
  async (decksData: DeckInterface, thunkAPI) => {
    
    try {
       const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/decks`, decksData)
       return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const fetchDecks = createAsyncThunk(
  'userDecks/fetchDecks', 
  async (userID: string, thunkAPI) => {
    try {
      //the data is an array
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/decks/${userID}`)
      
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const renameDeck = createAsyncThunk(
  'userDecks/renameDeck',
  async(dataPayload: {newTitle: string, deck: DeckInterface}, thunkAPI) => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/api/decks/${dataPayload.deck._id}`, {title: dataPayload.newTitle})
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const deleteDeck = createAsyncThunk(
  'userDecks/deleteDeck',
  async (deckID: string, thunkAPI) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/decks/${deckID}`)
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const updateDeckCards = createAsyncThunk(
  'userDecks/updateDeckCards',
  async (dataPayload: DeckInterface, thunkAPI) => {

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/decks/${dataPayload._id}`, {cards: dataPayload.cards})
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const changeVisibility = createAsyncThunk(
  'userDecks/changeVisibility',
  async (data: {_id: string, public: boolean}, thunkAPI) => {

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/decks/${data._id}`, {public: data.public})
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const changeCategory = createAsyncThunk(
  'userDecks/changeCategory',
  async(data: {_id: string, category: string | null}, thunkAPI) => {
    try{
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/decks/${data._id}`, {category: data.category})
    } catch(error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

interface UserDecksState {
  decks: DeckInterface[];
  loading: boolean,
  error: null | string
}

const initialState: UserDecksState = {
  decks: [],
  loading: false,
  error: null as string | null,
};

const userDecksSlice = createSlice({
    name: "userDecks",
    initialState,
    reducers:{
      //add card to local state, not the db
      addCard: (state, action) => {
        //filter out the decks first then add it to its the cards array
        state.decks.filter(item => item._id == action.payload._id && item.cards.push(action.payload.cardData))
      },
      editCard: (state, action) => {
          const deck = state.decks.find(deck => deck._id === action.payload._id);
          if (!deck) return;

          const card = deck.cards.find(card => card._id === action.payload.cardData._id);
          if (!card) return;

          card.term = action.payload.cardData.term;
          card.definition = action.payload.cardData.definition;
      },
      deleteCard: (state, action) => {
        const deck = state.decks.find(deck => deck._id === action.payload._id)

        if (deck) {
          deck.cards = deck?.cards.filter(card => card._id !== action.payload.cardId )
        }
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(pushDeck.pending, (state) => {
          state.loading = true,
          state.error = null
        })
        .addCase(pushDeck.fulfilled, (state, action) => {
          const data = action.payload;
          state.loading = false;
          state.decks.unshift(data)
        })
        .addCase(pushDeck.rejected, (state, action) => {
          const data: any = action.payload
          state.loading = false,
          state.error = data.message as string
        })

        .addCase(fetchDecks.pending, (state) => {
          state.loading = true,
          state.error = null
        })
        .addCase(fetchDecks.fulfilled, (state, action) => {
          state.loading = false
          state.decks = action.payload
        })
        .addCase(fetchDecks.rejected, (state, action) => {
          const data: any = action.payload
          state.loading = false,
          state.error = data.message as string
        })

        .addCase(renameDeck.pending, (state) => {
          state.loading = true,
          state.error = null
        })
        .addCase(renameDeck.fulfilled, (state, action) => {
          state.loading = false
          const newDeck: DeckInterface[] = state.decks.map((item) => {
            if (item._id == action.payload._id) {
              return {...item, title: action.payload.title}
            } else {
              return item
            }
          })
          
          state.decks = newDeck
        })
        .addCase(renameDeck.rejected, (state, action) => {
          const data: any = action.payload
          state.loading = false,
          state.error = data.message as string
        })

        .addCase(deleteDeck.pending, (state) => {
          state.loading = true,
          state.error = null
        })
        .addCase(deleteDeck.fulfilled, (state, action) => {
          state.loading = false;
          state.decks = state.decks.filter(item => item._id !== action.payload);
        })
        .addCase(deleteDeck.rejected, (state, action) => {
          const data: any = action.payload
          state.loading = false,
          state.error = data.message as string
        })

        .addCase(updateDeckCards.pending, (state) => {
          state.loading = true,
          state.error = null
        })
        .addCase(updateDeckCards.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateDeckCards.rejected, (state, action) => {
          const data: any = action.payload
          state.loading = false,
          state.error = data.message as string
        })
        .addCase(changeCategory.pending, (state) => {
          state.loading = true,
          state.error = null
        }).addCase(changeCategory.fulfilled, (state) => {
          state.loading = false;
        }).addCase(changeCategory.rejected, (state, action) => {
          const data: any = action.payload
          state.loading = false,
          state.error = data.message as string
        })
    }
})

export const { addCard, editCard, deleteCard } = userDecksSlice.actions

export default userDecksSlice.reducer