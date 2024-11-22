function props<T>(): T {
  return {} as T;
}

function createEvent<
  S extends string,
  T,
  R extends ReturnType<typeof props<T>> | void = void
>(type: S, eventProps?: R) {
  const creator = (payload: typeof eventProps) => ({
    type,
    payload,
  });

  creator.type = type;
  return creator;
}
