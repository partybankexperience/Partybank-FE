import line from '../../../assets/images/cardLine.svg';
const Card = ({ icon, title, text }: any) => {
  return (
    <div className="bg-white grid md:flex  items-center gap-[.5rem] rounded-[15px]  p-[.5rem] relative overflow-hidden">
      <div className="rounded-md p-[.8rem] w-fit bg-[#fce4e8]">{icon}</div>
      <div className="grid">
        <p className="text-black text-[1rem] font-medium">{title}</p>
        <p className="text-lightGrey text-[.8rem]">{text}</p>
      </div>
      <div className="absolute top-0 right-0 p-0 m-0">
        <img src={line} alt="" className="w-24 h-auto object-contain" />
      </div>
    </div>
  );
};

export default Card;
