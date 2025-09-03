// // HOMEPAGE => POSTLIST => POSTCARD ==> POSTPAGEDETAILS => LIKEBUTTON
                                                          //  => COMMNETS
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import type { PostType } from "./Postlist";
import { LikeButton } from "./LikeButton";
import { Comments } from "./Comments";


interface propsForPostdetailsPageType{
  propsForPostdetailsPage: number
}


const fetchPostById = async (id: number): Promise<PostType> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as PostType;
};

export const Postdetails = ({ propsForPostdetailsPage }: propsForPostdetailsPageType) => {
  const { data, error, isLoading } = useQuery<PostType, Error>({
    queryKey: ["post", propsForPostdetailsPage],
    queryFn: () => fetchPostById(propsForPostdetailsPage),
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      {data?.imagesUrlInSupabase && (
        <img
          src={data.imagesUrlInSupabase}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      
   
      <LikeButton likeprops={propsForPostdetailsPage} />
      <Comments postId={propsForPostdetailsPage} />

      
    </div>
  );
};

