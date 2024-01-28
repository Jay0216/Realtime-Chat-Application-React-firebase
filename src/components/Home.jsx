import { Button } from "@chakra-ui/react"
import "./Home.css"
import { Link } from "react-router-dom"



const Home = () => {
    return(

        <div className="main-home">
            
            <div className="navbar">

            
                <div className="logo">
                    <a href="">FriendBook</a>
                </div>

                <div className="btns">

                  
                <Link to="/signin"><Button className="login-btn">Login</Button></Link>

                  

                  
                <Link to="/signup"><Button className="signup-btn-1" backgroundColor="green.600">Signup</Button></Link>
                  
                </div>
                
            </div>



            <div className="content-row">

                <div className="content">

                    <h1><span>Chat with friends</span>, Share Files, Share<br></br> your expiriences.</h1>

                    <Button className="seemore-btn" backgroundColor="green.600">See more</Button>
                </div>

                <div className="content-img">
                    <img src="src/assets/Img-04.png" alt="" width="500px"/>
                    
                </div>


                


            </div>
        </div>
    )
}





export default Home