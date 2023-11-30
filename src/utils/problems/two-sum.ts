import assert from "assert";
import { Problem } from "../types/problem";
// import { Worker } from 'worker_threads'; 
function executeUserCode(userCode: string, timeout: number): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create a blob containing the user code
    const blob = new Blob([userCode], { type: 'application/javascript' });

    // Create a worker from the blob
    const worker = new Worker(URL.createObjectURL(blob));
worker.postMessage({ userCode });
    // Set up a timeout for the worker
    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error('Execution timed out'));
    }, timeout);

    // Listen for messages from the worker
    worker.onmessage = function (event) {
      clearTimeout(timeoutId); // Clear the timeout since the worker has completed

      const { result, error } = event.data;

      // Terminate the worker
      worker.terminate();

      if (error) {
		console.log("i am handling")
        reject(new Error(error));
      } else {
        resolve(result);
      }
    };

    // Handle errors during worker initialization
    worker.onerror = function (error) {
      clearTimeout(timeoutId);
      reject(new Error(`Worker initialization error: ${error.message}`));
    };
  });
}

    // Set a timeout to terminate the worker after a specified time
//     setTimeout(() => {
//       worker.terminate();
//       reject(new Error('Execution timed out.'));
//     }, timeout);
//   });
// }



const starterCodeTwoSum = `function twoSum(nums,target){
  // Write your code here
};`;
// const executeWithTimeout = (fn:any, timeout:any,x:any,y:any) => {
//   return new Promise((resolve, reject) => {
//     const timeoutId = setTimeout(() => {
//       reject(new Error("Time limit exceeded"));
//     }, timeout);

//     const result = fn();

//     clearTimeout(timeoutId);

//     resolve(result(x,y));
//   });
// };
// checks if the user has the correct code

const handlerTwoSum =async (fn: any,abc:any) => {
	// fn is the callback that user's code is passed into

	
		const nums = [
			[2, 7, 11, 15],
			[3, 2, 4],
			[3, 3],
		];

		const targets = [9, 6, 6];
		const answers = [
			[0, 1],
			[1, 2],
			[0, 1],
		];
        //  var ans=[[]];
		 var ans: number[][] = [];
		 
		// loop all tests to check if the user's code is correct
		try{
		 for (let i = 0; i < nums.length; i++) {
    try {
      const userCode: string = `self.onmessage = function(event) {
    try { 
		const nums = [${nums[i]}];
      const target = ${targets[i]};
	   const fn = ${fn.toString()};
      ${fn.toString()}

	 const result = fn(nums,target);    self.postMessage({ result });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  };`;
      const timeout: number = 1000; // 1 second

      const result = await executeUserCode(userCode, timeout);
      ans.push(result);
      console.log('Execution completed:', result);
    } catch (error:any) {
      console.log("Error occurred during execution:", error);
	  throw new Error(error);
      // Handle the error or log it as needed
    }
  }
}
catch(error:any)
{
	console.log("missssssssssssssssssssssssssssssing")
	throw new Error(error);
}
		abc.val=ans;
		console.log("abc"+JSON.stringify(abc));
		// setTimeout(()=>{

			for (let i = 0; i < nums.length; i++) {
				// result is the output of the user's function and answer is the expected output
				try{
				console.log("cheeeeeeeeeeck")
				assert.deepStrictEqual(ans[i], answers[i]);
				}
				catch (error: any) {
					console.log("twoSum handler function error");
					throw new Error(error)
					// console.log(`${error} in test case ${i}`)
					// throw new Error(`${error} in test case ${i}`);
				}
	
			}
		// },1000)
          console.log("above true")
		
		return true;
};

export const twoSum: Problem = {
	id: "two-sum",
	title: "1. Two Sum",
	problemStatement: `<p class='mt-3'>
  Given an array of integers <code>nums</code> and an integer <code>target</code>, return
  <em>indices of the two numbers such that they add up to</em> <code>target</code>.
</p>
<p class='mt-3'>
  You may assume that each input would have <strong>exactly one solution</strong>, and you
  may not use thesame element twice.
</p>
<p class='mt-3'>You can return the answer in any order.</p>`,
	examples: [
		{
			id: 1,
			inputText: "nums = [2,7,11,15], target = 9",
			outputText: "[0,1]",
			explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
		},
		{
			id: 2,
			inputText: "nums = [3,2,4], target = 6",
			outputText: "[1,2]",
			explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
		},
		{
			id: 3,
			inputText: " nums = [3,3], target = 6",
			outputText: "[0,1]",
		},
	],
	constraints: `<li class='mt-2'>
  <code>2 ≤ nums.length ≤ 10</code>
</li> <li class='mt-2'>
<code>-10 ≤ nums[i] ≤ 10</code>
</li> <li class='mt-2'>
<code>-10 ≤ target ≤ 10</code>
</li>
<li class='mt-2 text-sm'>
<strong>Only one valid answer exists.</strong>
</li>`,
	handlerFunction: handlerTwoSum,
	starterCode: starterCodeTwoSum,
	order: 1,
	starterFunctionName: "function twoSum(",
};

