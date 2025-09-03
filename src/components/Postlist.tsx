// YE HOME PAGE MIEN Postscard KO ITRATE KR RHA HAI or data fetch kr rha hai
// homepage => postlist => (itrating cards for every post)
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
// import { PostItem } from "./Postscard";
import { Postscard } from "./Postscard";


export interface PostType {
    id: number
    created_at: string 
    title: string
    content: string
    imagesUrlInSupabase:string
    avatar_url: string  
    // ye rpc policy jo bani hai wahan se aa rhe hain
    comment_count:number
    like_count:number
}

//   ye function table se data fetch kr rha hai
// const fetchPosts = async (): Promise<PostType[]> => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) throw new Error(error.message);
//   return data as PostType[];
// };


    // ku k ab like b show kerwny hain to alg policy supabase mien bna kr to 
    // idr se table k bajey policy se tech kerwayien gye
const fetchPosts = async (): Promise<PostType[]> => {
  const { data, error } = await supabase
    .rpc("get_posts_with_counts"); // 👈 function call
  if (error) throw new Error(error.message);
    console.log("Fetched posts:", data); // 👈 yahan output dekhne ko milega
  return data as PostType[];
};


const Postlist = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (isLoading) {
    return <div> Loading Post ...</div>;
  }
  console.log(data);
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      
      {data?.map(( PostType, key ) => (

      <Postscard mithaSii={PostType} key={key}/>  
      ))}
    </div>
  );
};

export default Postlist;
