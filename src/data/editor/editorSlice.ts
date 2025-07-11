import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface EditorState {
  currentStageId?: string;
}

// This state does not persist when you close and reopen the window.
const editorSlice = createSlice({
  name: "editor",
  initialState: {} as EditorState,
  reducers: {
    setCurrentEditorStageId(state, action: PayloadAction<string | undefined>) {
      state.currentStageId = action.payload;
    },
  },
});

export const { setCurrentEditorStageId } = editorSlice.actions;
export default editorSlice.reducer;

export const editorRootSelector = (state: RootState) => state.editor;
