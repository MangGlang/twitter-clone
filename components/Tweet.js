import { db } from "@/firebase";
import {
  openCommentModal,
  openLoginModal,
  setCommentTweet,
} from "@/redux/modalSlice";
import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  TrashIcon,
  UploadIcon,
} from "@heroicons/react/outline";

import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";

import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";

export default function Tweet({ data, id }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  async function deleteTweet(e) {
    e.stopPropagation();

    // how to delete a document --> delete tweet
    // deleteDoc(x,y); x = pass in ref into doc
    await deleteDoc(doc(db, "posts", id));
  }

  async function likeComment(e) {
    e.stopPropagation();

    // if user is not signed in, dispatch action to show login modal
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    // check if elem is in array
    if (likes.includes(user.uid)) {
      // if uid is in current array then remove uid from likes array
      // use firebase function
      await updateDoc(doc(db, "posts", id), {
        likes: arrayRemove(user.uid),
      });
    }
    // update document in firebase db to include uid
    // get uid using user data
    // updateDoc(x, y); x = update path to document, y = argument to update; in this case, update likes array
    // doc(x,y, z); x = db path, y = collection, z = document referenced by id
    else {
      await updateDoc(doc(db, "posts", id), {
        likes: arrayUnion(user.uid),
      });
    }
  }

  // useEffect to check whether or not user UID is already in likes array; if not, remove like
  // useSnap function ==> listener that listens to changes in document
  // if doc changes, gets reflected in our app instantly (without needing to refresh)
  useEffect(() => {
    if (!id) return;

    // onSnapshot(x, y); x = document reference, y = callback function where doc is returned
    // once you call doc.data function, access to data will be available
    const unsubscribe = onSnapshot(doc(db, "posts", id), (doc) => {
      setLikes(doc.data()?.likes);
      setComments(doc.data()?.comments);
    });

    return unsubscribe;
  }, []);

  return (
    <div
      // pushing id of tweet to route to dynamic page
      onClick={() => router.push("/" + id)}
      className="border-b border-gray-700 cursor-pointer"
    >
      <TweetHeader
        username={data?.username}
        name={data?.name}
        // Error: Objects are not valid as a React child (found: object with keys {seconds, nanoseconds}).
        // If you meant to render a collection of children, use an array instead.
        // error shows up because timestamp is an object, not a string; must turn into a string
        timestamp={data?.timestamp?.toDate()}
        text={data?.tweet}
        photoUrl={data?.photoUrl}
        image={data?.image}
      />
      <div className="p-3 ml-16 text-gray-500 flex space-x-14">
        <div
          className="flex items-center justify-center space-x-2"
          onClick={(e) => {
            // prevents event from being handled by parent component if a child component handles it
            // in this case, prevents dynamic routing to id if clicking on just comment section
            e.stopPropagation();

            if (!user.username) {
              dispatch(openLoginModal());
              return;
            }

            dispatch(
              setCommentTweet({
                id: id,
                tweet: data?.tweet,
                photoUrl: data?.photoUrl,
                name: data?.name,
                username: data?.username,
              })
            );
            dispatch(openCommentModal());
          }}
        >
          <ChatIcon className="w-5 cursor-pointer hover:text-green-400 " />
          {comments?.length > 0 && <span>{comments.length}</span>}
        </div>
        <div
          onClick={likeComment}
          className="flex items-center justify-center space-x-2"
        >
          {likes.includes(user.uid) ? (
            <FilledHeartIcon className="w-5 text-pink-500" />
          ) : (
            <HeartIcon className="w-5 cursor-pointer hover:text-pink-400 " />
          )}
          {likes.length > 0 && <span>{likes.length}</span>}
        </div>

        {/* Deleting a tweet: Conditionally render delete icon if tweet uid === user id */}
        {user.uid === data?.uid && (
          <div
            className="cursor-pointer hover:text-red-600"
            onClick={deleteTweet}
          >
            <TrashIcon className="w-5" />
          </div>
        )}
        <ChartBarIcon className="w-5 cursor-not-allowed" />
        <UploadIcon className="w-5 cursor-not-allowed" />
      </div>
    </div>
  );
}

export function TweetHeader({
  username,
  name,
  timestamp,
  text,
  photoUrl,
  image,
}) {
  return (
    <div className="flex space-x-3 p-3 border-gray-700">
      <img className="w-11 h-11 rounded-full object-cover" src={photoUrl} />
      <div>
        <div className="text-gray-500 flex items-center space-x-2 mb-1">
          <h1 className="text-white font-bold">{name}</h1>
          <span>@{username}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <Moment fromNow>{timestamp}</Moment>
        </div>

        <span>{text}</span>

        {/* conditionally render img if exists */}
        {image && <img className="object-cover border border-gray-700 rounded-md mt-3 max-h-80" src={image} />}
      </div>
    </div>
  );
}
