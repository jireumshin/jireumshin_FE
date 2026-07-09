"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectors } from "@/stores";

export function useStore() {
  const dispatch = useDispatch();

  const exampleData = useSelector(selectors.getExampleData);
  const exampleLoading = useSelector(selectors.getExampleLoading);
  const exampleError = useSelector(selectors.getExampleError);

  return {
    exampleData,
    exampleLoading,
    exampleError,
    dispatch,
  };
}
