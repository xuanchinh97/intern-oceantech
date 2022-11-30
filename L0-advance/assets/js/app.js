const app = (function () {

    const URL_PATH__ORDER = "http://localhost:3000/listOrder/"
    const URL_PATH__PRODUCTS = "http://localhost:3000/listData/"

    const setLocalStorage = (key, value) => {
        if (value) {
            let data = JSON.stringify(value)
            localStorage.setItem(key, data)
        } else {
            alert("dữ liệu không hợp lệ")
        }
    }

    const getLocalStorage = (key) => {
        let data = localStorage.getItem(key)
        return JSON.parse(data)
    }

    // lấy ra đầy đủ thông tin của sản phẩm trong giỏ hàng
    const getCartProducts = async () => {
        const products = []
        let listCart = getLocalStorage(keyLocalItemCart)
        let listProduct = await getListProduct()
        listCart.forEach((cartItem) => {
            let product = listProduct.find(product => product.id === cartItem.idSP)
            if (product) {
                product = {
                    ...product,
                    amount: cartItem.soLuong,
                    totalMoney: cartItem.price * cartItem.soLuong
                }
                products.push(product)
            }
        })
        return products
    }

    // handle tổng sản phẩm và tổng tiền từng sản phẩm
    const handleTotalCart = () => {
        const initialValue = 0
        const totalCart = new Map()
        let listCart = getLocalStorage(keyLocalItemCart)

        if (listCart) {
            const totalProduct = listCart.reduce((total, currentValue) =>
                total + currentValue.soLuong,
                initialValue)

            const totalMoney = listCart.reduce((total, currentValue) =>
                total + currentValue.price * currentValue.soLuong,
                initialValue)

            totalCart.set("totalProduct", totalProduct)
            totalCart.set("totalMoney", totalMoney)
        }

        return totalCart
    }

    ///////// list data
    const getListProduct = async () => {
        const response = await fetch(URL_PATH__PRODUCTS)
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const putListProduct = async (id, productObject) => {
        const response = await fetch(URL_PATH__PRODUCTS + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productObject)
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    /////// list order
    const getListOrder = async () => {
        const response = await fetch(URL_PATH__ORDER)
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const postListOrder = async (cartObject) => {
        const response = await fetch(URL_PATH__ORDER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartObject)
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const putListOrder = async (id, cartObject) => {
        const response = await fetch(URL_PATH__ORDER + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartObject)
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const deleteListOrder = async (id) => {
        const response = await fetch(URL_PATH__ORDER + id, {
            method: 'DELETE',
        })
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json()
        return data;
    }

    const toast = (message, type) => {
        let background = "green"

        if (type === "warn") {
            background = "yellow"
        }
        if (type === "error") {
            background = "red"
        }

        Toastify({
            text: message,
            position: "left",
            duration: 1000,
            style: {
                background,
                fontSize: "1.2rem",
                border: "2px",

            },
            offset: {
                x: 30,
                y: 55
            },
        }).showToast();
    }

    return {
        setLocalStorage,
        getLocalStorage,
        getCartProducts,
        handleTotalCart,
        getListProduct,
        putListProduct,
        getListOrder,
        putListOrder,
        deleteListOrder,
        postListOrder,
        toast,
    }
})()