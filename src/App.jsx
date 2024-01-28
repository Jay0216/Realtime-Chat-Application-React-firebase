import { ChakraProvider } from "@chakra-ui/react"
import Signup from "./components/Signup"
import Home from "./components/Home"
import Signin from "./components/Signin"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import ChatArea from "./components/Chat"
import Account from "./components/AccountContent/Accout"
import Profile from "./components/Profile"


function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      
         <Route>
           <Route path="/" element={ <Home/> }/>
           <Route path="/signup" element={ <Signup/> }/>
           <Route path="/signin" element={ <Signin/> }/>
           <Route path="/chat" element={ <ChatArea/> }/>
           <Route path="/account" element={ <Account/> }/>
           <Route path="/profile" element={ <Profile/> }/>
          </Route>
        
       
    )
  )

  return (
    <>
      <ChakraProvider>
          <RouterProvider router={router}/>

    </ChakraProvider>
    </>
  )
}

export default App
