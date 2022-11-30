
const orderBodyDiv = $(".order__body")
const orderContainerDiv = $(".order__container")
const orderEmptyDiv = $(".order__empty")

// hiển thị thông tin đơn hàng đã mua
const renderOrderInfo = async () => {
  let orderInfoHtml = ''
  let orderEmptyHtml = ''
  let listOrder = await app.getListOrder()

  if (listOrder.length > 0) {

    listOrder.forEach((itemOrder) => {
      let orderDetailHTML = ''

      itemOrder.products.forEach((product) => orderDetailHTML += `
      <div class="order__detail__item grid-col-5">
        <div><img src=${product.imageUrl} alt=${product.name}></div>
        <div>${product.name}</div>
        <div>${product.price.toLocaleString()}đ</div>
        <div>${product.amount}</div>
        <div>${product.totalMoney.toLocaleString()}đ</div>
      </div>`)

      orderInfoHtml += `
      <div class="order__item grid-col-7">
        <div class="flex-col">
          ${itemOrder.id}
          <button 
            class="order__btnDetail" 
            onClick={handleOrderBtnDetail(${itemOrder.id})}
          >
            Chi tiết <i class="order__btnDetail__icon-${itemOrder.id} fa-solid fa-caret-down"></i>
          </button>
        </div>
        <div>${itemOrder.customerInfo.fullName}</div>
        <div>${itemOrder.createAt}</div>
        <div>${itemOrder.typeProductsNumber}</div>
        <div>${itemOrder.amount}</div>
        <div>${itemOrder.totalMoney.toLocaleString()}đ</div>
        <div>
          <i id="iconRefund-${itemOrder.id}"
            onclick="handleBtnRefund(${itemOrder.id})" 
            class="order__btnRefund fa-sharp fa-solid fa-rotate-left"
          ></i>
        </div>
      </div>
      <div class="order__table__detail order-${itemOrder.id}">
        <div class="order__detail__header grid-col-5">
          <div>Ảnh</div>
          <div>Tên sản phẩm</div>
          <div>Giá tiền</div>
          <div>Số lượng</div>
          <div>tổng tiền</div>
        </div>
        <div class="order__detail__body">
        ${orderDetailHTML}
        </div>
      </div>`
    })

    orderEmptyDiv.style.display = "none"
    orderContainerDiv.style.display = "block"
    orderBodyDiv.innerHTML = orderInfoHtml
  } else {
    orderEmptyHtml += `
    <img src="./assets/img/empty-order.png" alt="order empty">
    <p> Bạn chưa có đơn hàng nào !!! <a href="#" onclick ="openProduct()"> tiếp tục mua sắm </a> </p>
    `
    orderContainerDiv.style.display = "none"
    orderEmptyDiv.style.display = "block"
    orderEmptyDiv.innerHTML = orderEmptyHtml
  }
}

// handle khi click icon trả hàng
const handleBtnRefund = async (idOrder) => {
  $(`#iconRefund-${idOrder}`).classList.add("fa-spin")

  let listOrder = await app.getListOrder()
  let listProduct = await app.getListProduct()

  let itemOrder = listOrder.find((itemOrder) => itemOrder.id === idOrder)

  await listProduct.forEach((product) => {
    for (let orderProduct of itemOrder.products) {
      if (product.id === orderProduct.id) {
        let productObject = {
          ...product,
          amount: product.amount + orderProduct.amount
        }
        app.putListProduct(product.id, productObject)
      }
    }
  })
  await app.deleteListOrder(itemOrder.id)
  app.toast("Đã hoàn đơn hàng")
  renderOrderInfo()

}

// handle khi click vào nút chi tiết ở order
const handleOrderBtnDetail = (id) => {
  const detailIcon = $(`.order__btnDetail__icon-${id}`)
  const orderDetail = $(`.order-${id}`)

  orderDetail.classList.toggle("show");
  detailIcon.classList.toggle("fa-caret-down");
  detailIcon.classList.toggle("fa-caret-up");
}
