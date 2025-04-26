
const Sales = ({image,name,price,event}:any) => {
  return (
    <div className="flex justify-between items-center">
        <div className="flex gap-[14px] items-center">
            <div className="rounded-full w-[44px] h-[44px]">
                <img src={image} alt={`${name} display picture`} className="rounded-full w-[44px] h-[44px]"/>
            </div>
            <div className="grid font-medium">
                <p className="text-[16px] text-black">{name}</p>
                <p className="text-[14px] text-lightGrey">{event}</p>
            </div>
        </div>
        <p className="text-black text-[16px]">₦ {price}</p>
    </div>
  )
}

export default Sales