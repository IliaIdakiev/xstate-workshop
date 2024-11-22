`npm create vite@latest xstate-workshop -- --template vanilla-ts` for browser

or `npx tsdx create xstate-workshop` for node

then `npm install xstate`

1. Create a machine that starts an interval (setInterval) and each second it increments a value on the context by 1. We should have two states `running` and `idle`.

2. Step 1: Create a wizard machine that contains this states:

- profileSetup:
  - incomplete ("setup event" transitions to "complete")
  - complete ("next" event transitions to "verification")
- verification:
  - unverified ("verify event" transitions to "verifying")
  - verifying (on success transition to "verified" and failure to transition to "unverified")
  - verified ("next" event transitions to "activation")
- activated (final state)

3. step 2: Extend the machine from

Hints: take a look at invoke, always, fromPromise, fromCallback.

- profileSetup:
  - incomplete (user is required to fulled up - email, firstName, lastName, password). Only when we have all of those fields we will allow them to move to "completed".
  - complete (user info is filled up and we are waiting for the user to send "next" event)
- verification: (upon entering the verification state we will need to dispatch a request (use Promise with setTimeout to simulate a request to the server and return some code "123"))
  - unverified ("verify event" transitions to "verifying")
  - verifying (when we enter "verifying" we need to send a another request with the code that we've received from the api call and a code that the user has entered. Simulate another API call using Promise and setTimeout in order to "check" if the two codes are valid. Upon successful check we will allow the user to move forward. Keep in mind that when the user has send the verification code the code that we load when we entered the parent state might not have completed yet so we need to wait for that code to get loaded first and then send the data. Handle both cases: when the initialization code is already loaded and when it's not loaded.)
  - verified ("next" event)
- activated (final state)

4. Create a parallel state machine called music player. Inside the context we ned to have a value for "volumeLevel" and we need to have two parallel states:

- playback
  - stopped (initial)
  - playing
  - paused
- volume
  _ unmuted (initial)
  _ muted
  Create the proper events for transitioning from one state to the other. Create a global volume set event handler that will set the volume level value in the context. If the volume level value is 0 we need to automatically transition the volume state to muted and if the volume level is larger than 0 we need to set the volume state to unmuted.

5. Input practice. Create a quiz machine that accepts as input an array of questions `{ question: string; options: string[]; correct: number }[]`. Set those questions in the context and create this states: "initial" the initial state, question (the state for the current question) and "nextQuestion" a state that will only pick the next question and return to the "question" state. If there is no next question we will go ot "results" state which is the final state; On the results page we need to show the current score based in the correct answer and now many times the user has selected the correct answer.

6. Create async task machine that accepts async function (function that returns a promise) and manages the state of the async task. The states should be "idle", "resolving", "success", "failure". It need to allow a "retry" that will re-execute the async task and also we need to store the value in "data" and if we have an error to store the error in "error" on the context. We can transition to the "resolving" state by sending "resolve" event.

7. Create async task manager machine. It can handle "ADD_TASK" events that has an async function as payload and an unique id and "spawns" a async task machine for this specific function. Also it must handle "START_TASK" events that has as payload the unique task id that we want to start. Also it must have two states ("idle" - nothing is being resolved and "resolving" - we have at least one task that is being resolved). Modify the async task machine to accept as input managerRef that will be a reference the the managerActor so it can dispatch the proper actions in order for the manager to reflect the states.
