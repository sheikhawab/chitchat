import {

  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";


interface LikePropsType {
  // yahan likeprops mien jo hai hum postki id ley rhe hain props k though
  likeprops: number;
}

interface Votes {
  id: number;
  user_id: string;
  post_id: number;
  votes: number; // add this
}

const vote = async (votevalue: number, userid: string, postid: number) => {
  // try for code
  const { data: existingvoteintable } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userid)
    .eq("post_id", postid)
    // yahan single() b use kr saktey thy
    .maybeSingle();

  if (existingvoteintable) {
    // idr .vote is liye ha kuky data se ko hum existingvoteintable mein daal chukey hain
    if (existingvoteintable.votes == votevalue) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingvoteintable.id);
      if (error) throw new Error(error?.message);
    } else {
      const { error } = await supabase
        .from("likes")
        .update({ votes: votevalue })
        .eq("id", existingvoteintable.id);
      // console.log("existing vote row:", existingvoteintable);

      if (error) throw new Error(error?.message);
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postid, user_id: userid, votes: votevalue });
    if (error) throw new Error(error?.message);
  }
};
// votes function jo hai wo votes ko crud kry ga
// lakin ye fetchvotes jo hia wo likes dislike total ley kr aye ga
const fetchVotes = async (postid: number): Promise<Votes[]> => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postid);
  if (error) throw new Error(error.message);

  return data as Votes[];
};
export const LikeButton = ({ likeprops }: LikePropsType) => {
  const { user } = useAuth(); // for user fetching with contextapi
  
  const queryClient = useQueryClient();

  // usequery jo hai data fetch kerny k liye
  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Votes[], Error>({
    queryKey: ["votes", likeprops],
    queryFn: () => fetchVotes(likeprops),
    refetchInterval: 5000,
  });

  // console.log(likeprops);
  // or useMutation hoook jo hia wo fetch, del, update etc k liye
  const { mutate } = useMutation({
    mutationFn: (votevalue: number) => {
      if (!user) throw new Error("user must be logged in to like");
      return vote(votevalue, user!.id, likeprops);
    },
    // Ye React Query ko batata hai:
    // "Hey, ye query ab stale ho gayi hai, firse fetch karo."
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", likeprops] });
    },
  });

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div> Loading Likes ...</div>;
  const likes = votes?.filter((e) => e.votes === 1)?.length ?? 0;
  const dislikes = votes?.filter(e => e.votes === -1)?.length ?? 0;
                  // user id jo hai hook (useauth) context se li ha
  const userVote = votes?.find((e) => e.user_id === user?.id)?.votes;

  /*    */
  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍 {likes}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎 {dislikes}
      </button>
    </div>
  );
  // Total Dislikes: {votes?.filter(v => v.votes === -1).length ?? 0}
  // Total Likes: {votes?.filter(v => v.votes === 1).length ?? 0}

  // return (
  //   <div>
  //     <button
  //       // onClick={() => console.log("Post ID:", likeprops)}
  //       onClick={() => mutate(+1)}
  //       className="px-4 py-2 bg-blue-500 text-white rounded"
  //     >
  //       Like👍🏼
  //     </button>
  //     <button
  //       onClick={() => mutate(-1)}
  //       className="px-4 py-2 bg-blue-500 text-white rounded"
  //     >
  //       Dislike 👎🏼
  //     </button>
  //   </div>
  // );
};
