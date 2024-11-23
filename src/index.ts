import {
  ActorRefFrom,
  AnyActorRef,
  assign,
  createActor,
  createMachine,
  DoneActorEvent,
  enqueueActions,
  ErrorActorEvent,
  fromCallback,
  fromPromise,
} from "xstate";
import { createEvent, props } from "./create-event";

// // const m = createMachine({
// //   context: {
// //     counter: 0,
// //     counter2: 0,
// //   },
// //   initial: "idle",
// //   states: {
// //     idle: {
// //       invoke: {
// //         src: fromCallback(({ sendBack }) => {
// //           return () => {};
// //         }),
// //       },
// //       on: {
// //         start: [
// //           {
// //             target: "running",
// //           },
// //         ],
// //       },
// //     },
// //     running: {
// //       on: {
// //         stop: {
// //           target: "idle",
// //         },
// //         INC: [
// //           {
// //             guard: ({ context }) => context.counter < 5,
// //             actions: assign({
// //               counter: ({ context }) => context.counter + 1,
// //             }),
// //           },
// //           {
// //             actions: assign({
// //               counter2: ({ context }) => context.counter2 + 1,
// //             }),
// //           },
// //         ],
// //         DEC: {
// //           actions: assign({
// //             counter: ({ context }) => context.counter - 1,
// //           }),
// //         },
// //       },
// //     },
// //   },
// // on: {
// //   INC: {
// //     actions: assign({
// //       counter: ({ context }) => context.counter + 1,
// //     }),
// //   },
// //   DEC: {
// //     actions: assign({
// //       counter: ({ context }) => context.counter - 1,
// //     }),
// //   },
// // },
// // });

// // const a = createActor(m);

// // a.subscribe((snapshot) => {
// //   console.log(snapshot.context, snapshot.value);
// // });

// // a.start();

// // a.send({ type: "start" });
// // a.send({ type: "INC" });
// // a.send({ type: "INC" });
// // a.send({ type: "stop" });
// // a.send({ type: "INC" });
// // a.send({ type: "start" });
// // a.send({ type: "INC" });
// // a.send({ type: "stop" });

// // enum IntervalMachineState {
// //   IDLE = "idle",
// //   RUNNING = "running",
// //   DONE = "done",
// // }

// // TASK 1
// // const intervalMachine = createMachine({
// //   id: "interval",
// //   initial: IntervalMachineState.IDLE,
// //   context: {
// //     counter: 0,
// //   },
// //   states: {
// //     [IntervalMachineState.IDLE]: {
// //       // initial: "one",
// //       // states: {
// //       //   one: {},
// //       //   two: {},
// //       // },
// //       on: {
// //         start: IntervalMachineState.RUNNING,
// //         end: IntervalMachineState.DONE,
// //       },
// //     },
// //     [IntervalMachineState.RUNNING]: {
// //       invoke: {
// //         src: fromCallback(({ sendBack }) => {
// //           const id = setInterval(() => {
// //             sendBack({ type: "TICK" });
// //           });
// //           return () => {
// //             clearInterval(id);
// //           };
// //         }),
// //       },
// //       on: {
// //         TICK: {
// //           actions: assign({
// //             counter: ({ context }) => context.counter + 1,
// //           }),
// //         },
// //         stop: IntervalMachineState.IDLE,
// //         end: IntervalMachineState.DONE,

// //         // test: {
// //         //   target: `#interval.${IntervalMachineState.IDLE}.two`,
// //         // },
// //       },
// //     },
// //     [IntervalMachineState.DONE]: {
// //       type: "final",
// //     },
// //   },
// // });
// // const intervalActor = createActor(intervalMachine);
// // intervalActor.subscribe(({ context, value }) => {
// //   console.log(context, value);
// // });
// // intervalActor.start();

// // intervalActor.send({ type: "start" });

// // setTimeout(() => {
// //   intervalActor.send({ type: "stop" });
// // }, 5000);

// // TASK 2
// // - profileSetup:
// //   - incomplete ("setup event" transitions to "complete")
// //   - complete ("next" event transitions to "verification")
// // - verification:
// //   - unverified ("verify event" transitions to "verifying")
// //   - verifying (on success transition to "verified" and failure to transition to "unverified")
// //   - verified ("next" event transitions to "activation")
// // - activated (final state)

// // function getServerCode() {
// //   return new Promise((res) => {
// //     setTimeout(() => res(123), 3000);
// //   });
// // }

// // function verificationCheck(result: boolean) {
// //   return new Promise((res) => {
// //     setTimeout(() => res(result), 3000);
// //   });
// // }

// // enum ProfileWizardState {
// //   SETUP = "Setup",
// //   SETUP_INCOMPLETE = "Setup_incomplete",
// //   SETUP_COMPLETE = "Setup_complete",
// //   VERIFICATION = "Verification",
// //   VERIFICATION_UNVERIFIED = "Verification_unverified",
// //   VERIFICATION_VERIFYING = "Verification_verifying",
// //   VERIFICATION_VERIFIED = "Verification_verified",
// //   ACTIVATED = "Activated",
// // }

// // interface UserData {
// //   email: string;
// //   firstName: string;
// //   lastName: string;
// //   password: string;
// // }

// // const next = createEvent("NEXT");
// // const complete = createEvent("COMPLETE", props<Partial<UserData>>());
// // const verify = createEvent("VERIFY", props<{ code: number }>());

// // type MachineEvents =
// //   | ReturnType<typeof next>
// //   | ReturnType<typeof complete>
// //   | ReturnType<typeof verify>
// //   | DoneActorEvent<number, any>;

// // type WizardMachineTypes = {
// //   input: {
// //     parentActorRef: any; //ActorRefFrom<typeof myMachine>
// //   };
// //   context: {
// //     userData: Partial<UserData> | null;
// //     userCode: number | null;
// //     serverCode: number | null;
// //     parentActorRef: any; //ActorRefFrom<typeof myMachine>
// //   };
// //   events: MachineEvents;
// //   actions:
// //     | { type: "handleSetup" }
// //     | { type: "setServerCode" }
// //     | { type: "setUserCode" };
// //   guards: { type: "setupHasAllInfo" } | { type: "verifyHasAllCodes" };
// // };

// // const wizardMachine = createMachine(
// //   {
// //     id: "wizard",
// //     initial: ProfileWizardState.SETUP,
// //     types: {} as WizardMachineTypes,
// //     context: ({ input: { parentActorRef } }) => {
// //       return {
// //         userData: null,
// //         userCode: null,
// //         serverCode: null,
// //         parentActorRef,
// //       };
// //     },
// //     states: {
// //       [ProfileWizardState.SETUP]: {
// //         initial: ProfileWizardState.SETUP_INCOMPLETE,
// //         states: {
// //           [ProfileWizardState.SETUP_INCOMPLETE]: {
// //             on: {
// //               [complete.type]: [
// //                 {
// //                   target: ProfileWizardState.SETUP_COMPLETE,
// //                   guard: "setupHasAllInfo",
// //                   actions: ["handleSetup"],
// //                 },
// //                 {
// //                   actions: ["handleSetup"],
// //                 },
// //               ],
// //               // "*": {
// //               //   actions: [
// //               //     () => {
// //               //       console.log("ERROR");
// //               //     },
// //               //   ],
// //               // },
// //             },
// //           },
// //           [ProfileWizardState.SETUP_COMPLETE]: {
// //             on: {
// //               [next.type]: {
// //                 target: `#wizard.${ProfileWizardState.VERIFICATION}`,
// //               },
// //             },
// //           },
// //         },
// //       },
// //       [ProfileWizardState.VERIFICATION]: {
// //         initial: ProfileWizardState.VERIFICATION_UNVERIFIED,
// //         invoke: {
// //           src: fromPromise(({ input }) => getServerCode()),
// //           input: ({ context }) => context,
// //           onDone: [
// //             {
// //               target: `#wizard.${ProfileWizardState.VERIFICATION}.${ProfileWizardState.VERIFICATION_VERIFYING}`,
// //               guard: "verifyHasAllCodes",
// //               actions: ["setServerCode"],
// //             },
// //             {
// //               actions: ["setServerCode"],
// //             },
// //           ],
// //         },
// //         states: {
// //           [ProfileWizardState.VERIFICATION_UNVERIFIED]: {
// //             on: {
// //               [verify.type]: [
// //                 {
// //                   target: ProfileWizardState.VERIFICATION_VERIFYING,
// //                   guard: "verifyHasAllCodes",
// //                   actions: "setUserCode",
// //                 },
// //                 {
// //                   actions: "setUserCode",
// //                 },
// //               ],
// //             },
// //           },
// //           [ProfileWizardState.VERIFICATION_VERIFYING]: {
// //             invoke: {
// //               src: fromPromise(() => verificationCheck(true)),
// //               onDone: [
// //                 {
// //                   guard: ({ event }) => event.output,
// //                   target: ProfileWizardState.VERIFICATION_VERIFIED,
// //                 },
// //                 {
// //                   target: ProfileWizardState.VERIFICATION_UNVERIFIED,
// //                 },
// //               ],
// //             },
// //           },
// //           [ProfileWizardState.VERIFICATION_VERIFIED]: {
// //             on: {
// //               [next.type]: {
// //                 target: `#wizard.${ProfileWizardState.ACTIVATED}`,
// //               },
// //             },
// //           },
// //         },
// //       },
// //       [ProfileWizardState.ACTIVATED]: {
// //         type: "final",
// //       },
// //     },
// //   },
// //   {
// //     actions: {
// //       handleSetup: assign({
// //         userData: ({ context: { userData }, event, spawn }) => {
// //           if (event.type !== complete.type) return userData;
// //           const { payload } = event;
// //           const currentUserData = userData || {};
// //           return { ...currentUserData, ...payload };
// //         },
// //       }),
// //       setServerCode: assign({
// //         serverCode: ({ event, context }) => {
// //           if (!("output" in event)) return context.serverCode;
// //           return event.output;
// //         },
// //       }),
// //       setUserCode: enqueueActions(({ enqueue, context, self }) => {
// //         if (true) enqueue.sendTo(context.parentActorRef, { type: "a" });
// //         if (false) enqueue.assign({});

// //         setTimeout(() => {
// //           // const ctx = self.getSnapshot().context;
// //           // self.send({});
// //         }, 1000);
// //       }),
// //       // setUserCode: assign({
// //       //   userCode: ({ event, context }) => {
// //       //     if (event.type !== verify.type || !event.payload?.code)
// //       //       return context.userCode;
// //       //     return event.payload.code;
// //       //   },
// //       // }),
// //     },
// //     guards: {
// //       setupHasAllInfo: ({ context: { userData }, event }) => {
// //         const { payload } = "payload" in event ? event : {};
// //         const { password, firstName, lastName, email } = {
// //           ...(userData || {}),
// //           ...payload,
// //         };
// //         return !!password && !!firstName && !!lastName && !!email;
// //       },
// //       verifyHasAllCodes: ({ context, event }) => {
// //         // Handle the fromPromise event
// //         if ("output" in event) return !!event.output && !!context.userCode;
// //         // Handle the verify event
// //         if (event.type === verify.type)
// //           return !!context.serverCode && !!event.payload?.code;
// //         // Handle all other events
// //         return !!context.serverCode && !!context.userCode;
// //       },
// //     },
// //   }
// // );

// // const actor = createActor(wizardMachine, {
// //   input: {
// //     parentActorRef: {},
// //   },
// // });

// // actor.subscribe((snapshot) => {
// //   const { context, value } = snapshot;
// //   snapshot.matches({
// //     [ProfileWizardState.VERIFICATION]:
// //       ProfileWizardState.VERIFICATION_UNVERIFIED,
// //   });
// //   console.log(value, context);
// // });
// // actor.start();

// // actor.send(complete({ firstName: "Ivan", lastName: "Ivanov" }));
// // // actor.send(next());
// // actor.send(complete({ password: "123" }));
// // actor.send(complete({ email: "ivan.ivanov@gmail.com" }));
// // actor.send(next());

// // actor.send(verify({ code: 123 }));
// // actor.send(next());

// // - playback
// //   - stopped (initial)
// //   - playing
// //   - paused
// // - volume
// //   _ unmuted (initial)
// //   _ muted

// // const play = createEvent("play");
// // const pause = createEvent("pause");
// // const stop = createEvent("stop");

// // const setVolume = createEvent("setVolume", props<{ volume: number }>());
// // const mute = createEvent("mute");
// // const unmute = createEvent("unmute");

// // const machine = createMachine({
// //   id: "player",
// //   type: "parallel",
// //   context: {
// //     volume: 100,
// //   },
// //   states: {
// //     playback: {
// //       initial: "stopped",
// //       states: {
// //         stopped: {
// //           on: {
// //             [play.type]: {
// //               target: "playing",
// //             },
// //           },
// //         },
// //         playing: {
// //           on: {
// //             [pause.type]: {
// //               target: "paused",
// //             },
// //             [stop.type]: {
// //               target: "stopped",
// //             },
// //           },
// //         },
// //         paused: {
// //           on: {
// //             [play.type]: {
// //               target: "playing",
// //             },
// //             [stop.type]: {
// //               target: "stopped",
// //             },
// //           },
// //         },
// //         hist: {
// //           history: "deep",
// //         },
// //       },
// //     },
// //     volume: {
// //       initial: "unmuted",
// //       states: {
// //         unmuted: {
// //           on: {
// //             [mute.type]: {
// //               target: "muted",
// //             },
// //           },
// //         },
// //         muted: {
// //           on: {
// //             [unmute.type]: {
// //               target: "unmuted",
// //             },
// //           },
// //         },
// //       },
// //     },
// //   },
// //   on: {
// //     [setVolume.type]: [
// //       {
// //         target: ["#player.volume.muted", "#player.playback.hist"],
// //         guard: ({ event }) => {
// //           const { payload } = event as ReturnType<typeof setVolume>;
// //           return payload?.volume === 0;
// //         },
// //         actions: assign({
// //           volume: ({ event }) => {
// //             const { payload } = event as ReturnType<typeof setVolume>;
// //             return payload?.volume || 0;
// //           },
// //         }),
// //       },
// //       {
// //         target: ["#player.volume.unmuted", "#player.playback.hist"],
// //         guard: ({ event }) => {
// //           const { payload } = event as ReturnType<typeof setVolume>;
// //           return (payload?.volume || 0) <= 100;
// //         },
// //         actions: assign({
// //           volume: ({ event }) => {
// //             const { payload } = event as ReturnType<typeof setVolume>;
// //             return payload?.volume || 0;
// //           },
// //         }),
// //       },
// //     ],
// //   },
// // });

// // const a = createActor(machine);

// // a.subscribe(({ context, value }) => console.log({ context, value }));

// // a.start();

// // a.send(play());
// // a.send(setVolume({ volume: 4 }));
// // a.send(setVolume({ volume: 0 }));
// // a.send(setVolume({ volume: 10 }));
// // console.log(1);

// // Task 5

// // type Question = {
// //   question: string;
// //   options: string[];
// //   correct: number;
// // };

// // enum QuizStates {
// //   INITIAL = "initial",
// //   QUESTION = "question",
// //   NEXT_QUESTION = "nextQuestion",
// //   RESULTS = "results",
// // }

// // const start = createEvent("Start");
// // const answerQuestion = createEvent(
// //   "AnswerQuestion",
// //   props<{ answer: number }>()
// // );

// // const machine = createMachine({
// //   id: "quiz",
// //   types: {} as {
// //     context: {
// //       questions: Question[];
// //       score: number;
// //       currentQuestionIndex: number;
// //     };
// //     input: { questions: Question[] };
// //   },
// //   context: ({ input }) => {
// //     return {
// //       questions: input.questions,
// //       score: 0,
// //       currentQuestionIndex: -1,
// //     };
// //   },
// //   initial: QuizStates.INITIAL,
// //   states: {
// //     [QuizStates.INITIAL]: {
// //       on: {
// //         [start.type]: {
// //           target: QuizStates.NEXT_QUESTION,
// //         },
// //       },
// //     },
// //     [QuizStates.QUESTION]: {
// //       on: {
// //         [answerQuestion.type]: {
// //           target: QuizStates.NEXT_QUESTION,
// //           actions: assign({
// //             score: ({
// //               context: { currentQuestionIndex, score, questions },
// //               event,
// //             }) => {
// //               const {
// //                 payload: { answer },
// //               } = event as ReturnType<typeof answerQuestion>;
// //               const currentQuestion = questions[currentQuestionIndex];
// //               if (currentQuestion.correct === answer) return score + 1;
// //               return score;
// //             },
// //           }),
// //         },
// //       },
// //     },
// //     [QuizStates.NEXT_QUESTION]: {
// //       always: [
// //         {
// //           guard: ({ context: { currentQuestionIndex, questions } }) =>
// //             currentQuestionIndex + 1 < questions.length,
// //           actions: assign({
// //             currentQuestionIndex: ({ context: { currentQuestionIndex } }) =>
// //               currentQuestionIndex + 1,
// //           }),
// //           target: QuizStates.QUESTION,
// //         },
// //         {
// //           target: QuizStates.RESULTS,
// //         },
// //       ],
// //     },
// //     [QuizStates.RESULTS]: {
// //       type: "final",
// //     },
// //   },
// // });

// // const questions: Question[] = [
// //   { question: "Question 1", correct: 1, options: ["a", "b", "c"] },
// //   { question: "Question 2", correct: 3, options: ["a", "b", "c"] },
// //   { question: "Question 3", correct: 2, options: ["a", "b", "c"] },
// //   { question: "Question 4", correct: 1, options: ["a", "b", "c"] },
// //   { question: "Question 5", correct: 2, options: ["a", "b", "c"] },
// //   { question: "Question 6", correct: 1, options: ["a", "b", "c"] },
// // ];

// // const actor = createActor(machine, { input: { questions } });

// // actor.subscribe(({ context, value }) => console.log(context, value));

// // actor.start();

// // actor.send(start());
// // actor.send(answerQuestion({ answer: 2 }));
// // actor.send(answerQuestion({ answer: 3 }));
// // actor.send(answerQuestion({ answer: 2 }));
// // actor.send(answerQuestion({ answer: 2 }));
// // actor.send(answerQuestion({ answer: 1 }));
// // actor.send(answerQuestion({ answer: 1 }));

// TASK 6
enum AsyncStates {
  IDLE = "IDLE",
  RESOLVING = "RESOLVING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

function asyncMachineFactory<S extends string, T, R>({
  id,
  asyncFunction,
}: {
  id: S;
  asyncFunction: (arg: T) => Promise<R>;
}) {
  const events = {
    trigger: createEvent(`[${id}]Trigger`, props<T>()),
    success: createEvent(
      `[${id}]Success`,
      props<
        ReturnType<typeof asyncFunction> extends Promise<infer U> ? U : never
      >()
    ),
    failure: createEvent(`[${id}]Failure`, props<{ error: unknown }>()),
    retry: createEvent(`[${id}]Retry`, props<T | void>()),
  };

  const machine = createMachine({
    id,
    types: {} as {
      context: {
        data:
          | (ReturnType<typeof asyncFunction> extends Promise<infer U>
              ? U
              : never)
          | null;
        error: unknown | null;
        input: T | null;
        parentActorRef?: AnyActorRef;
      };
      input: { parentActorRef?: AnyActorRef } | void;
    },
    context: ({ input }) => ({
      data: null,
      error: null,
      input: null,
      parentActorRef: input?.parentActorRef,
    }),
    initial: AsyncStates.IDLE,
    states: {
      [AsyncStates.IDLE]: {
        on: {
          [events.trigger.type]: {
            target: AsyncStates.RESOLVING,
          },
        },
      },
      [AsyncStates.RESOLVING]: {
        invoke: {
          src: fromPromise(({ input }) =>
            asyncFunction(input).then((output) => ({ input, output }))
          ),
          input: ({ event, context }) => {
            const { payload } = event as
              | ReturnType<typeof events.trigger>
              | ReturnType<typeof events.retry>;
            return payload || context.input;
          },
          onDone: {
            actions: [
              assign({
                input: ({ event }) => {
                  const {
                    output: { input },
                  } = event as DoneActorEvent<{ input: T; output: R }, string>;
                  return input;
                },
                data: ({ event }) => {
                  const {
                    output: { output },
                  } = event as DoneActorEvent<{ input: T; output: R }, string>;
                  return output;
                },
              }),
              ({ self, event }) => {
                const {
                  output: { output },
                } = event as DoneActorEvent<{ input: T; output: R }, string>;
                const successEvent = events.success(
                  output as R extends void ? void : R
                );
                self.send(successEvent);
              },
            ],
            target: AsyncStates.SUCCESS,
          },
          onError: {
            actions: ({ self, event }) => {
              const { error } = event as ErrorActorEvent;
              const successEvent = events.failure({ error });
              self.send(successEvent);
            },
            target: AsyncStates.FAILURE,
          },
        },
      },
      [AsyncStates.SUCCESS]: {
        entry: [
          ({ context, event }) => {
            if (!context.parentActorRef) return;
            context.parentActorRef.send(event);
          },
        ],
        on: {
          [events.retry.type]: {
            target: AsyncStates.RESOLVING,
          },
        },
      },
      [AsyncStates.FAILURE]: {
        entry: [
          ({ context, event }) => {
            if (!context.parentActorRef) return;
            context.parentActorRef.send(event);
          },
        ],
        on: {
          [events.retry.type]: {
            target: AsyncStates.RESOLVING,
          },
        },
      },
    },
  });
  return { events, machine };
}

function myAsyncFn(value: number) {
  return new Promise<string>((res) => {
    setTimeout(() => res(`${value}`), 3000);
  });
}

const asyncTest = asyncMachineFactory({
  asyncFunction: myAsyncFn,
  id: "myAsyncFnMachine",
});

// const actor = createActor(asyncTest.machine);

// actor.subscribe(({ value, context }) => {
//   console.log({ value, context });
// });
// actor.start();
// actor.send(asyncTest.events.trigger(1));

// setTimeout(() => {
//   actor.send(asyncTest.events.retry(5));
// }, 4000);

// TASK 7

enum TaskManagerState {
  IDLE = "idle",
  RUNNING = "running",
}

const addTask = createEvent(
  "ADD_TASK",
  props<{ id: string; fn: <T, R>(arg: T) => Promise<R> }>()
);
const startTask = createEvent(
  "START_TASK",
  props<{ taskId: string; args?: object }>()
);

const taskManagerMachine = createMachine({
  id: "taskManager",
  types: {} as {
    context: {
      tasks: {
        ref: ActorRefFrom<ReturnType<typeof asyncMachineFactory>["machine"]>;
        events: ReturnType<typeof asyncMachineFactory>["events"];
      }[];
    };
  },
  context: {
    tasks: [],
  },
  initial: TaskManagerState.IDLE,
  states: {
    [TaskManagerState.IDLE]: {
      always: [
        {
          target: TaskManagerState.RUNNING,
          guard: ({ context }) =>
            context.tasks.some(
              (t) => t.ref.getSnapshot().value === AsyncStates.RESOLVING
            ),
        },
      ],
    },
    [TaskManagerState.RUNNING]: {
      always: [
        {
          target: TaskManagerState.IDLE,
          guard: ({ context }) =>
            context.tasks.every(
              (t) => t.ref.getSnapshot().value !== AsyncStates.RESOLVING
            ),
        },
      ],
    },
  },
  on: {
    [addTask.type]: {
      actions: assign({
        tasks: ({ event, context, spawn, self }) => {
          const {
            payload: { fn, id },
          } = event as ReturnType<typeof addTask>;
          const { machine, events } = asyncMachineFactory({
            asyncFunction: fn,
            id,
          });
          const actor = spawn(machine, {
            input: { parentActorRef: self },
            systemId: id,
            syncSnapshot: true,
          });
          return context.tasks.concat({ ref: actor, events });
        },
      }),
    },
    [startTask.type]: {
      actions: [
        ({ context, event, system }) => {
          const {
            payload: { taskId, args },
          } = event as ReturnType<typeof startTask>;
          const actor = system.get(taskId);
          const entry = context.tasks.find((t) => t.ref === actor);
          if (!entry) return;
          const action =
            entry.ref.getSnapshot().value === AsyncStates.IDLE
              ? entry.events.trigger(args)
              : entry.events.retry(args);
          entry.ref.send(action);
        },
      ],
    },
  },
});

const taskManager = createActor(taskManagerMachine);
taskManager.subscribe(({ context, value }) => {
  console.log(context, value);
});

taskManager.start();
taskManager.send(
  addTask({
    id: "task1",
    fn: () => new Promise((res) => setTimeout(res, 5000)),
  })
);
taskManager.send(
  addTask({
    id: "task2",
    fn: () => new Promise((res) => setTimeout(res, 5000)),
  })
);

taskManager.send(startTask({ taskId: "task1" }));
taskManager.send(startTask({ taskId: "task1" }));
