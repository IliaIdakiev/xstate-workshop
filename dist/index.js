"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstate_1 = require("xstate");
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
var IntervalMachineState;
(function (IntervalMachineState) {
    IntervalMachineState["IDLE"] = "idle";
    IntervalMachineState["RUNNING"] = "running";
})(IntervalMachineState || (IntervalMachineState = {}));
// TASK 1
const intervalMachine = (0, xstate_1.createMachine)({
    initial: IntervalMachineState.IDLE,
    context: {
        counter: 0,
    },
    states: {
        [IntervalMachineState.IDLE]: {
            on: {
                start: IntervalMachineState.RUNNING,
            },
        },
        [IntervalMachineState.RUNNING]: {
            invoke: {
                src: (0, xstate_1.fromCallback)(({ sendBack }) => {
                    const id = setInterval(() => {
                        sendBack({ type: "TICK" });
                    });
                    return () => {
                        clearInterval(id);
                    };
                }),
            },
            on: {
                TICK: {
                    actions: (0, xstate_1.assign)({
                        counter: ({ context }) => context.counter + 1,
                    }),
                },
                stop: IntervalMachineState.IDLE,
            },
        },
    },
});
const intervalActor = (0, xstate_1.createActor)(intervalMachine);
intervalActor.subscribe(({ context, value }) => {
    console.log(context, value);
});
intervalActor.start();
intervalActor.send({ type: "start" });
setTimeout(() => {
    intervalActor.send({ type: "stop" });
}, 5000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBMEU7QUFFMUUsNEJBQTRCO0FBQzVCLGVBQWU7QUFDZixrQkFBa0I7QUFDbEIsbUJBQW1CO0FBQ25CLE9BQU87QUFDUCxxQkFBcUI7QUFDckIsY0FBYztBQUNkLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIsZ0RBQWdEO0FBQ2hELDZCQUE2QjtBQUM3QixjQUFjO0FBQ2QsV0FBVztBQUNYLGNBQWM7QUFDZCxtQkFBbUI7QUFDbkIsY0FBYztBQUNkLGlDQUFpQztBQUNqQyxlQUFlO0FBQ2YsYUFBYTtBQUNiLFdBQVc7QUFDWCxTQUFTO0FBQ1QsaUJBQWlCO0FBQ2pCLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIsNEJBQTRCO0FBQzVCLGFBQWE7QUFDYixpQkFBaUI7QUFDakIsY0FBYztBQUNkLDJEQUEyRDtBQUMzRCxnQ0FBZ0M7QUFDaEMsK0RBQStEO0FBQy9ELGtCQUFrQjtBQUNsQixlQUFlO0FBQ2YsY0FBYztBQUNkLGdDQUFnQztBQUNoQyxpRUFBaUU7QUFDakUsa0JBQWtCO0FBQ2xCLGVBQWU7QUFDZixhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLDhCQUE4QjtBQUM5Qiw2REFBNkQ7QUFDN0QsZ0JBQWdCO0FBQ2hCLGFBQWE7QUFDYixXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUCxRQUFRO0FBQ1IsV0FBVztBQUNYLHdCQUF3QjtBQUN4Qix1REFBdUQ7QUFDdkQsVUFBVTtBQUNWLE9BQU87QUFDUCxXQUFXO0FBQ1gsd0JBQXdCO0FBQ3hCLHVEQUF1RDtBQUN2RCxVQUFVO0FBQ1YsT0FBTztBQUNQLEtBQUs7QUFDTCxNQUFNO0FBRU4sNEJBQTRCO0FBRTVCLDhCQUE4QjtBQUM5QixtREFBbUQ7QUFDbkQsTUFBTTtBQUVOLGFBQWE7QUFFYiw2QkFBNkI7QUFDN0IsMkJBQTJCO0FBQzNCLDJCQUEyQjtBQUMzQiw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCLDZCQUE2QjtBQUM3QiwyQkFBMkI7QUFDM0IsNEJBQTRCO0FBRTVCLElBQUssb0JBR0o7QUFIRCxXQUFLLG9CQUFvQjtJQUN2QixxQ0FBYSxDQUFBO0lBQ2IsMkNBQW1CLENBQUE7QUFDckIsQ0FBQyxFQUhJLG9CQUFvQixLQUFwQixvQkFBb0IsUUFHeEI7QUFFRCxTQUFTO0FBQ1QsTUFBTSxlQUFlLEdBQUcsSUFBQSxzQkFBYSxFQUFDO0lBQ3BDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxJQUFJO0lBQ2xDLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxNQUFNLEVBQUU7UUFDTixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLEVBQUUsRUFBRTtnQkFDRixLQUFLLEVBQUUsb0JBQW9CLENBQUMsT0FBTzthQUNwQztTQUNGO1FBQ0QsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM5QixNQUFNLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLElBQUEscUJBQVksRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtvQkFDakMsTUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTt3QkFDMUIsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQzdCLENBQUMsQ0FBQyxDQUFDO29CQUNILE9BQU8sR0FBRyxFQUFFO3dCQUNWLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDcEIsQ0FBQyxDQUFDO2dCQUNKLENBQUMsQ0FBQzthQUNIO1lBQ0QsRUFBRSxFQUFFO2dCQUNGLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsSUFBQSxlQUFNLEVBQUM7d0JBQ2QsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDO3FCQUM5QyxDQUFDO2lCQUNIO2dCQUNELElBQUksRUFBRSxvQkFBb0IsQ0FBQyxJQUFJO2FBQ2hDO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sYUFBYSxHQUFHLElBQUEsb0JBQVcsRUFBQyxlQUFlLENBQUMsQ0FBQztBQUNuRCxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtJQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUMsQ0FBQztBQUNILGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUV0QixhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFFdEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN2QyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMifQ==