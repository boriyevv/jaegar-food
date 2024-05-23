
let headerList = document.querySelector('.header-list')
let navbar = document.querySelector('.navbar')
let foodList = document.querySelector('.food-list')
let wrRight = document.querySelector('.wrapper-right')
let wrLeft = document.querySelector('.wrapper-left')
let orderList = document.querySelector('.order-list')
let priceResult = document.querySelector('.price-result')
let discount = document.querySelector('.discount')
let select = document.querySelector('select')
let serachInput = document.querySelector('.header-inp')
let goPayment = document.querySelector('.go-payment')
let paymentForm = document.querySelector('.payment-form')
let paypalForm = document.querySelector('.paypal-form')
let cash = document.querySelector('.cash-form')
let backPayment = document.querySelector('.pay-cancel')
let payment = document.querySelector('.payment-active')
let byCard = document.querySelector('.pay-by-card')
let byPaypal = document.querySelector('.pay-by-paypal')
let byCash = document.querySelector('.pay-by-cash')
let cardCheck = document.querySelector('.card-check')
let paypalCheck = document.querySelector('.paypal-check')
let cashCheck = document.querySelector('.cash-check')


byPaypal.addEventListener('click', (e)=>{
    paymentForm.style.display = 'none'
    cash.style.display = 'none'
    paypalForm.style.display = 'flex'
    byPaypal.style.color = 'white'
    byPaypal.style.border ='2px solid white'
    byCard.style.color = 'grey'
    byCard.style.border ='2px solid grey'
    byCash.style.color = 'grey'
    byCash.style.border ='2px solid grey'
    cashCheck.style.display = ' none'
    cardCheck.style.display = 'none'
    paypalCheck.style.display = 'inline'
})

byCard.addEventListener('click', (e)=>{
    paymentForm.style.display = 'flex'
    paypalForm.style.display = 'none'
    cash.style.display = 'none'
    byCard.style.color = 'white'
    byCard.style.border ='2px solid white'
    byPaypal.style.color = 'grey'
    byPaypal.style.border ='2px solid grey'
    byCash.style.color = 'grey'
    byCash.style.border ='2px solid grey'
    cashCheck.style.display = ' none'
    paypalCheck.style.display = 'none'
    cardCheck.style.display = 'inline'
})

byCash.addEventListener('click', (e)=>{
    paypalForm.style.display = 'none'
    paymentForm.style.display = 'none'
    cash.style.display = 'flex'
    byCash.style.color = 'white'
    byCash.style.border ='2px solid white'
    byPaypal.style.color = 'grey'
    byPaypal.style.border ='2px solid grey'
    byCard.style.color = 'grey'
    byCard.style.border ='2px solid grey'
    paypalCheck.style.display = 'none'
    cardCheck.style.display = 'none'
    cashCheck.style.display = ' inline'
})

goPayment.addEventListener('click', (e)=>{
    wrRight.style.display = 'none'
    wrLeft.style.opacity = '30%'
    navbar.style.opacity = '30%'
    payment.style.display = 'block'
})

backPayment.addEventListener('click', (e)=>{
    wrRight.style.display = 'block'
    payment.style.display = 'none'
    wrLeft.style.opacity = '100%'
    navbar.style.opacity = '100%'

})


// payment
$('#card-number').on('keypress change blur', function () {
    $(this).val(function (index, value) {
        return value.replace(/[^a-z0-9]+/gi, '').replace(/(.{4})/g, '$1 ');
    });
});

$('#card-number').on('copy cut paste', function () {
    setTimeout(function () {
        $('#card-number').trigger("change");
    });
});


/* Exp. Date Slash */

$('#card-exp').on('input', function () {
    var curLength = $(this).val().length;
    if (curLength === 2) {
        var newInput = $(this).val();
        newInput += '/';
        $(this).val(newInput);
    }


});



let count = 1
async function menu() {
    let data = await fetch('https://api-food-backend.vercel.app/category', {
        mode: 'cors'
    })
    let parseData = await data.json()
    console.log(parseData)
    for (let i of parseData) {
        let li = document.createElement('li')
        li.setAttribute('class', 'header-item')
        li.textContent = i.name

        headerList.append(li)

        li.addEventListener('click', function () {
            count = i.id
            getFood(count)
        })
    }

}

menu()



async function getFood(id = 1) {

    foodList.innerHTML = null

    let data = await fetch('https://api-food-backend.vercel.app/food/' + id)
    let parseData = await data.json()

    renderFood(parseData)
    return parseData
}


let result = []

function renderFood(dataItem) {
    foodList.innerHTML = null
    for (let i of dataItem) {
        let li = document.createElement('li')
        li.setAttribute('class', 'food-item')
        li.innerHTML = `
        <img class="food-img" width="132" height="132"
        src="https://api-food-backend.vercel.app/${i.images}">
        <div class="food-box">
        <h3 class="food-title ">${i.name}</h3>
        <p class="price">$ ${i.price}</p>
        <span class="food-desk">${i.bowls} bowls avialble</span>
        </div>
        `

        li.addEventListener('click', function () {
            wrRight.classList.add('wrapper-right-active')

            let find = result.findIndex(item => item.id == i.id)

            if (find >= 0) {
                result[find].count += 1
                // result[find].result += +i.price
            }
            else {
                result.push({ ...i, count: 1 })
            }

            orderRender(result)
            discount.innerHTML =`<span style="margin-right:15px">10%</span> ${(result.reduce((a, b) => a + (b.price * b.count), 0)/100*10).toFixed(2)}`  

            priceResult.innerHTML =`<s style="margin-right:15px"> ${result.reduce((a, b) => a + (b.price * b.count), 0).toFixed(2)} </s> <span>${(result.reduce((a, b) => a + (b.price * b.count), 0) - (result.reduce((a, b) => a + (b.price * b.count), 0)/100*10)).toFixed(2)}</span>`   


        })

        foodList.append(li)


    }
}


function orderRender() {
    orderList.innerHTML = null

    for (let i of result) {
        let li = document.createElement('li')
        let div = document.createElement('div')
        let p = document.createElement('p')
        let btn = document.createElement('button')
        let trash = document.createElement('i')
        

        div.setAttribute('class', 'order-right')
        p.setAttribute('class', 'order-total-price')
        btn.setAttribute('class', 'order-remove')
        trash.setAttribute('class', 'fa-solid fa-trash-can')

        p.textContent = `${(i.price * i.count).toFixed(2)}`
        btn.append(trash)

        li.setAttribute('class', 'order-item d-flex jst')
        li.innerHTML = `
                    <div class="order-left  ">
                    <div class="order-wrapper jst row">
                    <div class="order-item-top row  ">
                    <img class="order-item-img"
                    src="https://api-food-backend.vercel.app/${i.images}"
                    width="30px" height="30px" alt="">
                    <div class="order-desk">
                    <h3 class="order-name">${i.name.slice(0, 25)} ...</h3>
                    <p class="order-price">$ ${i.price}</p>
                    </div>
                    </div>
                    <span style="color:white" class="order-count">${i.count}</span>
                    </div>
                    <input type="text" class="order-inp" placeholder="Please just a little bit spicy only">
                    </div>
                
                        `
        btn.addEventListener("click", function () {
            let index = result.findIndex(item => item.id == i.id)
            if (result[index].count == 1) {
                li.remove()
                result = result.filter(item => item.id != i.id)
            }
            else {
                result[index].count -= 1
            }
            orderRender()
            priceResult.textContent = result.reduce((a, b) => a + (b.price * b.count), 0)
            if (!result.length) {
                wrRight.classList.remove('wrapper-right-active')
            }

        }
        )
        div.append(p, btn)
        li.append(div)
        orderList.append(li)
    }

}


getFood()





// getFood()
select.addEventListener('change', function () {
    console.log(getFood(count))
    getFood(count).then(item => {
        console.log(item)
        if (select.value == "higher") {
            let higherSort = item.sort((a, b) => b.price - a.price)
            foodList.innerHTML = null
            renderFood(higherSort)
        }
        else if (select.value == "lower") {
            let lowerSort = item.sort((a, b) => a.price - b.price)
            foodList.innerHTML = null
            renderFood(lowerSort)
        }
        else if (select.value == "default") {
            renderFood(item)
        }
    })
})

function serchFood() {

}
serachInput.addEventListener('input', function () {
    getFood(count).then(item => {
        let filteredFood = item.filter(e => e.name.toLowerCase().includes(serachInput.value.toLowerCase()))
        foodList.innerHTML = null
        renderFood(filteredFood)
    })
})