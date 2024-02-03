import { useState, useEffect } from "react";
import "./setAccount.css"
import {  Button, Image, Input, useToast } from "@chakra-ui/react";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore"
import { firebase_services } from "./FirebaseServices";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useLocation, useNavigate } from "react-router-dom"


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

  const [progress, setProgress] = useState("0%")
  const [progress_value, setProgressValue] = useState(0)
  const [button_status, setButtonStatus] = useState("Add")
  const [is_add_btn, setIsAddButton] = useState(false)

  //in the upload profile picture have some bugs in the previous version don't have a progress bar to find uploading
  //profile picture into backend this bug is cuases to uploading picture sometime not uploading correctly
  //for that i implemented a feature for that.
  //in that feature first uploading the profile picture to backend
  //then after upload done it will show 100% on the progress bar and it will show add button
  //click that add button it will show adding to profile
  //it means the profile picture is adding to the profile
  //after finish that it will show added and button also changed as next
  //that next button will take to second step after all done
  //i'm using two separate buttons it will show based on the condition(conditonal rendering)
  //and i use useEffect for download the uploaded image to the profile
  //and then check button text is 'next' it will next users can be change the step
  

  const upload_profile_picture =  () => {

    const image_ref = ref(firebase_storage, `profileimages/${image.name}`)
    const upload_image = uploadBytesResumable(image_ref, image)

    


    upload_image.on('state_changed', 
      (snapshot) => {

        const progress_value_1 =  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(`Uploading to Backend ${parseInt(progress_value_1.toString())}%`)
        setProgressValue(progress_value_1)
        setIsAddButton(true)
        
        
      })


    
    
    


      

      

    
  }

  

  const download_imagedata = () => {

    

    setProgress("Adding to your Profile Please Wait...")

    

    const image_ref = ref(firebase_storage, `profileimages/${image.name}`)

    getDownloadURL(image_ref)

      .then((url) => {
        setDownloadUrl(url)
        console.log(download_url)
        
        
      })

    

    
    
  }

  const [isdownload, setIsDowload] = useState(false)

  const add_profile_pic = () => {

    

    

    if(button_status == "Add"){
      setIsDowload(true)
    }else if(button_status == "Next"){
      check_first_step()
    }
    
  }

  useEffect(() => {


    if(download_url == "" && isdownload){
      download_imagedata()
      
    }else if(download_url != ""){
      console.log(download_url)
      setProgress("Added")
      setButtonStatus("Next")
    }
  }, [download_url, isdownload])


  const get_username = (e) => {

    setUserName(e.target.value)
    setSecond(true)

  }

  const get_nickname = (e) => {

    setNickName(e.target.value)
    setSecond(true)
  }

  const check_first_step = () => {


    if(first_step && progress_value == 100){
      
      setStepCount(2)
    }
  }


  const add_profile_image = () => {


    if(image_url == ""){
      alert("Please insert a Image")
    }
    else{
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


  
  const user_props_location = useLocation()
  const user_props = user_props_location.state


  const navigation_to_login = useNavigate()



  const profile_submit = async () => {

    try{

      const Profile_details = await addDoc(collection(Db_connection, "accountDetails"), {

        Firstname: user_props.firstname,
        Lastname: user_props.lastname,
        image_url: download_url,
        nickname: nickname,
        username: username,
        email: user_props.email,
        
      })

      console.log(Profile_details.id)
      success_toast()

      navigation_to_login("/signin")


    }catch(e){

      console.log(e)
      error_toast()
    }






  }


  //profile picture upload progress feature is implemented



  
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

               <h1 className="step-title">1. Set up Profile Picture</h1>


           <div className="image">

             <Image className="img" src={image_url} borderRadius="full" border="1px"/>
           </div>


            <div className="input-area">

              <input onChange={get_profile_picture} type="file" name="file" />


              {is_add_btn != true ? 
              <Button backgroundColor="green.600" onClick={add_profile_image}>upload</Button> 

              
              : <Button backgroundColor="green.600" onClick={add_profile_pic}>{button_status}</Button>
              
             }


            </div>

            <progress value={progress_value} max="100"></progress>
             <h3>{progress}</h3>
           </div>

         </div>
          
        : null}

          

        { first_step === true && step_count == 2 ? 
          
          
          
          <div className="main-area">



            <h1 className="step-title">2. User Details</h1>


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


            <h1 className="step-title">3. Finish up Your Account.</h1>



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