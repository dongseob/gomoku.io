// import { Link } from "react-router-dom"
import { getClientId } from "../../script";

const Home = () => {
  const clientId = getClientId();
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">gomoku.io</h1>
            <div className="flex flex-col gap-2">
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black">Quick Game</button>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black">Custom Game</button>
            </div>
        </div>

        <div className="absolute top-2 left-2 text-sm">Client ID: {clientId}</div>
        <div className="absolute top-2 right-2 text-sm">by dongseob</div>
    </div>
  )
}

export default Home