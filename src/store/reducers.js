import {configureStore, createSlice} from '@reduxjs/toolkit'

 const userSlice=createSlice({
    name:"user",
    initialState:{isloggedIn:false,
        currentUser:null,
        cart:0,
    },
    reducers:{
        login:(state)=>{
          state.isloggedIn=true
        },
        loginSuccess:(state,action)=>{
        //   console.log("inlogin",action.payload)
          state.currentUser=action.payload
        },
        setCart:(state,action)=>{
            state.cart=action.payload;

        },
        logout:(state)=>{
            localStorage.removeItem("UserEmail")
            localStorage.removeItem("UserId")
            localStorage.removeItem("UserName")
            localStorage.removeItem("Id")
            state.currentUser=null

         

            state.isloggedIn=false},
            IncreaseCount(state){
                state.CartCount=state.CartCount+1;
            },
            DecreaseCount:(state,payload)=>{
                state.CartCount=state.CartCount-1;

            },
            
    }
})

 const adminSlice=createSlice({
    name:"admin",
    initialState:{isloggedIn:false,
    currentAdmin:null,
    },
    reducers:{
        login(state){
           

            state.isloggedIn=true},
            loginSuccess:(state,action)=>{
                //   console.log("inlogin",action.payload)
                  state.currentAdmin=action.payload
                },
        logout(state){
            localStorage.removeItem("adminName")
            localStorage.removeItem("adminId")
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminEmail")
            state.isloggedIn=false
            state.currentAdmin=null
        }
    }
})
 






// Export actions


// Export reducer



export const userReducer = userSlice.reducer;
export const adminReducer = adminSlice.reducer;

// Export Actions
export const userActions = userSlice.actions;
export const adminActions = adminSlice.actions;
