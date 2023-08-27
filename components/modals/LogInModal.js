import { closeLoginModal, openLoginModal } from "@/redux/modalSlice";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";

export default function LoginModal() {
  const isOpen = useSelector((state) => state.modals.loginModalOpen);
  // Use action functions from reducer props in modalSlice.js
  // use dispatch hook
  const dispatch = useDispatch();
  console.log(isOpen);

  return (
    <>
      <button
        className="bg-transparent border border-white text-white w-[160px] rounded-full h-[40px]
        hover:bg-[#cbd2d7]
        "
        onClick={() => dispatch(openLoginModal())}
      >
        Login
      </button>

      {/* Modal requires 2 props: open, and onClose */}
      <Modal
        //   if true, open modal
        open={isOpen}
        //   onClose prop takes in a function that handles the state of open
        onClose={() => dispatch(closeLoginModal())}
        className="flex justify-center items-center"
      >
        <div
          className="flex justify-center w-[90%] h-[600px] bg-black text-white md:w-[560px] md:h-[600px]
        border border-gray-700 rounded-lg"
        >
          <div className="w-[90%] mt-8 flex flex-col">
            <h1 className="text-center mt-2 font-bold text-4xl">
              Sign into your Account
            </h1>

            <input
              className="h-10 rounded-md mt-8 bg-transparent border border-gray-700 p-6 focus:outline-none"
              placeholder="Email"
              type={"email"}
            />
            <input
              className="h-10 rounded-md mt-8 bg-transparent border border-gray-700 p-6 focus:outline-none"
              placeholder="Password"
              type={"password"}
            />
            <button
              className="bg-white text-black w-full font-bold
            text-lg p-2 mt-8 rounded-md
            "
            >
              Sign In
            </button>
            <h1 className="text-center mt-4 font-bold text-lg">or</h1>
            <button
              className="bg-white text-black w-full font-bold
            text-lg p-2 rounded-md mt-4
            "
            >
              Sign In as Guest
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
