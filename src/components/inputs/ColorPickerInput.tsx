
import { useState } from 'react';
import { SketchPicker } from 'react-color';

type ColorPickerInputProps = {
  id: string;
  label: string;
  value: string;
  setValue: (value: string) => void;
  classname?: string;
};

const ColorPickerInput = ({
  id,
  label,
  value,
  setValue,
  classname = ''
}: ColorPickerInputProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const currentColor = value || '#3B82F6';

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  return (
    <div className={`grid gap-1 w-full relative ${classname}`}>
      <label className="text-[#231F20] text-[16px] font-semibold font-[RedHat]">
        {label}
      </label>
      <div className="relative">
        <div 
          className="w-full h-[44px] border-[1px] border-neutral rounded-[4px] px-[16px] py-[10px] cursor-pointer flex items-center gap-3 hover:border-lightPurple focus:border-lightPurple bg-white"
          onClick={togglePicker}
        >
          <div 
            className="w-6 h-6 border border-gray-300 rounded"
            style={{ backgroundColor: currentColor }}
          ></div>
          <span className="text-[14px] text-black font-[RedHat]">
            {currentColor}
          </span>
        </div>
        
        {showPicker && (
          <div className="absolute top-full left-0 z-50 mt-2">
            <div 
              className="fixed inset-0" 
              onClick={closePicker}
            ></div>
            <div className="relative">
              <SketchPicker
                color={currentColor}
                onChange={(color) => setValue(color.hex)}
                disableAlpha={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPickerInput;
