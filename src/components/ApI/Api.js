import axios from "axios";


export const sendUserAuthRequest=async(inputs,signup)=>{
    if(signup)
    {

        console.log("insignup")
        console.log(inputs)
        const formData=new FormData()
        formData.append('name',inputs.name)
        formData.append('email',inputs.email)
        formData.append('password',inputs.password)
        formData.append('id',inputs.id);
        formData.append('phoneNumber',inputs.phoneNumber)
        console.log("in posting")
        // console.log(formData)
     
        const res= await axios.post(`/user/signup`,inputs).catch((err)=>console.log("error in signup"))
    
        if(res.status!==200 && res.status!==201)
            {
                return console.log("unexpected error ")
            }
    
            const resData=await res.data;
            return resData;
    }
    else {
        // console.log("inlogin")
   const res= await axios.post(`/user/login`,{
        email:inputs.email,
        password:inputs.password,
    }).catch((err)=>console.log(err))

    if(res.status!==200 && res.status!==201)
        {
            return console.log("unexpected error ")
        }

        const resData=await res.data;
        return resData;
    }
}

export const sendAdminAuthRequest=async(data,signup)=>{
    const res= await axios.post(`/admin/login`,{

         email:data.email,
         password:data.password,
     }).catch((err)=>console.log(err))
 
     if(res.status!==200 && res.status!==201)
         {
             return console.log("unexpected error ")
         }
 
         const resData=await res.data;
         return resData;
 }



 export const getUser=async(userId)=>{


   
    const res=await axios.get(`/user/${userId}`).catch((err)=>{
        console.log(err)
    })
    if(res.status!==200)
        {
            return res.status(400).json({message:"no user"})
        }

        const data=await res.data;
        return data;
}


export const getActiveUsers = async () => {
    try {
        const res = await axios.get(`/user`);

        // Check if the response status is not 200
        if (res.status !== 200) {
            return { status: 400, message: "No users found" };
        }

        // Return the response data
        return res.data;
    } catch (err) {
        console.error("Error fetching active users:", err.message);

        // Handle the error case
        return { status: 500, message: "An error occurred while fetching users" };
    }
};

export const getOtherServiceUsers = async () => {
    try {
        const res = await axios.get(`/user/other`);

        // Check if the response status is not 200
        if (res.status !== 200) {
            return { status: 400, message: "No users found" };
        }

        // Return the response data
        return res.data;
    } catch (err) {
        console.error("Error fetching active users:", err.message);

        // Handle the error case
        return { status: 500, message: "An error occurred while fetching users" };
    }
};



export const getRequestUsers = async () => {
    try {
        const res = await axios.get(`/user/get/requsers`).catch((err)=>{
            console.log("no  request users")
        });
        // Check if the status is not 200
        if (res.status !== 200) {
            return { status: 400, message: "No user found" };
        }

        // Return the response data
        return res.data;
    } catch (err) {
        console.error('No Requesting users ');

        // Handle the error case
        return { status: 500, message: "An error occurred while fetching users" };
    }
};




export const getOtherRequestUsers = async () => {
    try {
        const res = await axios.get(`/user/get/other-requsers`).catch((err)=>{
            console.log("no  request users")
        });
        // Check if the status is not 200
        if (res.status !== 200) {
            return { status: 400, message: "No user found" };
        }

        // Return the response data
        return res.data;
    } catch (err) {
        console.error('No Requesting users ');

        // Handle the error case
        return { status: 500, message: "An error occurred while fetching users" };
    }
};
