const users = []

// add user, remove user, getUser, getUsersInRoom
const addUser = ({id, username, room})=>{
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return{
            error: 'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return {
            error: 'Username is in use'
        }
    }
    const user = {id, username, room}
    users.push(user)

    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id == id)

    if(index!== -1){
        return users.splice(index, 1)[0]
    }

}

const getUser = (id)=>{

    const user = users.find((user)=>{
        if(user.id === id){
            return user
        }
    })

    if(!user){
        return {
            error: 'User is not found'
        }
    }
    return user
}

const getUserInRoom = (room)=>{

    return users.filter((user)=>user.room === room)

}

module.exports = {addUser, removeUser, getUser, getUserInRoom}
