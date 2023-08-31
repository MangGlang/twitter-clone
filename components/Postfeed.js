import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import TweetInput from "./TweetInput";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

export default function Postfeed() {
  // tweets = array full of our docs from collection
  const [tweets, setTweets] = useState([]);
  // To display tweets, need useEffect and snapshot to get all posts from collections
  useEffect(() => {
    // get all posts and order by descending order
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // callback function = access to snapshot; which contains our documents
      // array of all documents
      setTweets(snapshot.docs);
    });

    // unsubscribe from listener so its not always on
    return unsubscribe;
  }, []);

  return (
    <div
      className="sm:ml-16 xl:ml-[350px] max-w-2xl flex-grow
        border-gray-700 border-x"
    >
      <div
        className="px-3 py-2 text-lg sm:text-xl font-bold border-b border-gray-700
      sticky top-0 z-50"
      >
        Home
      </div>
      <TweetInput />
      {tweets.map((tweet) => {
        return <Tweet key={tweet.id} id={tweet.id} data={tweet.data()} />;
      })}
      <Tweet />
    </div>
  );
}
