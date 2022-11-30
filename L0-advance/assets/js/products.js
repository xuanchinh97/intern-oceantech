// handle thêm sản phẩm 
const addSP = async (id, price) => {

    let listProduct = await app.getListProduct()
    let listCart = app.getLocalStorage(keyLocalItemCart)
    let hasProduct = listProduct.find((product) => product.id === id)
    if (hasProduct.amount === 0) {
        app.toast("Sản phẩm đã hết!", "error")
        return
    }
    if (listCart) {
        let cartItemSelect = listCart.find((cartItem) => cartItem.idSP === id)
        let isProductMax = false

        if (cartItemSelect) {
            let listCartNew = listCart.map(cartItem => {
                if (cartItem.idSP === id && hasProduct.amount > cartItem.soLuong) {
                    return {
                        ...cartItem,
                        soLuong: cartItem.soLuong + 1
                    }
                }
                if (cartItem.idSP === id && hasProduct.amount === cartItem.soLuong) {
                    isProductMax = true
                }
                return cartItem
            })
            app.setLocalStorage(keyLocalItemCart, listCartNew)
            if (isProductMax) {
                app.toast("Sản phẩm đã tối đa", "error")
            } else {
                app.toast("Đã thêm sản phẩm")
            }
        } else {
            let listCartNew = [
                ...listCart,
                {
                    idSP: id,
                    soLuong: 1,
                    price: price
                }
            ]
            app.toast("Đã thêm sản phẩm")
            app.setLocalStorage(keyLocalItemCart, listCartNew)
        }
    } else {
        listCart = [{
            idSP: id,
            soLuong: 1,
            price: price
        }
        ]
        app.toast("Đã thêm sản phẩm")
        app.setLocalStorage(keyLocalItemCart, listCart)
    }
    renderCartNumber()
}

// hiển thị sản phẩm từ listData
const renderProducts = (productsData) => {
    renderCartNumber()

    let productsHtml = ''

    productsData.map((product) => productsHtml += `
        <div class="product">
            <div class="product__img" >
                <img src= ${product.imageUrl} alt=${product.description}>
            </div>
            <div class="product__name">${product.name}</div>
            <div class="product__footer">
                <div class="product__footer__left">
                    <div class="product__price">Giá: <span>${product.price.toLocaleString()} đ</span></div>
                    <div class="product__amount">Số lượng: <span>${product.amount}</span></div>
                </div>
                <button class="product__add-cart" onclick = 'addSP(${product.id},${product.price})'>
                    Thêm <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `)

    productsDiv.innerHTML = productsHtml
}

//fetch data
app.getListProduct()
    .then(data => {
        renderProducts(data)
    })

