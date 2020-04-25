const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const myLocationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoScroll = ()=>{
    //NEw message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargine = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offSetHeight + newMessageMargine

    //visible height
    const visibleHeight = $messages.offSetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (locationMessage)=>{
    console.log(locationMessage)
    const html = Mustache.render(myLocationTemplate, {
        username:locationMessage.username,
        myLocation: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()
        //enable
        if(error){
            return console.log(error)
        }

        console.log('Message has been delivered!')
    })    
})

$locationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Somthing like geo loaction is not supported by your browser!!')
    }

    //disable
    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{

        //enable
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude: position.coords.longitude 
        }, ()=>{
            $locationButton.removeAttribute('disabled')
            
            console.log('Location has been shared!')
        })

    })
})

socket.emit('join', {username, room}, (error)=>{

    if(error){
        alert(error)
        location.href = '/'
    }

})
