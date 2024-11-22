import { assign, createActor, createMachine, fromCallback } from "xstate";
import { createEvent, props } from "./create-event";

// const m = createMachine({
//   context: {
//     counter: 0,
//     counter2: 0,
//   },
//   initial: "idle",
//   states: {
//     idle: {
//       invoke: {
//         src: fromCallback(({ sendBack }) => {
//           return () => {};
//         }),
//       },
//       on: {
//         start: [
//           {
//             target: "running",
//           },
//         ],
//       },
//     },
//     running: {
//       on: {
//         stop: {
//           target: "idle",
//         },
//         INC: [
//           {
//             guard: ({ context }) => context.counter < 5,
//             actions: assign({
//               counter: ({ context }) => context.counter + 1,
//             }),
//           },
//           {
//             actions: assign({
//               counter2: ({ context }) => context.counter2 + 1,
//             }),
//           },
//         ],
//         DEC: {
//           actions: assign({
//             counter: ({ context }) => context.counter - 1,
//           }),
//         },
//       },
//     },
//   },
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
// });

// const a = createActor(m);

// a.subscribe((snapshot) => {
//   console.log(snapshot.context, snapshot.value);
// });

// a.start();

// a.send({ type: "start" });
// a.send({ type: "INC" });
// a.send({ type: "INC" });
// a.send({ type: "stop" });
// a.send({ type: "INC" });
// a.send({ type: "start" });
// a.send({ type: "INC" });
// a.send({ type: "stop" });

// enum IntervalMachineState {
//   IDLE = "idle",
//   RUNNING = "running",
//   DONE = "done",
// }

// TASK 1
// const intervalMachine = createMachine({
//   id: "interval",
//   initial: IntervalMachineState.IDLE,
//   context: {
//     counter: 0,
//   },
//   states: {
//     [IntervalMachineState.IDLE]: {
//       // initial: "one",
//       // states: {
//       //   one: {},
//       //   two: {},
//       // },
//       on: {
//         start: IntervalMachineState.RUNNING,
//         end: IntervalMachineState.DONE,
//       },
//     },
//     [IntervalMachineState.RUNNING]: {
//       invoke: {
//         src: fromCallback(({ sendBack }) => {
//           const id = setInterval(() => {
//             sendBack({ type: "TICK" });
//           });
//           return () => {
//             clearInterval(id);
//           };
//         }),
//       },
//       on: {
//         TICK: {
//           actions: assign({
//             counter: ({ context }) => context.counter + 1,
//           }),
//         },
//         stop: IntervalMachineState.IDLE,
//         end: IntervalMachineState.DONE,

//         // test: {
//         //   target: `#interval.${IntervalMachineState.IDLE}.two`,
//         // },
//       },
//     },
//     [IntervalMachineState.DONE]: {
//       type: "final",
//     },
//   },
// });
// const intervalActor = createActor(intervalMachine);
// intervalActor.subscribe(({ context, value }) => {
//   console.log(context, value);
// });
// intervalActor.start();

// intervalActor.send({ type: "start" });

// setTimeout(() => {
//   intervalActor.send({ type: "stop" });
// }, 5000);

// TASK 2
// - profileSetup:
//   - incomplete ("setup event" transitions to "complete")
//   - complete ("next" event transitions to "verification")
// - verification:
//   - unverified ("verify event" transitions to "verifying")
//   - verifying (on success transition to "verified" and failure to transition to "unverified")
//   - verified ("next" event transitions to "activation")
// - activated (final state)

enum ProfileWizardState {
  SETUP = "Setup",
  SETUP_INCOMPLETE = "Setup_incomplete",
  SETUP_COMPLETE = "Setup_complete",
  VERIFICATION = "Verification",
  VERIFICATION_UNVERIFIED = "Verification_unverified",
  VERIFICATION_VERIFYING = "Verification_verifying",
  VERIFICATION_VERIFIED = "Verification_verified",
  ACTIVATED = "Activated",
}

const next = createEvent("NEXT");
const complete = createEvent("COMPLETE");
const verify = createEvent("VERIFY");

const wizardMachine = createMachine({
  id: "wizard",
  initial: ProfileWizardState.SETUP,
  states: {
    [ProfileWizardState.SETUP]: {
      initial: ProfileWizardState.SETUP_INCOMPLETE,
      states: {
        [ProfileWizardState.SETUP_INCOMPLETE]: {
          on: {
            [complete.type]: {
              target: ProfileWizardState.SETUP_COMPLETE,
            },
          },
        },
        [ProfileWizardState.SETUP_COMPLETE]: {
          on: {
            [next.type]: {
              target: `#wizard.${ProfileWizardState.VERIFICATION}`,
            },
          },
        },
      },
    },
    [ProfileWizardState.VERIFICATION]: {
      initial: ProfileWizardState.VERIFICATION_UNVERIFIED,
      states: {
        [ProfileWizardState.VERIFICATION_UNVERIFIED]: {
          on: {
            [verify.type]: {
              target: ProfileWizardState.VERIFICATION_VERIFYING,
            },
          },
        },
        [ProfileWizardState.VERIFICATION_VERIFYING]: {},
        [ProfileWizardState.VERIFICATION_VERIFIED]: {
          on: {
            [next.type]: {
              target: `#wizard.${ProfileWizardState.ACTIVATED}`,
            },
          },
        },
      },
    },
    [ProfileWizardState.ACTIVATED]: {
      type: "final",
    },
  },
});
