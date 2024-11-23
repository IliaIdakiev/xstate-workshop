export function props<T>(): T {
  return {} as T;
}

export function createEvent<
  S extends string,
  T,
  R extends ReturnType<typeof props<T>> | void = void
>(type: S, eventProps?: R) {
  const creator = (payload: R extends void ? void : R) => ({
    type,
    payload,
  });

  creator.type = type;
  return creator;
}
