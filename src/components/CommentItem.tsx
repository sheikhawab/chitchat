//   yahan reply kerny ki functionality hai 
//  import { useState } from "react";
//  import type { fetchCommentsType } from "./Comments";
//  import { useAuth } from "../context/AuthContext";
//  import { useMutation, useQueryClient } from "@tanstack/react-query";
//  import { supabase } from "../supabase-client";


//  interface props {
//      comment:  fetchCommentsType & {children?: fetchCommentsType[]}
//      postId: number
//  }


//  export const CommentItem = ({comment, postId}: props) => {
//     reply show kerna to hide kerny ki state
//    const [showReply, setShowReply] = useState<boolean>(false);
//     reply handling state
//    const [replyText, setReplyText] = useState<string>("");
//     replies ko show or hide kenry ki state
//    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
//     user laya ja rha hai taa k reply kr sakey ya nhi !
//    const {user} = useAuth();
//    const queryforreply = useQueryClient()
  

//       create comments fucntion
//      const createReply = async (replyContent:string,postId:number, parentCommentId:number,userId?:string,author?:string) => {
//       if (!userId || !author) {
//       throw new Error("you must be logged in to reply");
//    }
//      const { error } = await supabase.from("comments").insert({
//        post_id: postId,content: replyContent, parent_comment_id: parentCommentId, user_id: userId, author: author,
//      });
//      if (error) throw new Error(error.message);
//        }
//    const { mutate, isError, isPending } = useMutation({
//      mutationFn: (replyContent:string) =>
//        createReply(replyContent, postId,comment.id, user?.id, user?.user_metadata?.user_name),
//      onSuccess:() => {
//         queryforreply.invalidateQueries({queryKey: ["comments", postId],}),
//         setReplyText("");
//      }
//    });
//    const handleReplySubmit = (e: React.FormEvent) => {
//      e.preventDefault();
//       if (!comment.trim()) return;
//      if (!replyText) return;
//       mutate({ content: comment, parentcommentid: null }); calling comments fucntion in handlesubmit
//      mutate(replyText); calling comments fucntion in handlesubmit
    
//    };
//    return (
    
//      <div>
//        <div>
//          <div>
//            <span>{comment.author}</span>
//            <span>{new Date(comment.created_at).toLocaleString()}</span>
//          </div>
//          <p>{comment.content}</p>
//          {/* <button onClick={()=>(setReply((prev) => !prev))}>Reply</button> */}
//          <button onClick={()=>(setShowReply(prev => !prev))}>{showReply? "Cancle" : "Reply"}</button>
//        </div>
//        {showReply && user && (
//          <form onSubmit={handleReplySubmit} className="mb-4">
//                <textarea
//                  value={replyText}
//                  onChange={(e) => setReplyText(e.target.value)}
//                  className="w-full border border-white/10 bg-transparent p-2 rounded"
//                  placeholder="Write a Reply..."
//                  rows={2}
//                />

//                <button
//                  type="submit"
//                  className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
//                  disabled={!comment}
//                >
//                  {isPending ? "Posting..." : "Post Reply"}
//                </button>

//                {isError && (
//                  <p className="text-red-500 mt-2">Error posting Reply.</p>
//                )}
//              </form>     
//        )}
//         {comment.children && comment.children.length > 0 && (
//                <div>
//                {/* <button onClick={()=>(setIsCollapsed(prev => !prev))}>{isCollapsed? "Hide Replies" : "Show Replies"}</button> */}
//                <button 
//                onClick={()=>(setIsCollapsed(prev => !prev))}
//                title={isCollapsed? "Hide Replies" : "Show Replies"}
//                > {isCollapsed ? (
//                <svg
//                  xmlns="http:www.w3.org/2000/svg"
//                  fill="none"
//                  viewBox="0 0 24 24"
//                  strokeWidth={2}
//                  stroke="currentColor"
//                  className="w-4 h-4"
//                >
//                  <path
//                    strokeLinecap="round"
//                    strokeLinejoin="round"
//                    d="M19 9l-7 7-7-7"
//                  />
//                </svg>
//              ) : (
//                <svg
//                  xmlns="http:www.w3.org/2000/svg"
//                  fill="none"
//                  viewBox="0 0 24 24"
//                  strokeWidth={2}
//                  stroke="currentColor"
//                  className="w-4 h-4"
//                >
//                  <path
//                    strokeLinecap="round"
//                    strokeLinejoin="round"
//                    d="M5 15l7-7 7 7"
//                  />
//                </svg>
//              )}</button>
//                </div>
//              )}
//                        {/* reply showing  */}
//              { !isCollapsed && (
//                <div>
//                  {comment.children?.map((child, key) => {
//                  return <CommentItem comment={child} key={key} postId={postId} />
//                  })}


//                </div>
//              )}          
//      </div>
//    );
//  };

      // yahan reply kerny ki functionality hai 
 import { useState } from "react";
 import type { fetchCommentsType } from "./Comments";
 import { useAuth } from "../context/AuthContext";
 import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "../supabase-client";


 interface props {
     comment:  fetchCommentsType & {children?: fetchCommentsType[]}
     postId: number
 }


 export const CommentItem = ({comment, postId}: props) => {
    // reply show kerna to hide kerny ki state
   const [showReply, setShowReply] = useState<boolean>(false);
    // reply handling state
   const [replyText, setReplyText] = useState<string>("");
    // replies ko show or hide kenry ki state
   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    // user laya ja rha hai taa k reply kr sakey ya nhi !
   const {user} = useAuth();
   const queryforreply = useQueryClient()
  

      // create comments fucntion
     const createReply = async (replyContent:string,postId:number, parentCommentId:number,userId?:string,author?:string) => {
      if (!userId || !author) {
      throw new Error("you must be logged in to reply");
   }
     const { error } = await supabase.from("comments").insert({
       post_id: postId,content: replyContent, parent_comment_id: parentCommentId, user_id: userId, author: author,
     });
     if (error) throw new Error(error.message);
       }
   const { mutate, isError, isPending } = useMutation({
     mutationFn: (replyContent:string) =>
       createReply(replyContent, postId,comment.id, user?.id, user?.user_metadata?.user_name),
     onSuccess:() => {
        queryforreply.invalidateQueries({queryKey: ["comments", postId],}),
        setReplyText("");
     }
   });
   const handleReplySubmit = (e: React.FormEvent) => {
     e.preventDefault();
      // if (!comment.trim()) return;
     if (!replyText) return;
     mutate(replyText); // calling comments fucntion in handlesubmit
    
   };
   return (
    
     <div className="pl-4 border-l border-white/10">
       <div className="mb-2">
         <div className="flex items-center space-x-2">
           <span className="text-sm font-bold text-blue-400">{comment.author}</span>
           <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
         </div>
         <p className="text-gray-300">{comment.content}</p>
         {/* <button onClick={()=>(setReply((prev) => !prev))}>Reply</button> */}
         <button onClick={()=>(setShowReply(prev => !prev))} className="text-blue-500 text-sm mt-1">{showReply? "Cancle" : "Reply"}</button>
       </div>
       {showReply && user && (
         <form onSubmit={handleReplySubmit} className="mb-2">
               <textarea
                 value={replyText}
                 onChange={(e) => setReplyText(e.target.value)}
                 className="w-full border border-white/10 bg-transparent p-2 rounded"
                 placeholder="Write a Reply..."
                 rows={2}
               />

               <button
                 type="submit"
                 className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
                 disabled={!comment}
               >
                 {isPending ? "Posting..." : "Post Reply"}
               </button>

               {isError && (
                 <p className="text-red-500 mt-2">Error posting Reply.</p>
               )}
             </form>     
       )}
        {comment.children && comment.children.length > 0 && (
               <div>
               {/* <button onClick={()=>(setIsCollapsed(prev => !prev))}>{isCollapsed? "Hide Replies" : "Show Replies"}</button> */}
               <button 
               onClick={()=>(setIsCollapsed(prev => !prev))}
               title={isCollapsed? "Hide Replies" : "Show Replies"}
               > {isCollapsed ? (
               <svg
                 xmlns="http:www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth={2}
                 stroke="currentColor"
                 className="w-4 h-4"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M19 9l-7 7-7-7"
                 />
               </svg>
             ) : (
               <svg
                 xmlns="http:www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth={2}
                 stroke="currentColor"
                 className="w-4 h-4"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M5 15l7-7 7 7"
                 />
               </svg>
             )}</button>
               </div>
             )}
                       {/* reply showing  */}
             { !isCollapsed && (
               <div className="space-y-2">
                 {comment.children?.map((child, key) => {
                 return <CommentItem comment={child} key={key} postId={postId} />
                 })}


               </div>
             )}          
     </div>
   );
 };

