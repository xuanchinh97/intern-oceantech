
const cartContainerDiv = $(".cart__container")
const cartProductsDiv = $(".cart__products")
const cartPaymentDiv = $(".cart__payment")
const cartEmptyDiv = $(".cart__empty")

// hiển thị giỏ hàng
const renderCart = async () => {
    renderCartNumber()
    const listProduct = await app.getListProduct()
    const listCart = app.getLocalStorage(keyLocalItemCart)
    const totalCart = app.handleTotalCart(listCart)
    let cartProductsHtml = ''
    let cartPaymentHtml = ''
    let cartEmptyHtml = ''

    if (listCart) {
        listCart.map((cartItem) => {
            let product = listProduct.find(product => product.id === cartItem.idSP)
            return cartProductsHtml += `
            <tr>
                <td><img width="50px" src=${product.imageUrl}></td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString()}đ</td>
                <td>
                    <div class="cart__quantity">
                        <span class="down" onClick='decreaseQuantity(${cartItem.idSP})'>
                            <i class="fa-solid fa-minus"></i>
                        </span>
                        <b>${cartItem.soLuong}</b>
                        <span class="up" onClick='increaseQuantity(${cartItem.idSP})'>
                            <i class="fa-solid fa-plus"></i>
                        </span>
                    </div>
                </td>
                <td>${(cartItem.price * cartItem.soLuong).toLocaleString()}đ</td>
                <td><span class="cart__icon-delete" onClick = {cartIconDelete(${cartItem.idSP})} ><i class=" fa fa-trash"></i> <span></td>
            </tr>
        `
        })

        cartPaymentHtml += `
            <div>
                Tổng số lượng sản phẩm: 
                <span class="cart-total__product">${totalCart.get("totalProduct")}</span>
            </div>
            <div>
                Thành tiền: 
                <span class="cart-total__price">${totalCart.get("totalMoney").toLocaleString()}đ</span>
            </div>
            <div>
                <button class="cart__btn-back" onClick = {openProduct()}>
                    <i class="fa-solid fa-angle-left"></i> Quay lại
                </button>
                <button class="cart__btn-payment" onClick= {openPayment()}>Mua</button>
                <button class="cart__btn-bought" onClick={openOrder()}>Sản phẩm đã mua</button>
            </div>`

        cartProductsDiv.innerHTML = cartProductsHtml
        cartPaymentDiv.innerHTML = cartPaymentHtml

        cartEmptyDiv.style.display = "none"
        cartContainerDiv.style.display = "block"
    } else {
        cartEmptyHtml += `
        <img src="./assets/img/empty-cart.png" alt="cart empty">
        <div>
                <button class="cart__btn-back" onClick = {openProduct()}>
                    <i class="fa-solid fa-angle-left"></i> Quay lại
                </button>
                <button class="cart__btn-bought" onClick={openOrder()}>Sản phẩm đã mua</button>
        </div>`

        cartEmptyDiv.innerHTML = cartEmptyHtml

        cartContainerDiv.style.display = "none"
        cartEmptyDiv.style.display = "block"
    }
}


// handle xóa sản phẩm
const cartIconDelete = (id) => {
    let listCart = app.getLocalStorage(keyLocalItemCart)
    let listCartNew = listCart.filter(cartItem => cartItem.idSP != id)
    if (listCartNew.length) {
        app.setLocalStorage(keyLocalItemCart, listCartNew)
        renderCart()
        return
    }
    localStorage.removeItem(keyLocalItemCart)
    renderCart()
}

// handle tăng sản phẩm
const increaseQuantity = async (id) => {
    let listProduct = await app.getListProduct()
    let listCart = app.getLocalStorage(keyLocalItemCart)

    let hasProduct = listProduct.find((product) => product.id === id)

    let listCartNew = listCart.map(cartItem => {
        if (cartItem.idSP === id && hasProduct.amount === cartItem.soLuong) {
            app.toast("Sản phẩm đã tối đa", "error")
        }
        if (cartItem.idSP === id && hasProduct.amount > cartItem.soLuong) {
            return {
                ...cartItem,
                soLuong: cartItem.soLuong + 1
            }
        }
        return cartItem
    })

    app.setLocalStorage(keyLocalItemCart, listCartNew)
    renderCart()
}

// handle giảm sản phẩm
const decreaseQuantity = (id) => {
    let listCart = app.getLocalStorage(keyLocalItemCart)

    let listCartNew = listCart.map(cartItem => {
        if (cartItem.idSP === id && cartItem.soLuong > 1) {
            return {
                ...cartItem,
                soLuong: cartItem.soLuong - 1
            }
        }
        return cartItem
    })
    app.setLocalStorage(keyLocalItemCart, listCartNew)
    renderCart()
}
