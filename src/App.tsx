import { Route, Routes } from "react-router";
import { Navbar } from "./components/Navbar";
import CreatePostPage from "./pages/CreatePostPage";
import { Home } from "./pages/Home";
import Postpagedetails from "./pages/Postdetailspage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";


const App = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
{/* HOMEPAGE => POSTLIST => POSTCARD ==> POSTPAGEDETAILS => (LIKEBUTTON+COMMNETS)  */}
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
{/* Postpagedetails => postdetails => (like+comments)           */}
          <Route path="/post/:id" element={<Postpagedetails />} />
{/* CreateCommunityPage => CreateCommunity =>            */}
          <Route path="/community/create" element={<CreateCommunityPage/>} />
{/* CommunitiesPage => CommunitiesList => sari communities           */}
          <Route path="/communities/page" element={<CommunitiesPage/>} />
{/* CommunityPage => CommunityDetals =>            */}
          <Route path="/community/:id" element={<CommunityPage/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
