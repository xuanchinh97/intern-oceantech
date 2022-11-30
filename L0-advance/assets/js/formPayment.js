
const formPayment = $(".payment__form")
const provinceSelect = $("#province")
const districtSelect = $("#district")
const wardSelect = $("#ward")
const btnPaymentCancel = $(".payment__btnCancel")
const inputs = formPayment.querySelectorAll('[name]')


//fetch data
const getData = (endPoint, tagHTML, callback) => {
    fetch(endPoint)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        })
        .then(data => callback(data, tagHTML))
        .catch((error) => console.log(error))
}

// hiển thị danh sách tỉnh thành phố huyện xã
const renderSelectOptions = (options, tagHTML) => {
    let optionsHTML = `<option selected value=""> -- Chọn ${tagHTML.name} -- </option>`
    options.map((option) => optionsHTML += `<option value=${option.code}>${option.name}</option>`)
    tagHTML.innerHTML = optionsHTML
}

const getProvinces = () => {
    const urlProvince = "https://provinces.open-api.vn/api/p/"
    getData(urlProvince, provinceSelect, renderSelectOptions)
}

const getDistrictsByProvinceID = () => {
    let code = provinceSelect.value || 1
    const urlDistrict = `https://provinces.open-api.vn/api/d/search/?q=quận huyện thành phố&p=${code}`
    getData(urlDistrict, districtSelect, renderSelectOptions)
}

const getWardsByDistrictID = () => {
    let code = districtSelect.value || 1
    const urlWard = `https://provinces.open-api.vn/api/w/search/?q=xã phường thị trấn&d=${code}`
    getData(urlWard, wardSelect, renderSelectOptions)
}

//handle khi click hủy ở form payment
const handleBtnPaymentCancel = () => {
    cartDiv.style.display = "block"
    paymentDiv.style.display = "none"
}

provinceSelect.addEventListener("change", getDistrictsByProvinceID)
districtSelect.addEventListener("change", getWardsByDistrictID)
btnPaymentCancel.addEventListener("click", handleBtnPaymentCancel);

// handle giảm số lượng sản phẩm sau khi mua
const handleProductAmount = async (listCart) => {
    // let listCart = app.getLocalStorage(keyLocalItemCart)
    let listProduct = await app.getListProduct()

    listProduct.forEach((product) => {
        for (let itemCart of listCart) {
            if (product.id === itemCart.idSP) {
                let productObject = {
                    ...product,
                    amount: product.amount - itemCart.soLuong
                }
                app.putListProduct(product.id, productObject)
            }
        }
    })
}

// validate form
Validator({
    form: '.payment__form',
    formGroupSelector: '.form-group ',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#firstName', 'Vui lòng nhập tên của bạn'),
        Validator.isRequired('#lastName', 'Vui lòng nhập họ của bạn'),
        Validator.isEmail('#email'),
        Validator.isPhoneNumber('#phone'),
        Validator.isRequired('#home', 'Vui lòng nhập trường này'),
    ]
})

const randomID = (list = []) => {
    const id = Date.now()
    function checkID() {
        let check = list.find(item => item.id === id)
        return check ? randomID(list) : id
    }
    return checkID()
}

// return object itemOder từ value ở input và ngoài input
const getItemOrder = async (listCart) => {

    const totalCart = app.handleTotalCart()
    const time = new Date()
    const inputObject = {}

    for (const input of inputs) {
        inputObject[input.id] = input.value.trim()
    }
    const { firstName, lastName, email, phone, home, message } = inputObject

    const province = provinceSelect.options[provinceSelect.selectedIndex].text
    const district = districtSelect.options[districtSelect.selectedIndex].text
    const ward = wardSelect.options[wardSelect.selectedIndex].text

    const fullName = lastName + " " + firstName
    const address = `${home}, ${ward}, ${district}, ${province}`
    const id = randomID()
    const createAt = time.toLocaleDateString()
    const typeProductsNumber = listCart.length
    const amount = totalCart.get('totalProduct')
    const totalMoney = totalCart.get('totalMoney')
    const products = await app.getCartProducts()

    const itemOrder = {
        id,
        createAt,
        customerInfo: {
            fullName,
            email,
            phone,
            address
        },
        message,
        typeProductsNumber,
        amount,
        totalMoney,
        products,
    }

    return itemOrder
}

const submitForm = async (e) => {
    e.preventDefault();
    const messageInput = $('#message') // message là trường không bắt buộc nhập dữ liệu

    for (const input of inputs) {
        if (input.value.trim() === "" && input !== messageInput) {
            return
        }
    }

    const listCart = app.getLocalStorage(keyLocalItemCart)
    const orderItem = await getItemOrder(listCart)

    await app.postListOrder(orderItem)
    await handleProductAmount(listCart)
    localStorage.removeItem(keyLocalItemCart)

    app.toast("Thành công")
    paymentDiv.style.display = "none"
    renderCart()

    // reset lại các trường input
    for (const input of inputs) {
        input.value = ""
    }
}
formPayment.addEventListener("submit", submitForm);


