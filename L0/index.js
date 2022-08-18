
const js = {
    jsVar: "Các biến được khai báo bằng từ khóa var có phạm vi function có nghĩa là những biến này chỉ có thể được truy cập trong hàm mà chúng được khai báo.",
    jsLet: "Các biến được khai báo bằng let có phạm vi block có nghĩa là các biến đó sẽ chỉ có thể truy cập được bên trong block mà chúng được khai báo chứ không phải bên ngoài block đó.",
    jsConst: "Các biến được khai báo bằng const có phạm vi block giống như let. Các biến được khai báo bằng const không thể được cập nhật hoặc khai báo lại. Do đó, nên gán giá trị cho biến trong quá trình khởi tạo.",
    jsArrowfc: "Arrow function là một tính năng mới của ES6, giúp viết code ngắn gọn hơn.    Arrow function sử dụng khá ok trong các TH dùng: map, filter, reducer,...    Arrow function không có bind. Arrow function không phù hợp là method của object.",
    jsDestructuring: "Destructuring là một cú pháp cho phép bạn gán các thuộc tính của một Object hoặc một Array. Điều này có thể làm giảm đáng kể các dòng mã cần thiết để thao tác dữ liệu trong các cấu trúc này. Có hai loại Destructuring: Destructuring Objects và Destructuring Arrays.",
    jsPromise: "Promise là một cơ chế trong JavaScript giúp bạn thực thi các tác vụ bất đồng bộ mà không rơi vào callback hell hay pyramid of doom, là tình trạng các hàm callback lồng vào nhau ở quá nhiều tầng.",
    jsAsync: "là một tính năng của JavaScript giúp chúng ta làm việc với các hàm bất đồng bộ theo cách thú vị hơn và dễ hiểu hơn. Nó được xây dựng trên Promises và tương thích với tất cả các Promise dựa trên API.",
}


const arrowfc = () => {
    console.log("this is a arrow function")
}

// destructuring
const { jsVar, jsLet, jsConst, ...rest } = js

console.log(js)


