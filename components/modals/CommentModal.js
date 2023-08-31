import { db } from "@/firebase";
import { closeCommentModal } from "@/redux/modalSlice";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import Modal from "@mui/material/Modal";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CommentModal() {
  const isOpen = useSelector((state) => state.modals.commentModalOpen);
  const userImg = useSelector((state) => state.user.photoUrl);
  const tweetDetails = useSelector((state) => state.modals.commentTweetDetails);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [comment, setComment] = useState("");

  const router = useRouter();

  async function sendComment() {
    // get id of tweet, and update document in firebase;
    // update with an array, which will hold all comments
    // DocRef is required, which can be obtained by the id of the tweet; obtain from onChange event
    const docRef = doc(db, "posts", tweetDetails.id);
    const commentDetails = {
      username: user.username,
      name: user.name,
      photoUrl: user.photoUrl,
      comment: comment,
    };
    await updateDoc(docRef, {
      // in object, pass in what you want to update; which is adding a comments array, similar to "likes" array
      // upon user writing, update document to have comment field
      // add commentDetails into comments array using firebase array union; add element into an array
      comments: arrayUnion(commentDetails),
    });

    dispatch(closeCommentModal())
    // upon tweeting, push user to new route using id of tweet
    router.push("/" + tweetDetails.id);
  }

  return (
    <>
      {/* modal from materialUI */}
      <Modal
        className="flex justify-center items-center"
        open={isOpen}
        onClose={
          // use dispatch hook
          () => dispatch(closeCommentModal())
        }
      >
        <div
          className="w-full h-full text-white sm:w-[600px] sm:h-[386px] rounded-lg bg-black border border-gray-500
        sm:p-10 p-4 relative"
        >
          <div
            className="absolute w-[2px] h-[77px] bg-gray-500
          left-[40px] top-[96px] sm:left-[64px] sm:top-[120px]"
          ></div>
          <div
            onClick={() => dispatch(closeCommentModal())}
            className="absolute top-4 cursor-pointer"
          >
            <XIcon className="w-6" />
          </div>

          <div className="mt-8">
            {/* original tweet */}
            <div className="flex space-x-3">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={tweetDetails.photoUrl}
              />
              <div>
                <div className="flex space-x-1.5">
                  <h1 className="font-bold">{tweetDetails.name}</h1>
                  <h1 className="text-gray-500">@{tweetDetails.username}</h1>
                </div>
                <p className="mt-1">{tweetDetails.tweet}</p>
                <h1 className="text-gray-500 text-[15px] mt-2">
                  Replying to{" "}
                  <span className="text-[#1b9bf0]">
                    @{tweetDetails.username}
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* tweet reply text-area */}
          <div className="mt-11">
            <div className="flex space-x-3">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={userImg}
              />

              <div className="w-full">
                <textarea
                  className="w-full bg-transparent resize-none text-lg outline-none"
                  placeholder="Tweet your reply"
                  onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex justify-between border-t border-gray-700 pt-2">
                  <div className="flex space-x-0">
                    <div className="iconsAnimation">
                      <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="iconsAnimation">
                      <ChartBarIcon className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="iconsAnimation">
                      <EmojiHappyIcon className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="iconsAnimation">
                      <CalendarIcon className="h-[22px] text-[#1d9bf0]" />
                    </div>
                    <div className="iconsAnimation">
                      <LocationMarkerIcon className="h-[22px] text-[#1d9bf0]" />
                    </div>
                  </div>
                  <button
                    className="bg-[#1d9bf0] rounded-full px-4 py-1.5
                  disabled:opacity-50 disabled:cursor-not-allowed
                  "
                    // disable button to prevent empty strings from being tweeted
                    disabled={!comment}
                    onClick={sendComment}
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </Modal>
    </>
  );
}
