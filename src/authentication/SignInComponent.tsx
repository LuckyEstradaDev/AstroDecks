import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useContext, useState, type FormEvent } from "react"
import axios from "axios"
import Logo from '/images/AstroDecksLogo.svg'
import { Eye, LockKeyhole, Mail } from "lucide-react"
import { AuthContext } from "@/providers/AuthProvider"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

export default function SignInComponent() {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { setAuthenticated } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault()
    try {
      const { status } = await axios.post(`${import.meta.env.VITE_API_URL}/api/protected/sign-in`,{ email, password }, {withCredentials: true});
      if (status == 200) {
        setError(null)
        setSuccess("Logged in successfully")
        setAuthenticated(true)
      }
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="dark:bg-foreground text-black-200 rounded-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-header-font text-center flex items-center justify-center gap-2 mb-2"><div><img src={Logo} alt="AstroDecksLogo" className="min-w-[3rem] h-[3rem] "/> </div>AstroDecks</CardTitle>
          <CardDescription className="text-md">
            Reach for your cards! 🌠
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={e => handleSignUp(e)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                    <div className="grid gap-3 relative">
                      <Mail size={18} className="absolute bottom-[9px] left-3 text-gray-600"/>
                      <Input
                        id="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-10"
                        placeholder="Email"
                        onInvalid={(e) => {
                          e.preventDefault()
                          setError("Email is invalid")
                        }}
                        required
                      />
                    </div>
                    <div className="grid gap-3 relative">
                      <LockKeyhole size={18} className="absolute bottom-[9px] left-3 text-gray-600"/>
                      <Input
                        id="password"
                        placeholder="Password"
                        type={showPassword ? "text": "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="px-10"
                        onInvalid={(e) => {
                          e.preventDefault();
                          setError("Invalid password");
                        }}
                      />
                      <button type="button" className="absolute bottom-[7px] cursor-pointer right-3 text-gray-600" onClick={() => setShowPassword(prev => !prev)}>
                        <Eye size={22}/>
                      </button>
                    </div>
                    <div>
                      {error && <p className="text-red-600">{error}</p>}
                      {success && <p className="text-green-600">{success}</p>}
                    </div>
                    <Button type="submit" className="w-full">
                      {loading ? <>Loading <Spinner key={"circle"} variant={"circle"} /></> : "Sign In"}
                    </Button>
                  </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
