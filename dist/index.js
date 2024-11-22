"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstate_1 = require("xstate");
const create_event_1 = require("./create-event");
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
function getCode() {
    return new Promise((res) => {
        setTimeout(() => res(123), 3000);
    });
}
function verificationCheck(result) {
    return new Promise((res) => {
        setTimeout(() => res(result), 3000);
    });
}
var ProfileWizardState;
(function (ProfileWizardState) {
    ProfileWizardState["SETUP"] = "Setup";
    ProfileWizardState["SETUP_INCOMPLETE"] = "Setup_incomplete";
    ProfileWizardState["SETUP_COMPLETE"] = "Setup_complete";
    ProfileWizardState["VERIFICATION"] = "Verification";
    ProfileWizardState["VERIFICATION_UNVERIFIED"] = "Verification_unverified";
    ProfileWizardState["VERIFICATION_VERIFYING"] = "Verification_verifying";
    ProfileWizardState["VERIFICATION_VERIFIED"] = "Verification_verified";
    ProfileWizardState["ACTIVATED"] = "Activated";
})(ProfileWizardState || (ProfileWizardState = {}));
const next = (0, create_event_1.createEvent)("NEXT");
const complete = (0, create_event_1.createEvent)("COMPLETE", (0, create_event_1.props)());
const verify = (0, create_event_1.createEvent)("VERIFY", (0, create_event_1.props)());
const wizardMachine = (0, xstate_1.createMachine)({
    id: "wizard",
    initial: ProfileWizardState.SETUP,
    types: {},
    context: {
        userData: null,
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
                        "*": {
                            actions: [
                                () => {
                                    console.log("ERROR");
                                },
                            ],
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
}, {
    actions: {
        handleSetup: (0, xstate_1.assign)({
            userData: ({ context: { userData }, event }) => {
                const { payload } = event;
                const currentUserData = userData || {};
                return Object.assign(Object.assign({}, currentUserData), payload);
            },
        }),
    },
    guards: {
        setupHasAllInfo: ({ context: { userData }, event }) => {
            const { payload } = event;
            const { password, firstName, lastName, email } = Object.assign(Object.assign({}, (userData || {})), payload);
            return !!password && !!firstName && !!lastName && !!email;
        },
    },
});
const actor = (0, xstate_1.createActor)(wizardMachine);
actor.subscribe(({ context, value }) => console.log(value, context));
actor.start();
actor.send(complete({ firstName: "Ivan", lastName: "Ivanov" }));
actor.send(next());
actor.send(complete({ password: "123" }));
actor.send(complete({ email: "ivan.ivanov@gmail.com" }));
actor.send(next());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBMEU7QUFDMUUsaURBQW9EO0FBRXBELDRCQUE0QjtBQUM1QixlQUFlO0FBQ2Ysa0JBQWtCO0FBQ2xCLG1CQUFtQjtBQUNuQixPQUFPO0FBQ1AscUJBQXFCO0FBQ3JCLGNBQWM7QUFDZCxjQUFjO0FBQ2Qsa0JBQWtCO0FBQ2xCLGdEQUFnRDtBQUNoRCw2QkFBNkI7QUFDN0IsY0FBYztBQUNkLFdBQVc7QUFDWCxjQUFjO0FBQ2QsbUJBQW1CO0FBQ25CLGNBQWM7QUFDZCxpQ0FBaUM7QUFDakMsZUFBZTtBQUNmLGFBQWE7QUFDYixXQUFXO0FBQ1gsU0FBUztBQUNULGlCQUFpQjtBQUNqQixjQUFjO0FBQ2Qsa0JBQWtCO0FBQ2xCLDRCQUE0QjtBQUM1QixhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLGNBQWM7QUFDZCwyREFBMkQ7QUFDM0QsZ0NBQWdDO0FBQ2hDLCtEQUErRDtBQUMvRCxrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLGNBQWM7QUFDZCxnQ0FBZ0M7QUFDaEMsaUVBQWlFO0FBQ2pFLGtCQUFrQjtBQUNsQixlQUFlO0FBQ2YsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQiw4QkFBOEI7QUFDOUIsNkRBQTZEO0FBQzdELGdCQUFnQjtBQUNoQixhQUFhO0FBQ2IsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1AsUUFBUTtBQUNSLFdBQVc7QUFDWCx3QkFBd0I7QUFDeEIsdURBQXVEO0FBQ3ZELFVBQVU7QUFDVixPQUFPO0FBQ1AsV0FBVztBQUNYLHdCQUF3QjtBQUN4Qix1REFBdUQ7QUFDdkQsVUFBVTtBQUNWLE9BQU87QUFDUCxLQUFLO0FBQ0wsTUFBTTtBQUVOLDRCQUE0QjtBQUU1Qiw4QkFBOEI7QUFDOUIsbURBQW1EO0FBQ25ELE1BQU07QUFFTixhQUFhO0FBRWIsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMz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