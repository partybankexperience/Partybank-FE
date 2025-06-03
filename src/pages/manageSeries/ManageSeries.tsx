import { useNavigate } from "react-router"
import CreateNewSeries from "../../components/cards/CreateNewSeries"
import SeriesCard from "../../components/cards/SeriesCard"

const ManageSeries = () => {
  const navigate = useNavigate()
  return (
    <div className=" min-h-[80vh]">
      <div className="h-fit grid gap-[18px]">
<h1 className="text-black text-[1.2rem] font-bold">My Series</h1>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        <CreateNewSeries />
        <SeriesCard onEdit={()=>navigate('/manage-series/1')}/>
        <SeriesCard onEdit={()=>navigate('/manage-series/2')}/>
        </div>

      </div>
    </div>
  )
}

export default ManageSeries