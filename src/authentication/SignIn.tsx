import { useContext, useEffect } from "react"
import SignInComponent from "./SignInComponent"
import { AuthContext } from "@/providers/AuthProvider"
import { useNavigate } from "react-router-dom"
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
      <div className="max-w-[25rem] w-[25rem] md:mx-2">
        { authenticated || authenticated == null ? (
          <LoadingComponent></LoadingComponent>
          ) : (
          <SignInComponent></SignInComponent>
        )}
      </div>
    </main>
  )
}

export default App
