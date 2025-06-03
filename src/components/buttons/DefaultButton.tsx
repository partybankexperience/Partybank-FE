import React from "react";

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'black'| 'tertiary' ;
  type?: 'default' | 'icon-left' | 'icon-right';
  size?: "normal" | "small";
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  submitType?:"button" | "submit" | "reset" | undefined
};

const DefaultButton = ({
  variant = "primary",
  size = "normal",
  icon,
  children,
  disabled = false,
  onClick,
  type = "default",
  className = "",
  submitType = "button",
}: ButtonProps) => {
    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-pink focus:border-darkRed disabled:bg-mutedBlueGrey disabled:!text-white',
        secondary: ' bg-[#F2F2F2] text-black border-primary hover:text-primary focus:text-darkRed disabled:border-mutedBlueGrey focus:border-darkGrey',
        tertiary: ' hover:text-darkRed bg-white focus:text-darkRed text-primary disabled:border-mutedBlueGrey  focus:border-[1px] focus:border-darkGrey  disabled:!bg-none',
        black: 'bg-black text-white hover:bg-grey focus:bg-grey focus:border-[1px] focus:border-black disabled:bg-mutedBlueGrey disabled:!text-white',
      };
  const baseStyle = "font-[RedHat] font-bold rounded-[8px] text-[16px] w-fit cursor-pointer disabled:cursor-not-allowed disabled:border-mutedBlueGrey disabled:text-mutedBlueGrey";

  const sizeStyle = size === "small" ? "py-[12px] px-[24px] text-[16px]" : "py-[10px] px-[32px]";

  const iconLeft = type === "icon-left" && icon ? (
    <span className="mr-2">{icon}</span>
  ) : null;

  const iconRight = type === "icon-right" && icon ? (
    <span className="ml-2">{icon}</span>
  ) : null;

  return (
    <button type={submitType} className={`${baseStyle} ${sizeStyle} ${variantClasses[variant]} ${className}`} disabled={disabled} onClick={onClick}>
      <div className="flex items-center justify-center">
        {iconLeft}
        {children}
        {iconRight}
      </div>
    </button>
  );
};

export default DefaultButton;

// import { FaCheckCircle } from "react-icons/fa";

// const SampleUsage = () => {
//     return (
//         <div>
//             <DefaultButton
//                 variant="primary"
//                 type="icon-left"
//                 size="small"
//                 icon={<FaCheckCircle />}
//                 disabled={false}
//                 onClick={() => console.log("Button clicked!")}
//             >
//                 Confirm
//             </DefaultButton>
//         </div>
//     );
// };

// export default SampleUsage;
