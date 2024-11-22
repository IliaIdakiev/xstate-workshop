import { assign, createActor, createMachine } from "xstate";

const m = createMachine({
  context: {
    counter: 0,
    counter2: 0,
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        start: {
          target: "running",
        },
      },
    },
    running: {
      on: {
        stop: {
          target: "idle",
        },
        INC: [
          {
            guard: ({ context }) => context.counter < 5,
            actions: assign({
              counter: ({ context }) => context.counter + 1,
            }),
          },
          {
            actions: assign({
              counter: ({ context }) => context.counter2 + 1,
            }),
          },
        ],
        DEC: {
          actions: assign({
            counter: ({ context }) => context.counter - 1,
          }),
        },
      },
    },
  },
  // on: {
  //   INC: {
  //     actions: assign({
  //       counter: ({ context }) => context.counter + 1,
  //     }),
  //   },
  //   DEC: {
  //     actions: assign({
  //       counter: ({ context }) => context.counter - 1,
  //     }),
  //   },
  // },
});

const a = createActor(m);

a.subscribe((snapshot) => {
  console.log(snapshot.context, snapshot.value);
});

a.start();

a.send({ type: "start" });
a.send({ type: "INC" });
a.send({ type: "INC" });
a.send({ type: "stop" });
a.send({ type: "INC" });
a.send({ type: "start" });
a.send({ type: "INC" });
a.send({ type: "stop" });
