const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const productsDiv = $(".products")
const cartDiv = $(".cart")
const paymentDiv = $(".payment")
const orderDiv = $(".order")

const keyLocalStorageListSP = "DANHSACHSP"
const keyLocalItemCart = "DANHSACHITEMCART"

const openProduct = () => {
    document.title = "Danh sách sản phẩm"
    cartDiv.style.display = "none"
    paymentDiv.style.display = "none"
    orderDiv.style.display = "none"
    productsDiv.style.display = "flex"
    app.getListProduct()
        .then(data => {
            renderProducts(data)
        })
}

const openCart = () => {
    document.title = "Danh sách giỏ hàng"
    productsDiv.style.display = "none"
    paymentDiv.style.display = "none"
    orderDiv.style.display = "none"
    cartDiv.style.display = "block"
    renderCart()
}

const openPayment = () => {
    paymentDiv.style.display = "block"
    getProvinces()
    getDistrictsByProvinceID()
    getWardsByDistrictID()
}

const openOrder = () => {
    document.title = "Danh sách đơn hàng"
    productsDiv.style.display = "none"
    cartDiv.style.display = "none"
    paymentDiv.style.display = "none"
    orderDiv.style.display = "block"
    renderOrderInfo()
}

const renderCartNumber = () => {
    const totalCart = app.handleTotalCart().get("totalProduct")
    if (totalCart) {
        $('.header__nav__cart__number').innerText = totalCart
        return
    }
    $('.header__nav__cart__number').innerText = 0
}