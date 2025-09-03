// idr hum community ki details show kerien gye yani post or sb kuch
// CommunityPage => Communitypagepost => {posr dikhaye ga community ki}
import { useParams } from "react-router";
import { CommunityPagePosts } from "../components/CommunityPagePosts";



export const CommunityPage = () => {
    const {id} = useParams<string>();
  return (
    <div className="pt-20">
    <CommunityPagePosts communityId={Number(id)}/>      
  
    </div>
  );
};
