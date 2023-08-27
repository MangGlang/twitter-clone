import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, LocationMarkerIcon, PhotographIcon } from "@heroicons/react/outline";

export default function TweetInput() {
  return (
    <div className="flex space-x-3 p-3 border-b border-gray-700">
      <img
        className="w-11 h-11 rounded-full object-cover"
        src="/assets/kylie.png"
      />
      <div className="w-full">
        <textarea
          placeholder="What's on your mind?"
          className="bg-transparent resize-none outline-none w-full
        min-h-[50px] text-lg"
        />

        <div className="flex justify-between border-t border-gray-700 pt-4">
          {/* ICONS DIV */}
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

          <button className="bg-[#1d9bf0] rounded-full px-4 py-1.5">Tweet</button>
        </div>
      </div>
    </div>
  );
}
