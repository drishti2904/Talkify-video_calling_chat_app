import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api.js";
import { MapPinIcon, UsersIcon, SearchIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import NoFriendsFound from "../components/NoFriendsFound.jsx";
import { capitialize } from "../lib/utils.js";
import { getLanguageFlag } from "../components/FriendCard.jsx";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [nativeLangFilter, setNativeLangFilter] = useState("");
  const [learningLangFilter, setLearningLangFilter] = useState("");

  // Filtered Friends
  const filteredFriends = friends.filter((friend) => {
    const nameMatch = friend.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const nativeMatch = nativeLangFilter ? friend.nativeLanguage === nativeLangFilter : true;
    const learningMatch = learningLangFilter ? friend.learningLanguage === learningLangFilter : true;
    return nameMatch && nativeMatch && learningMatch;
  });

  // Get unique languages for filters
  const uniqueNativeLanguages = [...new Set(friends.map((f) => f.nativeLanguage))];
  const uniqueLearningLanguages = [...new Set(friends.map((f) => f.learningLanguage))];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Search friends by name"
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <select
              className="select select-bordered"
              value={nativeLangFilter}
              onChange={(e) => setNativeLangFilter(e.target.value)}
            >
              <option value="">All Native</option>
              {uniqueNativeLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {capitialize(lang)}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered"
              value={learningLangFilter}
              onChange={(e) => setLearningLangFilter(e.target.value)}
            >
              <option value="">All Learning</option>
              {uniqueLearningLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {capitialize(lang)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Friends List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filteredFriends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <ul className="space-y-4">
            {filteredFriends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={friend.profilePic} alt={friend.fullName} />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{friend.fullName}</h3>

                  {friend.location && (
                    <p className="text-sm text-base-content opacity-70 flex items-center gap-1">
                      <MapPinIcon className="size-4" />
                      {friend.location}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <span className="badge badge-secondary">
                      {getLanguageFlag(friend.nativeLanguage)} Native: {capitialize(friend.nativeLanguage)}
                    </span>
                    <span className="badge badge-outline">
                      {getLanguageFlag(friend.learningLanguage)} Learning: {capitialize(friend.learningLanguage)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
