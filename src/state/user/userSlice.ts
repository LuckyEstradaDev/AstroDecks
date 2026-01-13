import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_id, thunkAPI) => {
    try {

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {_id});
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const storeCategory = createAsyncThunk(
  "user/storeCategory",
  async(dataPayload: any, thunkAPI) => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${dataPayload._id}`, {categories: dataPayload.categories});
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

interface initialStateInterface {
    _id: string,
    username: string,
    imageUrl: string,
    categories: string[],
    loading: boolean,
    error: null | string
}

const initialState: initialStateInterface = {
  _id: "",
  username: "",
  imageUrl: "",
  categories: [],
  loading: false,
  error: null as string | null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const data = action.payload;
        state.loading = false;
        state._id = data._id;
        state.username = data.username;
        state.imageUrl = data.imageUrl
        state.categories = data.categories
      })
      .addCase(fetchUser.rejected, (state, action) => {
        const data: any = action.payload
        state.loading = false;
        state.error = data.message as string;
      })
      .addCase(storeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeCategory.fulfilled, (state, action) => {
        const data = action.payload
        state.loading = false;
        state.categories = data.categories
      })
      .addCase(storeCategory.rejected, (state, action) => {
        const data: any = action.payload
        state.loading = false
        state.error = data.message as string;
      })
  },
});

export default userSlice.reducer;
