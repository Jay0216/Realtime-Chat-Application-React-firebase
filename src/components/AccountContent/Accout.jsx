import { useState } from "react";
import "./setAccount.css"
import {  Button, Image, Input, useToast } from "@chakra-ui/react";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore"
import { firebase_services } from "../FirebaseServices";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { useLocation } from "react-router-dom"


const Account = () => {


  let [step_count, setStepCount] = useState(1)

    
  const [image, setImage] = useState("")
  const [image_url, setImageUrl] = useState("")
  const [first_step, setFirst] = useState(false)

  const [username, setUserName] = useState("")
  const [nickname, setNickName] = useState("")
  const [second_step, setSecond] = useState(false)


  const [download_url, setDownloadUrl] = useState("")

  const firebase_storage = getStorage()




  const get_profile_picture = (e) => {


    const file_types = ["image/jpeg", "image/jpg"]

    if(!file_types.includes(e.target.files[0].type)){
      alert("Please Insert Jpeg or Jpg Files")

      location.reload()
    }else{

      setImageUrl(URL.createObjectURL(e.target.files[0]))

      setImage(e.target.files[0])
      setFirst(true)


    }
    
    

  }

  const upload_profile_picture =  () => {

    const image_ref = ref(firebase_storage, `profileimages/${image.name}`)




    uploadBytes(image_ref, image).then((snapshot) => {
      console.log("Uploaded a Image to Firebase Storage")

      console.log(snapshot)


      
    })


    console.log('Uploaded Your Profile Picture')



  }

  const download_imagedata = () => {

    const image_ref = ref(firebase_storage, `profileimages/${image.name}`)


    getDownloadURL(image_ref)

      .then((url) => {
        setDownloadUrl(url)
        console.log(download_url)
      })

  }


  const get_username = (e) => {

    setUserName(e.target.value)

    setSecond(true)

  }

  const get_nickname = (e) => {

    setNickName(e.target.value)

    setSecond(true)
  }

  const check_first_step = () => {


    if(first_step){

      setStepCount(2)
    }
  }


  const add_profile_image = () => {


    if(image_url == ""){
      alert("Please insert a Image")
    }else{
      check_first_step()

      upload_profile_picture()

    }

    
  }

  const check_second_step = () => {

    if(second_step){

      setStepCount(3)
    }
  }

  const add_userdetails = () => {

    if(username == "" || nickname == ""){
      alert("Please Fill Input Fields..")
    }else{

      check_second_step()

      download_imagedata()
    }

  }

  const toast_alert = useToast()


  const success_toast = () => {

    toast_alert({
      title: 'Profile Settings Done.',
      description: "We've setting up your Profile.",
      status: 'success',
      duration: 9000,
      isClosable: true,
  })
  } 

  const error_toast = () => {

    toast_alert({
      
      title: 'Can"t Setting Up Your Profile',
      description: "Something went wrong",
      isClosable: true,
      status: 'error',
      duration: 9000
    })
  }


  const Db_connection = getFirestore(firebase_services)


  //getting props coming from the Signup Component using useLocation Hook in React Router
  const user_props_location = useLocation()


  //getting state (props object ) of the signup component and also use this user props keys that keys stores that props
  const user_props = user_props_location.state



  const profile_submit = async () => {

    console.log('Profile Submitted..')


    try{

      const Profile_details = await addDoc(collection(Db_connection, "accountDetails"), {

        Firstname: user_props.firstname,
        Lastname: user_props.lastname,
        image_url: download_url,
        nickname: nickname,
        username: username,
        email: user_props.email,
        
      })

      
         

      console.log("Account Settings Done..")
      console.log(Profile_details.id)

      success_toast()

    }catch(e){

      console.log(e)

      error_toast()
    }






  }



  
    return(
 
     <div className="main-cls">
 
 
       <div className="main-content">
 
       <div className="title">
         <h1>Setting up Your Account..</h1>
       </div>
 
       <div className="component">

          {step_count == 1 ? 
          
          <div className="upload-main">

            <div className="main-area">

               <h1>1. Set up Profile Picture</h1>


           <div className="image">

             <Image src={image_url} borderRadius="full" border="1px" width="150px" height="150px"></Image>
           </div>


            <div className="input-area">

              <input onChange={get_profile_picture} type="file" name="file" />


             <Button backgroundColor="green.600" onClick={add_profile_image}>Add</Button>
            </div>
           </div>

         </div>
          
        : null}

          

        { first_step === true && step_count == 2 ? 
          
          
          
          <div className="main-area">



            <h1>2. User Details</h1>


            <div className="input-areas">

              <div className="username-area">

                 <h2>Username</h2>

                 <Input onChange={get_username} className="username" type="text" placeholder="Provide a Username" width="300px"></Input>
              </div>


              <div className="nickname-area">
                   <h2>Nickname</h2>

                   <Input onChange={get_nickname} className="username" type="text" placeholder="Provide a Nickname" width="300px"></Input>

              </div>

              <div className="add-btn-2">

                <Button backgroundColor="green.600" onClick={add_userdetails}>Add</Button>
              </div>

              
            </div>
          </div>  
    
        : null }


        { second_step === true && step_count == 3 ? 
        
          <div className="main-area">


            <h1>3. Finish up Your Account.</h1>



            <div className="tasks-done">

              <h2>1. Profile Picture Uploaded.</h2>
              <h2>2. Username and Nickname Added.</h2>
              <h2>3. Finish Your Account.</h2>
            </div>

            <div className="submit-btn">

              <Button backgroundColor="green.600" onClick={profile_submit} >Submit</Button>
             </div>
           </div> 
        
         : null}
          
         </div>



       


           
     
 
 
       
 
       <div className="step-counter">
 
         <h3>{step_count}/3</h3>
       </div>
 
 
 
 
       </div>
     </div>
    )
   
 
   
 }
 
 
 export default Account