import { Button, Input } from "@chakra-ui/react"
import "./Profile.css"
import { useEffect, useState, useRef } from "react"
import {getDocs, collection, getFirestore, query, where, addDoc, onSnapshot} from "firebase/firestore"
import { firebase_services } from "./FirebaseServices"
import { useLocation, useNavigate } from "react-router-dom"

const Profile = () => {

    


    

    const db = getFirestore(firebase_services)

    const signin_email_prop = useLocation()


    const signin_email = signin_email_prop.state



    const [data, setData] = useState([])

    const [user_ids, setUserIDS] = useState([])


    const fetch_all_profile_data =  async () => {


      try{


      const read_loggedout_profiles = query(collection(db, "accountDetails"), where("email", "!=", signin_email))  

      

      const readData = await getDocs(read_loggedout_profiles)

      const fetched_data = []

      const fetched_id = []

          readData.forEach((data_docs) => {

            //console.log(data_docs.data())

            console.log("Doc ID" + data_docs.id)

            let backend_data = data_docs.data()

            fetched_data.push(backend_data)

            fetched_id.push(data_docs.id)
          })

          setUserIDS(fetched_id)

          setData(fetched_data)

      }catch(e){
        console.log(e)
      }
    }

    //const [user_collection, setUserCollection] = useState([])

    //const fetch_user_data = async () => {

      //console.log("Fetching User Data")

      //const dummy_user_collection = []


      //const readUser = await getDocs(collection(db, "userDetails"))
      

      //try{

      
      //readUser.forEach((user_docs) => {

        //console.log(user_docs.data())

        //console.log("User Docs ID's" + user_docs.id)

        //let user_data = user_docs.data()


       // dummy_user_collection.push(user_data)

      //})

      //setUserCollection(dummy_user_collection)

     // }catch(e){
       // console.log(e)
      //}
//
    //}

    const [loggeduser, setLoggedUser] = useState([])

    const [user_doc_id, setUserDocID] = useState()

    const [user, setUsername] = useState("")

    
    

    const fetch_user_profile_data = async () => {

      


      const logged_user_data = []

      



      const read_user_query = query(collection(db, "accountDetails"), where("email", "==", signin_email))

      const read_user = await getDocs(read_user_query)

      read_user.forEach((user_profile) => {

        let fetched_profile = user_profile.data()

        let fetched_profile_id = user_profile.id

        logged_user_data.push(fetched_profile)

        setUserDocID(fetched_profile_id)
        
 

      })

      setLoggedUser(logged_user_data)

      setUsername(logged_user_data[0].Firstname)


      



    }

    const [already_added, setAlreadyAdded] = useState([])


    const get_already_added_friends = async () => {

      console.log("Finding Already Added Friends")


      const find_added_friends_query = query(collection(db, "friendsBook"), where("added_user", "==", user))

      const find_added_friends = await getDocs(find_added_friends_query)

      let added_profiles_data = []


        find_added_friends.forEach((profiles) => {

          

            let profiles_data = profiles.data().friend_id

            added_profiles_data.push(profiles_data)



            
            
        })

        setAlreadyAdded(added_profiles_data)

    } 

  
    

    
    
    



    useEffect(() => {

      fetch_all_profile_data()

      //fetch_user_data()

      fetch_user_profile_data()

      

      
    }, [])

    //in this case the get already method is executing after the user profile's username is fetched that why i'm passing the 
    //username (user) as the dependecny array of useEffect hook if its fetching with above useEffect hook the 
    //not fetching freindsBook data properly.

    useEffect(() => {

      get_already_added_friends()
    }, [user])


    



    const [nickname, setNickName] = useState("")

    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [image_url, setProfileImage] = useState("")


    const [index, setIndex] = useState(0)
    

    let [profile_clicked, setProfileClicked] = useState(false)

    const[id, setIDs] = useState()

    const view_user = (index) => {

      console.log("User Clicked")


      //if(ar_counter < 2){

         //setArrayCounter(ar_counter + 1)

         //setNickName(data[ar_counter].nickname)


      //}else{

        //console.log("Array is Over..")
      //}

      //console.log(data[ar_counter].nickname)

      
      


      if(index !== undefined && index < data.length ){

        setNickName(data[index].nickname)

        console.log(data[index].nickname)

        setFirstName(data[index].Firstname)
        setLastName(data[index].Lastname)


        setProfileImage(data[index].image_url)

        setIndex(index)

        setProfileClicked(true)

        console.log(profile_clicked)

        menu_close()

        

        view_friends_id(index)

        
        

      }else{

        console.log("Array is Over..")
      }


    






      
     
    }


    const view_friends_id = (doc_index) => {

      if(doc_index !== undefined && doc_index < user_ids.length){
        console.log(user_ids[doc_index])

        setIDs(user_ids[doc_index])

        mark_add_friends(user_ids[doc_index])

      }else{
        console.log("ID Not Found")
      }
    }



    


    const your_profile = () => {

      console.log("Your Profile Clicked")

      console.log("Logged User", loggeduser)

      //console.log(user_doc_id)

      console.log("Other Profiles", data[index])

      console.log(loggeduser[0].Firstname)

      

      


      //load the login profile details
    }

    
    

    const navigation = useNavigate()


    const chat_page = () => {


      //send the username of account
      const all_props = {
        
        id: user_doc_id,
        f_name: loggeduser[0].Firstname
      }


      navigation('/chat', {state: all_props})

    }



    let [ismenu_clicked, setIsMenuClicked] = useState(false)

    let [width, setWidth] = useState(window.innerWidth)

    //let [ismobile_width, setIsMobileWidth] = useState(false)

    

    const getClass = useRef(null)


    const styles = {
      right: '200px'
    }

    const menu_open = () => {

      const use_class = getClass.current


      console.log("Menu Clicked")

      setIsMenuClicked(true)

      console.log(ismenu_clicked)


      use_class.style.left = '0px'

      
      
    
      

      
      

      

    }


    const menu_close = () => {

      console.log("Menu Closed")

      const list_class = getClass.current

      list_class.style.left = '-300px'

      

      
    }

    

    

    useEffect(() => {

      const handle_width = () => {

        



        setWidth(window.innerWidth)

        console.log(width)

        

        //if(width <= 600){
          
          //setIsMobileWidth(true)

          

          

          //console.log(ismobile_width)

        //}else if(width == 1280){
          

          //setIsMobileWidth(false)
        //}


        
        
        
      }

      

      


      window.addEventListener('resize', handle_width)



      
      

      



    }, [width])



    const [searchinput, setSearchInput] = useState("")

    const handle_search_input = (e) => {


      console.log("Handle Search Input")

      setSearchInput(e.target.value)


      

      

      


    }


    const search_users = () => {

      

     if(searchinput == ""){
       console.log("Search Input Reseted")

       fetch_all_profile_data()
     }else{

       const search_result = data.filter(profiles => profiles.username.includes(searchinput))

       setData(search_result)

       console.log("Search User Found")

     }

      

      //use array filter method effectively





    }

    

    useEffect(() => {

      search_users()

    }, [searchinput])


    


    



    const [add_status, setAddStatus] = useState("Add to Book")

    const add_to_book = async () => {

      console.log("added to the Book")

      console.log(data[index])

      console.log("User Account ID" , user_doc_id)


      const add_friends = await addDoc(collection(db, "friendsBook"), {

        user_id: user_doc_id,
        nickname: nickname,
        firstname: firstname,
        lastname: lastname,
        image: image_url,
        added_user: user,
        friend_id: id
      })

      console.log("Friend id", add_friends.id)

      console.log("Added  to Friends Book")


      setAddStatus("Added")

      

      


      

      //set sepcific profile document isFriend key to true

      console.log("isFriend True")










    }

    //fix bug on find the added friend based on thier firstname because firstname is sometimes same for someones so
    //fixing that issue using the friend profile id.

    const mark_add_friends =  (friend_id) => {


      console.log("Marking Adding Friends")

      console.log(already_added)

      console.log(friend_id)

      

      //const already_friend =  already_added.filter((added_profiles) => added_profiles.firstname == firstname)

      if(already_added.includes(friend_id)){
        console.log("Already a Friend")

        setAddStatus("Added")
      }else{
        console.log("not Friend")

        setAddStatus("Add to Book")
      }

      //console.log(already_friend)

      

      


      



    }


    //need to update the database structure and use realtime fetching tool for fetch the friends

    





    
 

    return(


        <div className="profile-main">





            



          <div className="pro-content-2">


              <div className="friends-list" ref={getClass} style={styles}>

                <div className="your-profile">

                  <h1>My Profile</h1>


                  <Button className="view-btn" onClick={your_profile}>View</Button>
                </div>



                <div className="list">
                  <h1>Friends list</h1>

                  <div className="search-bar">
                    <Input onChange={handle_search_input} className="search" type="text" placeholder="Search users"></Input>
                    <Button onClick={search_users} backgroundColor="green.500" className="search-btn">Search</Button>

                  </div>

                
                    {data.map((d, index) => (

                      

                      

                      <div className="user-list" key={index} onClick={() => view_user(index)}>  
                      
                      <img src={d.image_url} alt="" className="pro-image-1" /> 
                      
                      <span className="usernames">{d.username}</span>
                      
                      </div>

                    ))}

                      
                </div>
                
                

              </div>

              


              {profile_clicked !== false ? 

              
              <div className="pro-main">

                   {width < 600 ? 
                   
                   <svg className="menu-icon" onClick={menu_open} width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                     
                     <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                     
                    </svg> : null} 
              
              
              
              <div className="profile-details">

                   
                   

                   
                   

                

                

                <h1 className="pro-title">Discover Peoples</h1>
                 <h2>Profile Details.</h2>

                 
                 <div className="pro-image">

                    <img className="pro-image-2" src={image_url} alt="" />
                 </div>

                 <div className="name">

                    <h1>{firstname}  {lastname}</h1>
                 </div>


                 <div className="pro-info">

                   <div className="friends-count">

                    
                   </div>

                   <div className="email">


                      <h1>Nickname : {nickname}</h1>

                   </div>


                   
                 </div>

                 <div className="btn-section">
                  


                 <div className="add-chat-btn">

                   <Button onClick={add_to_book}>{add_status}</Button>
                 </div>

                  <div className="chat-btn">
                    <Button backgroundColor="green.500" onClick={chat_page} >Chat</Button>
                  </div>

                 </div>

              </div> 

              </div>
              
              
              : 

              
              
              
              
              <div className="intro-main">

                    {width < 600 ? 
                    
                    <svg className="menu-icon" onClick={menu_open} width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                     
                     <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                     
                    </svg> : null}

                

                <div className="intro">

                


                 <div className="intro-content">
                  <h1>Welcome to Profile {user}</h1>
                  <h4>width: {width}</h4>
                  <h4>ismobile : </h4>
                  <h3>Discover Friends and Share The Expirience With Them.</h3>
                 </div>

                 

                 <img className="intro-img" src="src/assets/Img-06.png" alt="" width="420px"/>

                 </div>
              </div>}

                   
                    

              </div>

                    


            

            

            
        </div>
    )
}



export default Profile