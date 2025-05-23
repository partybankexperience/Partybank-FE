
const Card = ({icon,title,text}:any) => {
  return (
    <div className="bg-white grid md:flex  items-center gap-[18px] rounded-[15px] p-[20px]">
        <div className="rounded-md p-[12px] w-fit bg-[#fce4e8]">
            {icon}
        </div>
        <div className="grid">
            <p className="text-black text-[1.2rem] font-medium">{title}</p>
            <p className="text-lightGrey text-[.8rem]">{text}</p>
        </div>

    </div>
  )
}

export default Card