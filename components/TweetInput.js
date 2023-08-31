import { db, storage } from "@/firebase";
import { openLoginModal } from "@/redux/modalSlice";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TweetInput() {
  const user = useSelector((state) => state.user);

  // text to send into firebase database using async function below
  const [text, setText] = useState("");

  // if user selects an image, display image in div;
  // image will be set to a string ==> string of path to image; and then display
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const dispatch = useDispatch();

  async function sendTweet() {

    if (!user.username) {
      // if user not available, dispatch user login modal
      dispatch(openLoginModal())
      return
    }

    setLoading(true);
    // add document into firebase
    // addDoc(x,y); x = where we want document to be in, so which collection to add into
    // y = object with what information we want to put inside the document
    const docRef = await addDoc(collection(db, "posts"), {
      // Tweet details
      username: user.username,
      name: user.name,
      photoUrl: user.photoUrl,
      uid: user.uid,
      timestamp: serverTimestamp(),
      likes: [],
      tweet: text,
    });
    // check if image is uploaded by user
    if (image) {
      // create imageRef to upload into firebase storage
      // ref(x,y); x = storage, y = string(path to image in storage)
      const imageRef = ref(storage, `tweetImages/${docRef.id}`);

      // now, upload img to storage; use firebase "uploadString(x,y,z) function"; x = imageRef, y = image, z = data format
      const uploadImage = await uploadString(imageRef, image, "data_url");
      // once image is uploaded into storage, get download url of img to show in tweet
      // use imageRef to get download URL of the image we just uploaded
      const downloadURL = await getDownloadURL(imageRef);

      // display in tweet: update tweet to have img inside tweet
      await updateDoc(doc(db, "posts", docRef.id), {
        // add image field
        image: downloadURL,
      });
    }

    setText("");
    setImage(null);
    setLoading(false);
  }

  function addImageToTweet(e) {
    // Open file reader & read image that user just opened; and turn it into a url path to display

    // check if user has selected a file to upload; which is first file of [0]
    const reader = new FileReader();
    if (e.target.files[0]) {
      // if file exists, read first file as a URL
      reader.readAsDataURL(e.target.files[0]);
    }
    // set url above to image
    // add event listener to reader; result of what file reader read
    reader.addEventListener("load", (e) => {
      setImage(e.target.result);
    });
  }

  return (
    <div className="flex space-x-3 p-3 border-b border-gray-700">
      <img
        className="w-11 h-11 rounded-full object-cover"
        src={user.photoUrl || "/assets/twitter-logo.png"}
      />

      {loading && <h1 className="text-2xl text-gray-500">Uploading Post...</h1>}

      {/* only render div if not loading */}
      {!loading && (<div className="w-full">
        <textarea
          placeholder="What's on your mind?"
          className="bg-transparent resize-none outline-none w-full
        min-h-[50px] text-lg"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        {/* conditionally render img if img exists */}
        {image && (
          <div className="relative mb-4" onClick={() => setImage(null)}>
            <div className="absolute top-1 left-1 cursor-pointer bg-[#272c26] rounded-full w-8 h-8 flex justify-center items-center hover:bg-white hover:bg-opacity-10">
              <XIcon className="h-5" />
            </div>
            <img className="rounded-2xl max-h-80 object-contain" src={image} />
          </div>
        )}

        <div className="flex justify-between border-t border-gray-700 pt-4">
          {/* ICONS DIV */}
          <div className="flex space-x-0">
            <div
              // Basically, if user clicks on PhotographIcon, we get that ref value and
              // it makes it seem like we clicked on the "input";
              onClick={() => filePickerRef.current.click()}
              className="iconsAnimation"
            >
              <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
            </div>
            {/* Uploding pictures/videos; hidden to hide element; use useRef hook to reference input field */}
            <input
              ref={filePickerRef}
              onChange={addImageToTweet}
              className="hidden"
              type="file"
            />

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
            onClick={sendTweet}
            // if input field empty from both fields, disable button
            disabled={!text && !image}
            className="bg-[#1d9bf0] rounded-full px-4 py-1.5
            disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Tweet
          </button>
        </div>
      </div>)}
    </div>
  );
}
