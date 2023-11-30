// AddProblem.tsx

import { firestore } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import React, { FormEvent,useState } from 'react';

const AddProblem: React.FC = () => {


      const [inputs,setInputs]= useState({
	id:'',
	title:'',
	difficulty:'',
	category:'',
	videoId:'',
	link:'',
	order:0,
	likes:0,
	dislikes:0
   })

  const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
	setInputs({
		...inputs,
		[e.target.name]:e.target.value
	})
  console.log(inputs)
  }
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const newProblem={
        ...inputs,
        order:Number(inputs.order),
    }
    await setDoc(doc(firestore,"problems",inputs.id),newProblem);
    alert("saved to db")
    // Add logic to handle form submission (e.g., save to database)

  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Problem ID</label>
          <input  onChange={handleInputChange}  type="text" placeholder="Problem ID" name="id" className="form-input mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Title</label>
          <input  onChange={handleInputChange} type="text" placeholder="Title" name="title" className="form-input mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Difficulty</label>
          <input onChange={handleInputChange}  type="text" placeholder="Difficulty" name="difficulty" className="form-input mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Category</label>
          <input onChange={handleInputChange}  type="text" placeholder="Category" name="category" className="form-input mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Order</label>
          <input onChange={handleInputChange}  type="text" placeholder="Order" name="order" className="form-input mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Video ID</label>
          <input  onChange={handleInputChange} type="text" placeholder="Video ID" name="videoId" className="form-input mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Link</label>
          <input  onChange={handleInputChange} type="text" placeholder="Link" name="link" className="form-input mt-1" />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Save to Database
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
