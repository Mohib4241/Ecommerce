import React, { use, useState } from "react";
import '../css/LoginSignUp.css'
import logo from '../assets/logo.jpg'
import user_icon from '../assets/person.png'
import pass_icon from '../assets/password.png'
import email_icon from '../assets/email.png'
import numLogo from '../assets/phone-call.png'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const baseURL = "http://localhost:8080/api/v1/consumer/auth"



const LoginSignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [fname , setFirstName] = useState("")
    const[ mname , setMiddleName ]  = useState("")
    const[lname , setLastName] = useState("")
    const [confirmPassword , setConfirmPassword ] = useState("")
    const[gender , setGender] = useState("")
    const [number , setNumber ] = useState("")
    const [action, setAction] = useState("Sign Up");

    const navigate = useNavigate()

    // Fix: Call Login only after state update
    const handleLogin =  async () => {

            try {
                console.log("Logging in with:", email, password);
                const data = { email, password };
                
                const response = await axios.post(`${baseURL}/login`, data);
    
                if (response.data.message === "User doesn't exist") {
                    alert("User doesn't exist! Redirecting to Sign Up...");
                } else {
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    navigate('/home')
                }
            } catch (error) {
                alert("Invalid details! Please try again.");
                console.error(error.message);
            }
    };


    const SignUp = async () => {
       
        try{
            const data = {fname , mname , lname , gender , number, email , password }
            console.log(data);
            const response = await axios.post(baseURL + '/signUP' , data)
            console.log(response);
            alert(response)

            if(response.data.message === "successfully registered"){
                setAction("Login")
                window.location.reload();      

            }
    
            else{
            window.location.reload();
            setAction("Sign Up")
            }
    
        }
        catch(error){
            
            // Reset all input fields

            alert("Invalid Details")
            window.location.reload();

            console.log(error.message);
        }
    }

    return (
        <div className="container">
            <div className="logo">
                <img src={logo} alt="" />
            </div>

            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            {action === "Sign Up" ? (
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt='' />
                        <input type="text" placeholder="First Name"
                          onChange={(e) => setFirstName(e.target.value)}  required />
                    </div>
                    <div className="input">
                        <img src={user_icon} alt='' />
                        <input type="text" placeholder="Middle Name"
                          onChange={(e) => setMiddleName(e.target.value)}  />
                    </div>
                    <div className="input">
                        <img src={user_icon} alt='' />
                        <input type="text" placeholder="Last Name" 
                          onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="input">
                        <img src={user_icon} alt='' />
                        {/* <input type="text" placeholder="Gender"
                            onChange={(e) => setGender(e.target.value)} required /> */}
                             <select
                            onChange={(e) => setGender(e.target.value)} 
                            required
                            value={gender} // Bind the selected value
                            >
                            <option value="" disabled>Select Gender</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                            <option value="O">O</option>
                        </select>
                    </div>
                    <div className="input">
                        <img src={email_icon} alt='' />
                        <input type="email" placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input">
                    <img src ={numLogo} height="20px" width ="20px" alt="" />
                    <input type="tel"  placeholder="Mobile Number" pattern="[0-9]{15}" 
                     onChange={(e) => setNumber(e.target.value)}  required/>
                    </div>

                    <div className="input">
                        <img src={pass_icon} alt='' />
                        <input type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="input">
                        <img src={pass_icon} alt='' />
                        <input type="password" placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                </div>
            ) : (
                <div className="inputs">
                    <div className="input">
                        <img src={email_icon} alt='' />
                        <input type="email" placeholder="Email" required 
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input">
                        <img src={pass_icon} alt='num' />
                        <input type="password" placeholder="Password" required
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="forgot-password">Forgot Password <span>Click Here!</span></div>
                </div>
            )}

            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit gray" : "submit"}
                    onClick={() =>{ setAction("Sign Up") ; SignUp(); }}>
                    Sign Up
                </div>
                <div className={action === "Login" ? "submit gray" : "submit"}
                    onClick={() => { 
                        setAction("Login"); 
                       handleLogin() // Ensures state is updated before calling handleLogin
                    }}>
                    Login
                </div>
            </div>
        </div>
    );
}

export default LoginSignUp;