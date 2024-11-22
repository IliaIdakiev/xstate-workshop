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
function getServerCode() {
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
                src: (0, xstate_1.fromPromise)(() => getServerCode()),
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
                        src: (0, xstate_1.fromPromise)(() => verificationCheck(true)),
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
}, {
    actions: {
        handleSetup: (0, xstate_1.assign)({
            userData: ({ context: { userData }, event }) => {
                if (event.type !== complete.type)
                    return userData;
                const { payload } = event;
                const currentUserData = userData || {};
                return Object.assign(Object.assign({}, currentUserData), payload);
            },
        }),
        setServerCode: (0, xstate_1.assign)({
            serverCode: ({ event, context }) => {
                if (!("output" in event))
                    return context.serverCode;
                return event.output;
            },
        }),
        setUserCode: (0, xstate_1.assign)({
            userCode: ({ event, context }) => {
                var _a;
                if (event.type !== verify.type || !((_a = event.payload) === null || _a === void 0 ? void 0 : _a.code))
                    return context.userCode;
                return event.payload.code;
            },
        }),
    },
    guards: {
        setupHasAllInfo: ({ context: { userData }, event }) => {
            const { payload } = "payload" in event ? event : {};
            const { password, firstName, lastName, email } = Object.assign(Object.assign({}, (userData || {})), payload);
            return !!password && !!firstName && !!lastName && !!email;
        },
        verifyHasAllCodes: ({ context, event }) => {
            var _a;
            // Handle the fromPromise event
            if ("output" in event)
                return !!event.output && !!context.userCode;
            // Handle the verify event
            if (event.type === verify.type)
                return !!context.serverCode && !!((_a = event.payload) === null || _a === void 0 ? void 0 : _a.code);
            // Handle all other events
            return !!context.serverCode && !!context.userCode;
        },
    },
});
const actor = (0, xstate_1.createActor)(wizardMachine);
actor.subscribe(({ context, value }) => console.log(value, context));
actor.start();
actor.send(complete({ firstName: "Ivan", lastName: "Ivanov" }));
// actor.send(next());
actor.send(complete({ password: "123" }));
actor.send(complete({ email: "ivan.ivanov@gmail.com" }));
actor.send(next());
actor.send(verify({ code: 123 }));
actor.send(next());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FPZ0I7QUFDaEIsaURBQW9EO0FBRXBELDRCQUE0QjtBQUM1QixlQUFlO0FBQ2Ysa0JBQWtCO0FBQ2xCLG1CQUFtQjtBQUNuQixPQUFPO0FBQ1AscUJBQXFCO0FBQ3JCLGNBQWM7QUFDZCxjQUFjO0FBQ2Qsa0JBQWtCO0FBQ2xCLGdEQUFnRDtBQUNoRCw2QkFBNkI7QUFDN0IsY0FBYztBQUNkLFdBQVc7QUFDWCxjQUFjO0FBQ2QsbUJBQW1CO0FBQ25CLGNBQWM7QUFDZCxpQ0FBaUM7QUFDakMsZUFBZTtBQUNmLGFBQWE7QUFDYixXQUFXO0FBQ1gsU0FBUztBQUNULGlCQUFpQjtBQUNqQixjQUFjO0FBQ2Qsa0JBQWtCO0FBQ2xCLDRCQUE0QjtBQUM1QixhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLGNBQWM7QUFDZCwyREFBMkQ7QUFDM0QsZ0NBQWdDO0FBQ2hDLCtEQUErRDtBQUMvRCxrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLGNBQWM7QUFDZCxnQ0FBZ0M7QUFDaEMsaUVBQWlFO0FBQ2pFLGtCQUFrQjtBQUNsQixlQUFlO0FBQ2YsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQiw4QkFBOEI7QUFDOUIsNkRBQTZEO0FBQzdELGdCQUFnQjtBQUNoQixhQUFhO0FBQ2IsV0FBVztBQUNYLFNBQVM7QUFDVCxPQUFPO0FBQ1AsUUFBUTtBQUNSLFdBQVc7QUFDWCx3QkFBd0I7QUFDeEIsdURBQXVEO0FBQ3ZELFVBQVU7QUFDVixPQUFPO0FBQ1AsV0FBVztBQUNYLHdCQUF3QjtBQUN4Qix1REFBdUQ7QUFDdkQsVUFBVTtBQUNWLE9BQU87QUFDUCxLQUFLO0FBQ0wsTUFBTTtBQUVOLDRCQUE0QjtBQUU1Qiw4QkFBOEI7QUFDOUIsbURBQW1EO0FBQ25ELE1BQU07QUFFTixhQUFhO0FBRWIsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMz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