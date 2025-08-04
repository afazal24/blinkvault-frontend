import { useState } from "react";
import PostCard from "../components/PostCard";

const dummyPosts = [
  {
    id: 1,
    title: "Trending Post Title",
    content: "This is the content of a trending post on BlinkVault.",
  },
  {
    id: 2,
    title: "Latest Post Title",
    content: "This is the content of a latest post on BlinkVault.",
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("trending");

  const filteredPosts = activeTab === "trending"
    ? [dummyPosts[0]]
    : [dummyPosts[1]];

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l-full ${activeTab === "trending" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
        </button>
        <button
          className={`px-4 py-2 rounded-r-full ${activeTab === "latest" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
          onClick={() => setActiveTab("latest")}
        >
          Latest
        </button>
      </div>

      {filteredPosts.map((post) => (
        <PostCard key={post.id} title={post.title} content={post.content} />
      ))}
    </div>
  );
};

export default Home;