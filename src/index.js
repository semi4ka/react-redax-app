import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  completeTask,
  getTasks,
  getTasksLoadingStatus,
  taskDeleted,
  titleChanged,
  loadingTasks,
  createTask,
} from "./store/task";
import configureStore from "./store/store";
import { Provider, useSelector, useDispatch } from "react-redux";
import { getError } from "./store/error";

const store = configureStore();
const App = () => {
  const state = useSelector(getTasks());
  const isLoading = useSelector(getTasksLoadingStatus());
  const error = useSelector(getError());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingTasks());
  }, []);

  const handleChangeStatus = (taskId) => {
    dispatch(titleChanged(taskId));
  };
  const handleDelete = (taskId) => {
    dispatch(taskDeleted(taskId));
  };
  const handleCreate = () => {
    dispatch(createTask());
  };
  if (isLoading) {
    return <h1>is loading ...</h1>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <>
      <h1>App!</h1>
      <ul>
        {state.map((el) => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p>{`completed: ${el.completed}`}</p>
            <button onClick={() => dispatch(completeTask(el.id))}>
              Complete
            </button>
            <button onClick={() => handleChangeStatus(el.id)}>
              Change status
            </button>
            <button onClick={() => handleDelete(el.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
      <button onClick={() => handleCreate()}>Add task</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
