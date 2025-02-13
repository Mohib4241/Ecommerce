// const productImages = {
//     "Running Shoes": "https://images.pexels.com/photos/843671/pexels-photo-843671.jpeg",
//     "Smartphone": "https://images.pexels.com/photos/292763/pexels-photo-292763.jpeg",
//     "Backpack": "https://images.pexels.com/photos/552810/pexels-photo-552810.jpeg",
//     "Wrist Watch": "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg",
//     "Formal Shoes": "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg",
//     "Laptop": "https://images.pexels.com/photos/18105/pexels-photo.jpg",
//     "Handbag": "https://images.pexels.com/photos/278387/pexels-photo-278387.jpeg",
//     "LED TV": "https://images.pexels.com/photos/572189/pexels-photo-572189.jpeg",
//     "Casual Shirt": "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
//     "Sports Watch": "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg",
//     "Sneakers": "https://images.pexels.com/photos/1556715/pexels-photo-1556715.jpeg",
//     "Microwave Oven": "https://images.pexels.com/photos/4107010/pexels-photo-4107010.jpeg",
//     "Washing Machine": "https://images.pexels.com/photos/5591476/pexels-photo-5591476.jpeg",
//     "Gaming Console": "https://images.pexels.com/photos/14589743/pexels-photo-14589743.jpeg",
//     "Office Chair": "https://images.pexels.com/photos/7616870/pexels-photo-7616870.jpeg",
//     "Sunglasses": "https://images.pexels.com/photos/1148442/pexels-photo-1148442.jpeg",
//     "Wireless Earbuds": "https://images.pexels.com/photos/5386751/pexels-photo-5386751.jpeg",
//     "Smartwatch": "https://images.pexels.com/photos/437035/pexels-photo-437035.jpeg",
//     "Action Camera": "https://images.pexels.com/photos/302532/pexels-photo-302532.jpeg",
//     "Blender": "https://images.pexels.com/photos/1963818/pexels-photo-1963818.jpeg",
//     "Electric Scooter": "https://images.pexels.com/photos/3802517/pexels-photo-3802517.jpeg",
//     "Treadmill": "https://images.pexels.com/photos/3680194/pexels-photo-3680194.jpeg",
//     "Leather Jacket": "https://images.pexels.com/photos/696681/pexels-photo-696681.jpeg",
//     "Vacuum Cleaner": "https://images.pexels.com/photos/6195144/pexels-photo-6195144.jpeg",
//     "Gaming Chair": "https://images.pexels.com/photos/4792523/pexels-photo-4792523.jpeg",
//     "Projector": "https://images.pexels.com/photos/8348974/pexels-photo-8348974.jpeg",
//     "Maggi": "https://images.pexels.com/photos/840117/pexels-photo-840117.jpeg"
// };


// import axios from "axios";


// const API_KEY = 'mmLqIRUc10NQW4xmjmcQh84eJ8mxcyJKL3o7wCG3jIp8CDHLLSzOUk8X'; // Replace with your actual Pexels API key

// const fetchImage = async (product) => {
//     try {
//         const response = await axios.get(
//             "https://api.pexels.com/v1/search",
//             {
//                 params: { query: product, per_page: 1 },
//                 headers: {
//                     Authorization: `${API_KEY}`, // Use Bearer token for authorization
//                 },
//             }
//         );
//         if (response.data.photos.length > 0) {
//             console.log(response.data.photos[0].src.medium); // Log the image URL
//             return response.data.photos[0].src.medium
//         } else {
//             console.log("No image found.");
//         }
//     } catch (err) {
//         console.error("Error fetching image:", err.message);
//     }
// };

// const Images = []

// for(const product in productImages)
//    Images.push({  [product] : await fetchImage(product) })

// console.log(Images);

// export default Images

export const Images = [
    {
      'Running Shoes': 'https://images.pexels.com/photos/601177/pexels-photo-601177.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Smartphone: 'https://images.pexels.com/photos/5234774/pexels-photo-5234774.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Backpack: 'https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Wrist Watch': 'https://images.pexels.com/photos/1120275/pexels-photo-1120275.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Formal Shoes': 'https://images.pexels.com/photos/296158/pexels-photo-296158.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Laptop: 'https://images.pexels.com/photos/5698417/pexels-photo-5698417.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Handbag: 'https://images.pexels.com/photos/1204464/pexels-photo-1204464.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'LED TV': 'https://images.pexels.com/photos/5202957/pexels-photo-5202957.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Casual Shirt': 'https://images.pexels.com/photos/30548689/pexels-photo-30548689.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Sports Watch': 'https://images.pexels.com/photos/30500808/pexels-photo-30500808.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Sneakers: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Microwave Oven': 'https://images.pexels.com/photos/9462228/pexels-photo-9462228.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Washing Machine': 'https://images.pexels.com/photos/2254065/pexels-photo-2254065.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Gaming Console': 'https://images.pexels.com/photos/30512715/pexels-photo-30512715.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Office Chair': 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Sunglasses: 'https://images.pexels.com/photos/2651394/pexels-photo-2651394.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Wireless Earbuds': 'https://images.pexels.com/photos/860009/pexels-photo-860009.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Smartwatch: 'https://images.pexels.com/photos/267391/pexels-photo-267391.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Action Camera': 'https://images.pexels.com/photos/690806/pexels-photo-690806.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Blender: 'https://images.pexels.com/photos/1797103/pexels-photo-1797103.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Electric Scooter': 'https://images.pexels.com/photos/1379374/pexels-photo-1379374.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Treadmill: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Leather Jacket': 'https://images.pexels.com/photos/1035685/pexels-photo-1035685.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Vacuum Cleaner': 'https://images.pexels.com/photos/38325/vacuum-cleaner-carpet-cleaner-housework-housekeeping-38325.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      'Gaming Chair': 'https://images.pexels.com/photos/7862509/pexels-photo-7862509.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Projector: 'https://images.pexels.com/photos/2736135/pexels-photo-2736135.jpeg?auto=compress&cs=tinysrgb&h=350'
    },
    {
      Maggi: 'https://images.pexels.com/photos/2284945/pexels-photo-2284945.jpeg?auto=compress&cs=tinysrgb&h=350'
    }
  ]


  console.log(Images[0]['Laptop']);