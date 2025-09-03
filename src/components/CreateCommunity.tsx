// idr hum community (group) bna rhe hain 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface communityType{
    name: string
    discreption: string
}


// ye function create kry ga backend se community ko
const createCommunity = async (community: communityType) => {
      const { error, data } = await supabase.from("community").insert(community);
      if (error) throw new Error(error.message);
      if (error){
        console.log(error)
      };
      return data
}

export const CreateCommunity = () => {
    const navigate = useNavigate()
    const exampleQueryWord = useQueryClient()

 const [name, setName] = useState<string>("")
 const [discreption, setDiscription] = useState<string>("")

        // create comments fucntion
  const { mutate, isError, isPending } = useMutation({
      // Yahan tum sirf reference de rahe ho (createCommunity ka address),
      //  na ke usko turant call kar rahe ho.Isliye brackets () nahi lagte.
      mutationFn: createCommunity,
    onSuccess:() => {
        exampleQueryWord.invalidateQueries({ queryKey: ["communities-key-ko-cancle-kerny-k-liye-querykey"] }) 
        navigate("/communities/page")
        console.log("community created !")
    }
  });

      //  handle submit with mutation hook
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({name, discreption });// passed arguments to mutatefn which is gone to createCommunity
    
  };
  return  (
    <>
     <form 
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-6xl  leading-loose font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Group
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={discreption}
          onChange={(e) => setDiscription(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create "}
      </button>
      {isError && <p className="text-red-500">Error creating community.</p>}
    </form>
    </>
  )
}