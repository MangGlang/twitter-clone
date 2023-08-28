import { closeSignUpModal, openSignUpModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { setUser } from "@/redux/userSlice";
import { useRouter } from "next/router";


export default function SignUpModal() {
  const isOpen = useSelector((state) => state.modals.signUpModalOpen);
  // Use action functions from reducer props in modalSlice.js
  // use dispatch hook
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  async function handleSignUp() {
    // import firebase function; import createUserWithEmailAndPassword
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // one user signs up, use update profile function from firebase
    // updateProfile(x,y) => x = currentUser, y = object with props that u want to change
    await updateProfile(auth.currentUser, {
      displayName: name,
      // randomize PFP of user by rounding up value based on random number from 0 - 6
      photoURL: `./assets/profilePictures/pfp${Math.ceil(Math.random() * 6)}.png`
    })

    router.reload();
  }

  useEffect(() => {
    // Firebase function onAuthStateChange --> Listener to see if user is logged in/out
    // Checks because if user just created account, we want to log them in; should already be logged in after creating account
    // function knows whether or not user has signed up & returns currentUser information
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // if no user signed in, return
      if (!currentUser) return;

      // if there is a user, take all information and put into redux slice; to access globally
      // handle redux actions
      console.log(currentUser);
      dispatch(
        setUser({
          username: currentUser.email.split("@")[0],
          // since signing up with email & password, display name will not be available
          // unlike google sign-in, which takes displayname
          name: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
          photoUrl: currentUser.photoURL,
        })
      );
    });

    // turns off listener so that listener does not use additional resources
    return unsubscribe;
  }, []);

  return (
    <>
      <button
        className="bg-white text-black w-[160px] rounded-full h-[40px] hover:bg-[#cbd2d7]"
        onClick={() => dispatch(openSignUpModal())}
      >
        Sign Up
      </button>

      {/* Modal requires 2 props: open, and onClose */}
      <Modal
        //   if true, open modal
        open={isOpen}
        //   onClose prop takes in a function that handles the state of open
        onClose={() => dispatch(closeSignUpModal())}
        className="flex justify-center items-center"
      >
        <div
          className="flex justify-center w-[90%] h-[600px] bg-black text-white md:w-[560px] md:h-[600px]
        border border-gray-700 rounded-lg"
        >
          <div className="w-[90%] mt-8 flex flex-col">
            <button
              className="bg-white text-black w-full font-bold
            text-lg p-2 rounded-md
            "
            >
              Sign In as Guest
            </button>
            <h1 className="text-center mt-4 font-bold text-lg">or</h1>
            <h1 className="text-center mt-2 font-bold text-4xl">
              Create your Account
            </h1>
            <input
              className="h-10 rounded-md mt-8 bg-transparent border border-gray-700 p-6 focus:outline-none"
              placeholder="Full Name"
              type={"text"}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="h-10 rounded-md mt-8 bg-transparent border border-gray-700 p-6 focus:outline-none"
              placeholder="Email"
              type={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="h-10 rounded-md mt-8 bg-transparent border border-gray-700 p-6 focus:outline-none"
              placeholder="Password"
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-white text-black w-full font-bold
            text-lg p-2 mt-8 rounded-md
            "
              onClick={handleSignUp}
            >
              Create account
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
