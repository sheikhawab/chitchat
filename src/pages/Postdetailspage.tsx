import { useParams } from "react-router";
import { Postdetails } from "../components/Postdetails";

// Postpagedetails(P) => postdetails(C) => (like+comments(C))

const Postpagedetails = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-10">
      <Postdetails propsForPostdetailsPage={Number(id)} />
      
    </div>
  );
};

export default Postpagedetails;
