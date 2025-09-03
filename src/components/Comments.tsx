import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";


interface PropscommentsType {
  postId: number;
}
interface CommentType {
  content?: string;
  parentcommentid?: string | null;
}
// ye wala interface fetch kerny k liye (supabase)
// or export is liye k ek or component mein tree bnayein gye 
export interface fetchCommentsType {
  id: number;
  created_at: string;
  post_id: number;
  user_id: string;
  content: string;
  author: string ;
  parent_comment_id?: number | null
}

// creating comments in supabase function
const createComment = async (
  comment: CommentType,postid: number,userid?: string,author?: string
) => {
  if (!userid || !author) {
    throw new Error("you must be logged in");
  }
  const { error } = await supabase.from("comments").insert({
    post_id: postid,content: comment.content,parent_comment_id: comment.parentcommentid || null,user_id: userid,author: author,
  });
  if (error) throw new Error(error.message);
};

// fetching comments form supabase
const fetchComments = async(postId: number): Promise<fetchCommentsType[]> => {
    const { data, error } = await supabase
      .from("comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
     console.log("comments ki array :", data);
    return (
      data as fetchCommentsType[]
    );
    // console.log(data)
}


// ye tha main component ka function 
export const Comments = ({ postId }: PropscommentsType) => {
  const [comment, setComment] = useState<string>("");
  const { user } = useAuth();
  const  Queryforcomments = useQueryClient()

  ///// fucnction for fetching votes
  const { data: comments, isLoading, error } = useQuery<fetchCommentsType[], Error>({
  queryKey: ["comments", postId],
  queryFn: () => fetchComments(postId),
  refetchInterval: 5000,
});

    // create comments fucntion
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (comment: CommentType) =>
      createComment(comment, postId, user?.id, user?.user_metadata?.user_name),
    onSuccess:() => {
       Queryforcomments.invalidateQueries({queryKey: ["comments", postId],})
    }
  });

      //  handle submit with mutation hook
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    console.log("Post ID:", postId);
    console.log("Comment:", comment);
    mutate({ content: comment, parentcommentid: null });// calling comments fucntion in handlesubmit
    setComment("");
  };

  // MUSHKIL FUCNTION COMMENTS KO TREE KERNA OR PARENTS K ANDR CHILD DALNA
  // * flat comments ko tree me convert karega
const buildCommentTree = (flatComments: fetchCommentsType[]) => {
  // Map ek object hai jo key or values ko store kerta hai 
  const map = new Map<number, fetchCommentsType & { children: fetchCommentsType[] }>();
  const roots: (fetchCommentsType & { children: fetchCommentsType[] })[] = [];

  // step 1: har comment ko map me daalna
  flatComments.forEach(comment => {
    map.set(comment.id, { ...comment, children: [] });
  });

  // step 2: parent/child relation banana
  flatComments.forEach(comment => {
    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id);
      if (parent) {
        parent.children.push(map.get(comment.id)!);
      }
    } else {
      roots.push(map.get(comment.id)!);
    }
  });

  return roots;
};
  const commentTree = comments ? buildCommentTree(comments) : [];
   if (isLoading){
    return <div>Loading Comments ...</div>
   }
   if (error){
    return <div>Error:{error.message}</div>
   }
  return (
    <>
      <>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Comments</h3>
                     {/* create comments section */}
          {user ? (
            <form onSubmit={handleSubmit} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-white/10 bg-transparent p-2 rounded"
                placeholder="Write a comment..."
                rows={3}
              />

              <button
                type="submit"
                className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
                disabled={!comment}
              >
                {isPending ? "Posting..." : "Post Comment"}{" "}
              </button>

              {isError && (
                <p className="text-red-500 mt-2">Error posting comment.</p>
              )}
            </form>
          ) : (
            <p className="mb-4 text-gray-600">
              You must be logged in to post a comment.
            </p>
          )}

          {/* Agar tum comments list dikhana chahte ho to yahan pehle wale code ka section use hoga */}
          <div className="space-y-4">
      {commentTree.map((comment, key) => (
        <CommentItem key={key} comment={comment} postId={postId} />
      ))}
    </div>
     {/* comments list */}
      {/* <div className="space-y-4">
        {commentTree.map(comment => (
         <CommentItem key={comment.id} comment={comment} />
        ))}
      </div> */}
        </div>
      </>
    </>
  );
};
