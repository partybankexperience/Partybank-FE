const Sales = ({ image, name, price, event }: any) => {
  return (
    <div className="flex justify-between items-center gap-[1.2em] py-[0.5em]">
      <div className="flex gap-[.6em] items-center">
        <div className="rounded-full w-[44px] h-[44px] overflow-hidden shrink-0">
          <img src={image} alt={`${name} display picture`} className="w-full h-full object-cover" />
        </div>
        <div className="grid font-medium">
          <p className="text-[.8em] text-black">{name}</p>
          <p className="text-[.7em] text-lightGrey">{event}</p>
        </div>
      </div>
      <p className="text-black text-[.6em] whitespace-nowrap shrink-0">₦ {price}</p>
    </div>
  );
};

export default Sales;
