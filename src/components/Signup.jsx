import { Box, Button, Input, useToast } from "@chakra-ui/react"
import "./Signup.css"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, addDoc, collection, doc } from "firebase/firestore"
import { firebase_services } from "../components/FirebaseServices"
import { useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {

  
  
  const authentication = getAuth(firebase_services)
  

  //handle the user inputs (with Usestate)
  const [user_email, setEmail] = useState("")
  const [user_password, setPassword] = useState("")

  //handle with useReducer
  const Initial_States = {

    firstname: "",
    lastname: "",
    
  }



  const Reducer_Func = (state, action) => {

    console.log("Reducer Function re-rendered")

    switch(action.type){

      case 'GET_FIRST_INPUT':
        
        
        return{

          ...state,
          firstname: action.usernames,
          
        }
      case 'GET_SECOND_INPUT':
        return{
          ...state,
          lastname: action.usernames
        }
      default:
        return state
    }

    
  }



  


  const [state, dispatch] = useReducer(Reducer_Func, Initial_States)

  
  

  //you need to handle the state of the application


  const navigation = useNavigate()
  

  const Sign_up_process = () => {

    if(user_email == "" || user_password == "" || state.firstname == "" || state.lastname == ""){
      error_toast()
    }else{

    

     console.log("Sign up process start..")

     add_user_details()

     createUserWithEmailAndPassword(authentication, user_email, user_password)

       .then((userCredentials) =>{
          const created_user = userCredentials.user
          console.log(created_user) 
          success_toast()
       })
       .catch((error) => {
          const error_msg = error.message

          console.log(error_msg)
       })

       //set the props to the Account Component using Object

       const User_Data_Prop = {
        firstname: state.firstname,
        lastname: state.lastname,
        email: user_email
       }


       //send that already setted props using navigate hook and it property called state
       navigation('/account', {state : User_Data_Prop})

       

    }
  } 

    
    
  

  


  const add_user_details = async () => {

    

    
     console.log("Start Adding User Data..!!")

     const db_Connection =  getFirestore(firebase_services)

     try{

      const Db_Doc_1 = await addDoc(collection(db_Connection, "userDetails"), {
        Firstname : state.firstname,
        Lastname : state.lastname,
      })

      

      console.log("UserData Stored Successfully")
      console.log("Database Doc ID ", Db_Doc_1.id)
      success_toast()
     }catch(e){
      console.log("Can't Added Data to the Firestore DB..!!", e)
     }


  

  }

  const toast_alert = useToast()


  const success_toast = () => {

    toast_alert({
      title: 'Account created.',
      description: "We've created your account for you.",
      status: 'success',
      duration: 9000,
      isClosable: true,
  })
  } 


  const error_toast = () => {

    toast_alert({
      
      title: 'Can"t Create Account.',
      description: "Fill the All Fields.",
      isClosable: true,
      status: 'error',
      duration: 9000
    })
  }


  
  
    return(

        <div className="main-area-1">

           <div className="main-area-2">

                
            

                <div className="img">
                  <img src="src/assets/Img-01.png" alt="" width="550px" />

                </div>
             
                

                <div>

                    <div className="forms-area">
                      <h1>Get Started with Chatbook</h1>
                      <h3>Already Have an account ? <Link className="link" to="/signin">Login</Link></h3>

                  <div>
                      <div className="first-fields">

                        <div>
                          <Input className="firstname" onChange={(e) => dispatch({type: "GET_FIRST_INPUT" , usernames: e.target.value})} placeholder="First Name" width="120px"></Input>

                        </div>

                        <div>
                          <Input className="lastname" onChange={(e) => dispatch({type: "GET_SECOND_INPUT",  usernames: e.target.value})} placeholder="Last Name" width="120px"></Input>

                        </div>
                      </div>

                       <div>
                          <Input className="email-signup" onChange={(e) => setEmail(e.target.value) } placeholder="Email" width="280px"></Input>
                       </div>

                       <div>
                          <Input className="password-signup" onChange={(e) => setPassword(e.target.value)} placeholder="Password"  width="280px"></Input> 
                       </div>


                       <div>
                          <Button className="signup-btn" onClick={Sign_up_process} loadingText="Creating"  spinnerPlacement="start" backgroundColor="#3BC191" width="280px" >Create account</Button>

                          
                       </div>
                      </div>
                    </div>
                    
                </div>
            </div>
                           
            
        </div>
    )
}


export default Signup