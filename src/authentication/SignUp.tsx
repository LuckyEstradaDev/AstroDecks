import { useContext, useEffect } from "react"
import SignUpComponent from "./SignUpComponent"
import { useNavigate } from "react-router"
import { AuthContext } from "@/providers/AuthProvider"
import LoadingComponent from "@/components/ReusableComponents/LoadingComponent"

function App() {

  const { authenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  
    useEffect(() => {
      if (authenticated) {
        navigate('/my-decks')
      }
    }, [authenticated])

  return (
    <main className='flex justify-center h-screen items-center bg-background'>
      <div className="max-w-[25rem] w-[25rem]">
        { authenticated || authenticated == null ? (
          <LoadingComponent></LoadingComponent>
        ) : (
          <SignUpComponent></SignUpComponent>
        )}
      </div>
    </main>
  )
}

export default App
