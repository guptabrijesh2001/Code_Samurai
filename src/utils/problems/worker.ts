// worker.ts
onmessage = function (event) {
  const {userCode} = event.data;
  // try {
    console.log("usercoooooode"+userCode)
    // Run the user code
     eval(userCode);

    // Send the result back to the main thread
  //   postMessage({ result });
  // } catch (error:any) {
  //   // If an error occurs, send the error back to the main thread
  //   postMessage({ error: error.message });
  // }
};
