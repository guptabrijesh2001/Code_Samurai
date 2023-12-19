import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { codeuser } from "@/atoms/authModalAtom"; 
import { useRecoilState,useRecoilValue } from "recoil";
import { help } from "@/atoms/authModalAtom"; 
type PlaygroundProps = {
	problem: Problem;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}
var abc={val:""};
const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
	const [code, setcode] = useRecoilState(codeuser);
	const[err,seterr]=useState("");
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	let [userCode, setUserCode] = useState<string>(problem.starterCode);

	const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

	const [settings, setSettings] = useState<ISettings>({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});
    const [act,setact]=useState(false)
	const [act1,setact1]=useState(false);
	const [user] = useAuthState(auth);
	const aiHelp=useRecoilValue(help);
	const {
		query: { pid },
	} = useRouter();

	const handleSubmit = async () => {
		if (!user) {
			toast.error("Please login to submit your code", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark", 
			});
			return;
		}
		try {
			userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
			const cb = new Function(`return ${userCode}`)();
			const handler = problems[pid as string].handlerFunction;
      
			if (typeof handler === "function") {
				console.log("yes it is function")
				var success;
				console.log(code)
			  setcode(`${cb}`)				
			   success = await handler(cb,abc);
			// 	catch(error:any){
			// 		console.log(error.message+"here it is");
			// console.log("abccc"+abc.val)
			// if (
			// 	error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
			// ) {
			// 	toast.error("Oops! One or more test cases failed", {
			// 		position: "top-center",
			// 		autoClose: 3000,
			// 		theme: "dark",
			// 	});
			// } else {
			// 	seterr(error.message);
			// 	console.log(error.message)
			// 	console.log("abccc"+abc.val)
			// 	toast.error(error.message, {
			// 		position: "top-center",
			// 		autoClose: 3000,
			// 		theme: "dark",
			// 	});
			// }
			// 	}
				
				if (success) {
					console.log("success"+JSON.stringify(success))
					toast.success("Congrats! All tests passed!", {
						position: "top-center",
						autoClose: 3000,
						theme: "dark",
					});
					setSuccess(true);
					setTimeout(() => {
						setSuccess(false);
					}, 4000);

					const userRef = doc(firestore, "users", user.uid);
					await updateDoc(userRef, {
						solvedProblems: arrayUnion(pid),
					});
					setSolved(true);
				}
			
			}
			
		} catch (error: any) {
			console.log(error.message+"here it is");
			console.log("abccc"+abc.val)
			if (
				error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
			) {
				toast.error("Oops! One or more test cases failed", {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				seterr(error.message);
				console.log(error.message)
				console.log("abccc"+abc.val)
				toast.error(error.message, {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			}
		}
	};

	useEffect(() => {
		const code = localStorage.getItem(`code-${pid}`);
		if (user) {
			setUserCode(code ? JSON.parse(code) : problem.starterCode);
		} else {
			setUserCode(problem.starterCode);
		}
	}, [pid, user, problem.starterCode]);

	const onChange = (value: string) => {
		setUserCode(value);
		localStorage.setItem(`code-${pid}`, JSON.stringify(value));
	};

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} />

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<CodeMirror
						value={userCode}
						theme={vscodeDark}
						onChange={onChange}
						extensions={[javascript()]}
						style={{ fontSize: settings.fontSize }}
					/>
				</div>
				<div className='w-full px-5 overflow-auto'>
					{/* testcase heading */}
					<div className='flex h-10 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className="flex ">
							<div  onClick={() =>{setact(false); setact1(false)}}  className=' relative text-sm font-medium leading-5 text-white mr-2'>Testcases
							{!act && !act1 &&<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}</div>
							<div onClick={() =>{setact(true); setact1(false)}} className=' relative text-sm font-medium leading-5 text-white mr-2'>Result
						{act && !act1&&	<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}</div>
						<div  onClick={() =>{setact(false); setact1(true); }}  className=' relative text-sm font-medium leading-5 text-white mr-2'>Help
							{act1 &&<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}</div>
							</div>
							
						</div>
					</div>
{ !act && !act1 &&
				<>	<div className='flex'>
						{problem.examples.map((example, index) => (
							<div
								className='mr-2 items-start mt-2 '
								key={example.id}
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className='font-semibold my-4'>
						<p className='text-sm font-medium mt-4 text-white'>Input:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.examples[activeTestCaseId].inputText}
						</div>
						<p className='text-sm font-medium mt-4 text-white'>Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.examples[activeTestCaseId].outputText}
						</div>
				</div></>}



      {act && ! act1 && (err==="" ? <>	<div className='flex'>
						{problem.examples.map((example, index) => (
							<div
								className='mr-2 items-start mt-2 '
								key={example.id}
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className='font-semibold my-4'>
						<p className='text-sm font-medium mt-4 text-white'>Input:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.examples[activeTestCaseId].inputText}
						</div>
						<p className='text-sm font-medium mt-4 text-white'>Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{JSON.stringify(abc.val[activeTestCaseId])
							}
							
						</div>
						<p className='text-sm font-medium mt-4 text-white'>Expected Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.examples[activeTestCaseId].outputText}
						</div>
				</div></>
				:
				<div className="bg-red-500 text-white p-4 rounded-md shadow-md">
    <p className="font-bold">Error:</p>
    <p>{err}</p>
  </div>)}

{act1 && aiHelp!="" &&<div className="bg-yellow-500 text-white p-4 rounded-md shadow-md">
    <p className="font-bold">Hint:</p>
    <p>{aiHelp}</p>
  </div>}
					</div>
			</Split>
			<EditorFooter handleSubmit={handleSubmit} />
		</div>
	);
};
export default Playground;
