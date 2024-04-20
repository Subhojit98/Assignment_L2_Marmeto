console.log('====================================');
console.log("Connected");
console.log('====================================');

//? Fetching product data immideately when the script loads ny useing IFFE ->

(async function () {

    const productVendor = document.getElementById("vendor")
    const productName = document.getElementById("product_name")
    const productPrice = document.getElementById("price")
    const productOriginalPrice = document.getElementById("original_price")
    const productColorsContainer = document.querySelector(".color_selector")
    const productSizeContainer = document.querySelector(".select-size-box")
    const productIncreseButton = document.getElementById("increseBtn")
    const productDecreseButton = document.getElementById("decreseBtn")
    const addedValue = document.getElementById("productValue")
    const addToCarButton = document.querySelector(".addTocart_btn")
    const productAddedMessageDiv = document.querySelector(".added_to_crt")
    const productDescriptionDiv = document.querySelector(".description")

    let productQuantity = 0

    const productData = await fetch("https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448")

    const result = await productData.json()


    // ? calculateing the discount ->

    const applyDiscount = (price) => {
        const applicableDiscountPercentage = 35
        price = parseInt(price.substring(1))
        const discountAmount = price * (applicableDiscountPercentage / 100)

        const afterDiscountPrice = Math.round(price - discountAmount)
        return afterDiscountPrice

    }

    const { vendor, title, options, description, compare_at_price } = result.product


    //? assigning values to the page ->

    productVendor.innerText = vendor
    productName.innerText = title
    productOriginalPrice.innerText = ` ${compare_at_price}.00`
    productPrice.innerText = `${applyDiscount(compare_at_price)}.00`

    //? exreacting colors array ->
    options[0]?.values.map((value) => {
        const inputRadio = document.createElement("input")

        inputRadio.type = "radio"
        inputRadio.name = "select_color"
        inputRadio.className = "color-select"
        inputRadio.style.backgroundColor = value

        for (const key in value) {
            inputRadio.style.backgroundColor = value[key]
            inputRadio.style.border = `2px solid ${value[key]}`
            inputRadio.value = key
        }
        productColorsContainer.append(inputRadio)
    })

    // ? extracting size from api ->

    options[1]?.values.map((size) => {

        const sizeDiv = document.createElement("div")
        const sizeInput = document.createElement("input")
        const sizeLabel = document.createElement("label")


        sizeInput.type = "radio"
        sizeInput.name = "size"
        sizeInput.className = "size-select"
        sizeInput.value = size

        sizeLabel.innerText = size

        sizeDiv.appendChild(sizeInput)
        sizeDiv.appendChild(sizeLabel)
        productSizeContainer.append(sizeDiv)

    })


    //? Adding quantity to the cart


    productIncreseButton.addEventListener("click", () => {
        productQuantity++
        addedValue.innerHTML = productQuantity
    })

    productDecreseButton.addEventListener("click", () => {
        productQuantity--

        if (productQuantity < 0) {
            addedValue.innerHTML = 0
        }

        else addedValue.innerHTML = productQuantity
    })


    //? Adding product description from api ->
    productDescriptionDiv.innerHTML = description

    // ? addeding product to cart -> 

    addToCarButton.addEventListener("click", () => {

        const selectedColor = document.querySelectorAll(".color-select")
        const selectedSize = document.querySelectorAll(".size-select")
        let colorChosen = null
        let sizeChosen = null
        // ? Geting the cheked color value -> 
        selectedColor.forEach(color => {
            if (color.checked) {
                colorChosen = color.value
            }
        })

        // ? Geting the cheked size value  ->
        selectedSize.forEach(size => {
            if (size.checked) {
                sizeChosen = size.value
            }
        })

        productAddedMessageDiv.style.display = "block"
        if (colorChosen && sizeChosen) {
            productAddedMessageDiv.innerHTML = ` <p>${title} with Color ${colorChosen} and Size ${sizeChosen} added to cart</p>`
        }
        // ! displaying message for selecting color and size to proceed ..
        else {
            productAddedMessageDiv.innerHTML = '<p> Please select Size and Color for add to cart!'
        }


    })
})()