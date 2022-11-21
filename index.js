//------------------------------
//-----Dashboard API section-----------
//------------------------------


//backgrund image section
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
		document.getElementById("author").textContent = `By: ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`
		document.getElementById("author").textContent = `By: Dodi Achmad`
    })    
//----------

//crypto section
fetch("https://api.coingecko.com/api/v3/coins/dogecoin")
    .then(res => {
        if (!res.ok) {
            throw Error("Something went wrong")
        }
        return res.json()
    })
    .then(data => {
        document.getElementById("crypto-top").innerHTML = `
            <img src=${data.image.small} />
            <span>${data.name}</span>
        `
        document.getElementById("crypto").innerHTML += `
            <p>🎯: $${data.market_data.current_price.usd}</p>
            <p>👆: $${data.market_data.high_24h.usd}</p>
            <p>👇: $${data.market_data.low_24h.usd}</p>
        `
    })
    .catch(err => console.error(err))
//---------

//Time and Weather section
function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)

navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

//------------------------------
//--------todo list section----------
//------------------------------

const todoEl = document.getElementById("todo-input")
const todoList = document.getElementById("todo-list")
let id = 0
let todoArr = []

function renderList(){
    const html = todoArr.map(todo => {
      const {id, text} = todo

       return `<div class="container">
                    <div class="hover-div" id="hide-${id}">
                        <p data-text="${id}">${text}</p>
                        <span id="remove">
                        <i data-delete="${id}" class="material-icons" style="font-size:18px;color:red">remove_circle_outline</i>
                        </span>
                    </div>
                    <div class="hidden" id="div-${id}">
                        <input type="text" value="${text}" id="inp-${id}">
                        <button data-edit="${id}">Arrow</button>
                    </div>
                </div>`
    })
    todoList.innerHTML = html.join("")
}

document.addEventListener("click", function(e){
    
    if(e.target.id === "todo-btn"){
        addItem()
    }
    else if(e.target.dataset.text){
        showEdit(e.target.dataset.text)
    }
    else if(e.target.dataset.delete){
        deleteItem(e.target.dataset.delete) 
    }
    else if(e.target.dataset.edit){
        saveEdit(e.target.dataset.edit)
    }
    
})

function addItem(){
    id++
    let input = todoEl.value
    let todo = {text: input,
                id: id
                }
    
//UX - condicional pra não renderizar objetos repetidos ou vazios
    // Aqui não consegui usar todoArr.includes(todoEl.value) pois o array tem objetos e valores de input diretos
    if(!todoArr.some(item => item.text === input) && todo.text){
        todoArr.push(todo)
        renderList()
     }
    todoEl.value = ""
}

function deleteItem(id){
    todoArr = todoArr.filter(item => `${item.id}` !== id )
    renderList()
}

function showEdit(id){
    document.getElementById(`div-${id}`).classList.toggle("hidden")
    document.getElementById(`hide-${id}`).classList.toggle("hidden")
}

function saveEdit(id){
    const newText = document.getElementById(`inp-${id}`)
    if(newText.value){
        const editObj = todoArr.filter(item => `${item.id}` === id)[0]
        editObj.text = newText.value
        renderList()
    }
}

/*Próximas etapas, trazer um gerador de id e trocar esse número pq está criando problema com tipo
exigindo o hackzinho de mudar a id do objeto pra string pq a id que tu recebe do e.target...
é uma string
-Arruma o css da edição e fazer o item editado ir pro começo da fila na lista*/