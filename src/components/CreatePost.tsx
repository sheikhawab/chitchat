import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList"; // community import from createcommunity

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  // ye baad mein add kiya hai ku k community baad mein banai
  community_id: number | null;
}
const createPost = async (post: PostInput, imageFile: File) => {

  const imagePathInBucket = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage.from("post-images").upload(imagePathInBucket, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const {data: { publicUrl },
  } = await supabase.storage.from("post-images").getPublicUrl(imagePathInBucket);

  const { data, error } = await supabase.from("posts").insert({ ...post, imagesUrlInSupabase: publicUrl });
  if (error) throw new Error(error.message);
  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileChange, setFileChange] = useState<File | null>(null);
  // ye state baad mein aa rhi hai ku k community hai ya nhi b hai
  const [communityId, setCommunityId] = useState<number | null>(null);

  // community chose kerny k liye fucntion taa k user post ko attached kr sakey group k andr
  const { data: community } = useQuery<Community[], Error>({
    // ye b mutation ki tarah hi km kery ga ek refer word jo use kr saktey ho or ek function
    queryKey: ["communities-key-ko-cancle-kerny-k-liye-querykey"], // unique key for this query
    queryFn: fetchCommunities, // function jo supabase se data laati hai
  });
  const handlecommunityfunction = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // value mein kuch hai to number bna do warna null jo empty string hai
    setCommunityId(value ? Number(value) : null);
  };

  // const {mutate} = useMutation({mutationFn:createPost})
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const { user } = useAuth();
  // console.log(user);

  // ye pura from submit kr rha hai
  const handlesubmit = (event: React.FormEvent) => {
  event.preventDefault();
  if (!fileChange) return;

  mutate({
      post: {title,content,avatar_url: user?.user_metadata.avatar_url || null,
      community_id: communityId || null,
      },
      imageFile: fileChange,
    },
    // onsuccess khudse add kiya k form clear ho jaye submit hny k bd
    {
      onSuccess: () => {setTitle("");setContent("");setFileChange(null);setCommunityId(null);
      },
    }
  );
};


  // or ye sirf pictures ko submit kr rha
  const handlefilesubmit = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFileChange(e.target.files[0]);
  };

  return (
<>
  
  <form onSubmit={handlesubmit} className="max-w-2xl mx-auto space-y-4">
    <div>
      <label htmlFor="title" className="block mb-2 font-medium">
        Title
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-white/10 bg-transparent p-2 rounded"
        required
      />
    </div>
    <div>
      <label htmlFor="content" className="block mb-2 font-medium">
        Content
      </label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-white/10 bg-transparent p-2 rounded"
        rows={5}
        required
      />
    </div>

    <div>
      <div className="relative">
        <label>Choose Group</label>
          <label> Select Community</label>
        <select
          id="community"
          onChange={handlecommunityfunction}
          className="bg-black text-white pl-2 ml-36 pr-4"
          // className="text-gray-400  w-full border border-white/10 bg-transparent p-2 rounded"
        >
          <option value="" className="bg-black ">
            --Choose--
          </option>
          {community?.map((awab,key ) => (
              <option key={key} value={awab.id}
                className="bg-black pl-4 ml-36">
                {awab.name}
              </option>
            )
          )}
        </select>
      </div>

                        {/* clg kese chalta hai map function mein  */}
                        {/* <label>Choose Group</label>
                        <select id="community" onChange={handlecommunityfunction}>
                        <option value="">--Choose--</option>
                        {community?.map((awab, key) => {
                        console.log(awab); // yahan chalega har item k liye
                        return (
                        <option key={key} value={awab.id}>
                        {awab.name}
                        </option>
                        );
                        })}
                        </select> */}
    </div>
    <div>
      <label htmlFor="image" className="block mb-2 font-medium">
        Upload Image
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handlefilesubmit}
        // className="w-full text-gray-200 "
        className="text-gray-400  w-full border border-white/10 bg-transparent p-2 rounded"
      />
    </div>
    <button
      type="submit"
      className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
    >
      {isPending ? "Updating..." : "Create Post"}
      create post
    </button>

    {isError && <p className="text-red-500"> Error creating post.</p>}
  </form>
</>
  );
};
