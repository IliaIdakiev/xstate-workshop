import {
  assign,
  createActor,
  createMachine,
  DoneActorEvent,
  fromCallback,
  fromPromise,
} from "xstate";
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

function getServerCode() {
  return new Promise((res) => {
    setTimeout(() => res(123), 3000);
  });
}

function verificationCheck(result: boolean) {
  return new Promise((res) => {
    setTimeout(() => res(result), 3000);
  });
}

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

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const next = createEvent("NEXT");
const complete = createEvent("COMPLETE", props<Partial<UserData>>());
const verify = createEvent("VERIFY", props<{ code: number }>());

type MachineEvents =
  | ReturnType<typeof next>
  | ReturnType<typeof complete>
  | ReturnType<typeof verify>
  | DoneActorEvent<number, any>;

type WizardMachineTypes = {
  context: {
    userData: Partial<UserData> | null;
    userCode: number | null;
    serverCode: number | null;
  };
  events: MachineEvents;
  actions:
    | { type: "handleSetup" }
    | { type: "setServerCode" }
    | { type: "setUserCode" };
  guards: { type: "setupHasAllInfo" } | { type: "verifyHasAllCodes" };
};

const wizardMachine = createMachine(
  {
    id: "wizard",
    initial: ProfileWizardState.SETUP,
    types: {} as WizardMachineTypes,
    context: {
      userData: null,
      userCode: null,
      serverCode: null,
    },
    states: {
      [ProfileWizardState.SETUP]: {
        initial: ProfileWizardState.SETUP_INCOMPLETE,
        states: {
          [ProfileWizardState.SETUP_INCOMPLETE]: {
            on: {
              [complete.type]: [
                {
                  target: ProfileWizardState.SETUP_COMPLETE,
                  guard: "setupHasAllInfo",
                  actions: ["handleSetup"],
                },
                {
                  actions: ["handleSetup"],
                },
              ],
              // "*": {
              //   actions: [
              //     () => {
              //       console.log("ERROR");
              //     },
              //   ],
              // },
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
        invoke: {
          src: fromPromise(() => getServerCode()),
          onDone: [
            {
              target: `#wizard.${ProfileWizardState.VERIFICATION}.${ProfileWizardState.VERIFICATION_VERIFYING}`,
              guard: "verifyHasAllCodes",
              actions: ["setServerCode"],
            },
            {
              actions: ["setServerCode"],
            },
          ],
        },
        states: {
          [ProfileWizardState.VERIFICATION_UNVERIFIED]: {
            on: {
              [verify.type]: [
                {
                  target: ProfileWizardState.VERIFICATION_VERIFYING,
                  guard: "verifyHasAllCodes",
                  actions: "setUserCode",
                },
                {
                  actions: "setUserCode",
                },
              ],
            },
          },
          [ProfileWizardState.VERIFICATION_VERIFYING]: {
            invoke: {
              src: fromPromise(() => verificationCheck(true)),
              onDone: [
                {
                  guard: ({ event }) => event.output,
                  target: ProfileWizardState.VERIFICATION_VERIFIED,
                },
                {
                  target: ProfileWizardState.VERIFICATION_UNVERIFIED,
                },
              ],
            },
          },
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
  },
  {
    actions: {
      handleSetup: assign({
        userData: ({ context: { userData }, event }) => {
          if (event.type !== complete.type) return userData;
          const { payload } = event;
          const currentUserData = userData || {};
          return { ...currentUserData, ...payload };
        },
      }),
      setServerCode: assign({
        serverCode: ({ event, context }) => {
          if (!("output" in event)) return context.serverCode;
          return event.output;
        },
      }),
      setUserCode: assign({
        userCode: ({ event, context }) => {
          if (event.type !== verify.type || !event.payload?.code)
            return context.userCode;
          return event.payload.code;
        },
      }),
    },
    guards: {
      setupHasAllInfo: ({ context: { userData }, event }) => {
        const { payload } = "payload" in event ? event : {};
        const { password, firstName, lastName, email } = {
          ...(userData || {}),
          ...payload,
        };
        return !!password && !!firstName && !!lastName && !!email;
      },
      verifyHasAllCodes: ({ context, event }) => {
        // Handle the fromPromise event
        if ("output" in event) return !!event.output && !!context.userCode;
        // Handle the verify event
        if (event.type === verify.type)
          return !!context.serverCode && !!event.payload?.code;
        // Handle all other events
        return !!context.serverCode && !!context.userCode;
      },
    },
  }
);

const actor = createActor(wizardMachine);
actor.subscribe(({ context, value }) => console.log(value, context));
actor.start();

actor.send(complete({ firstName: "Ivan", lastName: "Ivanov" }));
// actor.send(next());
actor.send(complete({ password: "123" }));
actor.send(complete({ email: "ivan.ivanov@gmail.com" }));
actor.send(next());

actor.send(verify({ code: 123 }));
actor.send(next());
