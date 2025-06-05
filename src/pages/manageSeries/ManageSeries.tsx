import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import CreateNewSeries from "../../components/cards/CreateNewSeries"
import SeriesCard from "../../components/cards/SeriesCard"
import { getSeries, deleteSeries } from "../../Containers/seriesApi"

const ManageSeries = () => {
  const navigate = useNavigate()
  const [series, setSeries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSeries = async () => {
    try {
      setLoading(true)
      const response = await getSeries()
      setSeries(response || [])
    } catch (error) {
      console.error("Error fetching series:", error)
      setSeries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeries()
  }, [])

  const handleSeriesCreated = (newSeries: any) => {
    setSeries(prevSeries => [...prevSeries, newSeries])
  }

  const handleSeriesDeleted = async (seriesId: string) => {
    try {
      await deleteSeries(seriesId)
      setSeries(prevSeries => prevSeries.filter(s => s.id !== seriesId))
    } catch (error) {
      console.error("Error deleting series:", error)
    }
  }

  return (
    <div className=" min-h-[80vh]">
      <div className="h-fit grid gap-[18px]">
        <h1 className="text-black text-[1.2rem] font-bold">My Series</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <CreateNewSeries onSeriesCreated={handleSeriesCreated} />
          {loading ? (
            <div className="col-span-full text-center text-grey400">Loading series...</div>
          ) : series.length === 0 ? (
            <div className="col-span-full text-center text-grey400">No series found. Please create one!</div>
          ) : (
            series.map((seriesItem) => (
              <SeriesCard
                key={seriesItem.id}
                title={seriesItem.name}
                description={seriesItem.description}
                onEdit={() => navigate(`/manage-series/${seriesItem.id}`)}
                onDelete={() => handleSeriesDeleted(seriesItem.id)}
                imageUrl={seriesItem.coverImage}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageSeries