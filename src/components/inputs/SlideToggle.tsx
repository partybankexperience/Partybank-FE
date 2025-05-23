import { useState } from "react";

const SlideToggle = ({toggle}:any) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => {setIsOn(!isOn) ; toggle(!isOn)}}
      className={`relative w-[45px] h-[26px] rounded-full px-[2px] cursor-pointer py-[3px] transition-colors duration-300 ${
        isOn ? "bg-red" : "bg-gray-400"
      }`}
    >
      <span
        className={`block w-[20px] h-[20px] rounded-full bg-white shadow-md transition-transform duration-300 ${
          isOn ? "translate-x-[19px]" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default SlideToggle;
