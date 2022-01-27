import { createSlice } from "@reduxjs/toolkit";
import todoService from "../services/todos.service";
import { setError } from "./error";

const initialState = {
  entities: [],
  isLoading: true,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    recived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities.splice(elementIndex, 1);
    },
    taskRequested(state) {
      state.isLoading = true;
    },
    taskRequestFailed(state) {
      state.isLoading = false;
    },
    create(state, action) {
      state.entities.push(action.payload);
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, recived, taskRequested, taskRequestFailed, create } =
  actions;

export const loadingTasks = () => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todoService.fetch();
    dispatch(recived(data));
  } catch (error) {
    dispatch(taskRequestFailed());
    dispatch(setError(error.message));
  }
};

export const createTask = () => async (dispatch, getState) => {
  try {
    const { tasks } = getState();
    const data = await todoService.create({
      title: `title task ${tasks.entities.length + 1}`,
      completed: false,
    });
    dispatch(create(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id, completed: true }));
};

export function titleChanged(id) {
  return update({ id, title: `New title for ${id}` });
}

export function taskDeleted(id) {
  return remove({ id });
}

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;
