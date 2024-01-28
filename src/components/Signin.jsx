import { Button, Input, useToast } from "@chakra-ui/react"
import "./Signin.css"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { firebase_services } from "./FirebaseServices"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const Signin = () => {
    

    const sign_in_auth = getAuth(firebase_services)


    const [signin_email, setSigninEmail] = useState("")
    const [signin_password, setSigninPassword] = useState("")

    const navigation_hook = useNavigate()

    const Sign_in_process = async () => {


        console.log("Sign in Process Started...")


        if(signin_email == "" || signin_password == ""){

            input_err_toast()

        }else{

        

         try{

            const Signin = await signInWithEmailAndPassword(sign_in_auth, signin_email, signin_password)
        

            console.log(Signin.user)

            success_toast()

            navigation_hook("/profile", {state : signin_email})



            
         }catch(e){

            console.log(e)

            credntials_err_toast()
         }

        }


    
    }



    const toast = useToast()

    const input_err_toast = () => {


        toast({

            status: 'error',
            title: "Can't Login..",
            isClosable: true,
            description: "Please Fill the Input Fields..",
            duration: 9000
        })
    }


    const credntials_err_toast = () => {


        toast({

            status: 'error',
            title: "Can't Login..",
            isClosable: true,
            description: "Please Check Your Credentials Again..",
            duration: 9000
        })
    }


    const success_toast = () => {

        toast({

            status: 'success',
            title: "Successfully Login..",
            description: "Your Credentials are Matched..",
            duration: 9000,
            isClosable: true
        })
    }



    return(

        <div className="main">


            <div className="main-class">

                
            

                <div className="img-area">
                  
                  <img  src="src/assets/Img-03.png" alt="" width="550px" />

                </div>
             
                

                <div>

                    <div className="form-fields">
                      <h1>Enjoy the Chat.</h1>
                      <h3>Login into your Account</h3>
    

                  <div>
                      

                       <div>
                          <Input  className="email" onChange={(e) => setSigninEmail(e.target.value)} placeholder="Email" width="280px"></Input>
                       </div>

                       <div>
                          <Input  className="password" onChange={(e) => setSigninPassword(e.target.value)}  placeholder="Password" width="280px"></Input> 
                       </div>


                       <div >
                          <Button className="signin-btn" onClick={Sign_in_process} backgroundColor="#3BC191" width="280px">Sign in</Button>
                       </div>
                      </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}




export default Signin