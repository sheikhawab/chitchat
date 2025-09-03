import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import type { PostType } from "./Postlist";
import { Postscard } from "./Postscard";

interface Props {
  communityId: number;
}

// // yahan interface import kerna hai jo posts k liye bnaya tha postlist mein
interface PostInCommunity extends PostType {
  community: {
    name: string;
  };
}

export const fetchPostForCommunity = async (communityId: number): Promise<PostInCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*,community(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostInCommunity[];
};


export const CommunityPagePosts = ({communityId}: Props) => {

  const { data, error, isLoading } = useQuery<PostInCommunity[], Error>({
    // ye b mutation ki tarah hi km kery ga ek refer word jo use kr saktey ho or ek function
    queryKey: ["querykeyforcommunityposts",communityId],  // unique key for this query
    queryFn:() =>  fetchPostForCommunity(communityId),  // function jo supabase se data laati hai
  });

  if (isLoading)
    return <div className="text-center py-4">Loading community's Post...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
    console.log("communitydata:", data);


  return (
    <>

  <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
    {/* {data && data[0].community_id.name} */}
    <p>{data && data[0].community.name} </p>
    Community Posts
  </h2>
  {/* error aney ki wja ye hai k jb koi post nhi hti to error aa jta hai community ko fetchkerty wqaqr */}
 <div className="flex flex-wrap gap-6 justify-center">
  {data && data.length > 0 ? (
    data.map((post, key) => <Postscard mithaSii={post} key={key} />)
  ) : (
    <p>There is no post in this community.</p>
  )}
</div>



    </>
  )
}






{/* <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
               {/* {data && data[0].community_id.name }      */}
              //  Community Posts
      // </h2>
      // {data && data.length > 0 ? (data.map((post, key )=>(
        // <Postscard post={post} key={key} />
      // ))) : (<p>Their Is No Post In This Community</p> )} */}