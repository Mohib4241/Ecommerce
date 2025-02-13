import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/home.css'
import getRandomRGB from "../randomColor";
import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:8080/api/v1/consumer" // 🔹 Replace with your API endpoint

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    

    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    // Fetch inventory details
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(baseURL+"/inventory/",{ headers : {
                    'Authorization': `${accessToken}`,
                }
            });

                setProducts(response.data); // Assuming API returns an array of products
            } catch (err) {

                // Handle token refresh and error
                console.error(err);
                if ( err.response.status === 401 && refreshToken) {
                    try {
                        // Refresh token logic
                        const newTokenResponse = await axios.post(baseURL + "/auth/refresh", {
                            headers: {
                                'Authorization': `${refreshToken}`,
                            },
                        });

                        // Store new tokens
                        localStorage.setItem("accessToken", newTokenResponse.data.accessToken);
                        localStorage.setItem("refreshToken", newTokenResponse.data.refreshToken);

                        // Reload the page to refetch with the new access token
                        window.location.reload();
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        setError("Session expired, please log in again.");
                        navigate('/auth/')

                    }
                } else {
                    setError("Failed to fetch inventory!")
                    navigate('/auth/')
                    setAction("Login")

                    ;
                }

                console.error(err);

            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    async function addToCart(product){


        product.model = product.model_name
        product.brand = product.brand_name
        const accessToken = localStorage.getItem("accessToken")


        try{
            const response = await axios.post(baseURL + "/inventory/addToCart" , product , {
                headers : {
                    'Authorization' : `${accessToken}`
                }
            })
            console.log(response.data);
            alert(response.data)

        }
        catch(error){
            console.log(error.response);
        }
    }


    if (loading) return <h2 style={{color : "green"}}>Loading products... </h2>;
    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

    return (
        <div style={{ padding: "100px" }}>
            <div style={{    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.map((product) => (
                    <div key={product.id} style={{backgroundColor: "" ,  border: "px solid #ddd",color: "white",  padding: "10px", borderRadius:"20px" }}>
                        <img src={product.img} alt={""} style={{ width: "200px", height: "200px" ,  borderRadius: "8px" }} />
                        
                        <p> {product.model_name}</p>
                        <h3>{product.name}</h3>
                        <p>{product.product_name}</p>
                        <p>₹{product.total}</p>
                        <p>Seller: {product.seller}</p>
                        <button style={{ background: "#007bff", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
                        onClick={() =>{
                            addToCart(product)
                        }}>
                            Add to Cart 
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;