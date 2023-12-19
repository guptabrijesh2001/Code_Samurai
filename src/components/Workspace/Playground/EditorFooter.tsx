import { useRouter } from "next/router";
import React from "react";
import { BsChevronUp } from "react-icons/bs";
import { problems } from "@/utils/problems";
import { codeuser } from "@/atoms/authModalAtom"; 
import { useRecoilValue,useRecoilState } from 'recoil';
import OpenAI from 'openai';
import {useState,useEffect} from "react";
import {help} from "@/atoms/authModalAtom";
type EditorFooterProps = {
	handleSubmit: () => void;
};
// const handleAiHelp = (e) => {
//     e.preventDefault();

//     axios
//       .post(`${HTTP}`, { prompt })
//       .then((res) => {
//         setResponse(res.data);
//         console.log(prompt);
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     setPrompt("");
//   };


const EditorFooter: React.FC<EditorFooterProps> = ({ handleSubmit }) => {
	const c = useRecoilValue(codeuser);
	const {
		query: { pid },
	} = useRouter();
	const [helpResponse,setHelpResponse] =useState<string>("");
	const [aiHelp1,setaiHelp1]=useRecoilState<string>(help);
	const examplesString = problems[pid as string].examples.map(example => {
		return `Input: ${example.inputText}, Output: ${example.outputText}`;
	  }).join(', ');
	  
	useEffect(() => {
		// Function to call OpenAI API
		const callOpenAI = async () => {
		  const openai = new OpenAI({
			apiKey: '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',
			dangerouslyAllowBrowser: true 
		  });
	
		  try {
			const response = await openai.completions.create({
			  model: 'text-davinci-003', 
			  prompt: `${problems[pid as string].id} ${problems[pid as string].title} ${problems[pid as string].problemStatement} ${examplesString} here is my code ${c},give me a hint in 30 words as to what i can change in the code.`, 
			  max_tokens: 30, 
			});
	
			setHelpResponse(response.choices[0].text);
			setaiHelp1(response.choices[0].text);
		  } catch (error) {
			console.error('OpenAI API Error:', error);
		  }
		};
	
		callOpenAI();
	  }, [pid, c]);
	return (
		<div className='flex bg-dark-layer-1 absolute bottom-0 z-10 w-full'>
			<div className='mx-5 my-[10px] flex justify-between w-full'>
				<div className='mr-2 flex flex-1 flex-nowrap items-center space-x-4'>
					<button className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2'>
						Console
						<div className='ml-1 transform transition flex items-center'>
							<BsChevronUp className='fill-gray-6 mx-1 fill-dark-gray-6' />
						</div>
					</button>
				</div>
				<div className='ml-auto flex items-center space-x-4'>
					<button
						className='px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-label-2 rounded-lg'
						onClick={handleSubmit}
					>
						Run
					</button>
					<button
						className='px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg'
						onClick={handleSubmit}
					>
						Submit
					</button>
					<button
						className='px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg'
						onClick={()=>{
							
							// const query=`${problems[pid as string].id} ${problems[pid as string].title} ${problems[pid as string].problemStatement} ${problems[pid as string].examples} here is my code ${c}`
							// console.log(query)
							// const examplesString = problems[pid as string].examples.map(example => {
							// 	return `Input: ${example.inputText}, Output: ${example.outputText}`;
							//   }).join(', ');
							  
							//   const query = `${problems[pid as string].id} ${problems[pid as string].title} ${problems[pid as string].problemStatement} ${examplesString} here is my code ${c}`;
                            console.log(helpResponse);
						}}
					>
						Help
					</button>
				</div>
			</div>
		</div>
	);
};
export default EditorFooter;

