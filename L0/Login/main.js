
// bootstrap
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

//custom 

const login = document.querySelector("#login")
const btnLogin = document.querySelector("#btn-login")
const formLogin = document.querySelector(".form-login")
const inputUser = document.querySelector(".input-username")
const inputPassword = document.querySelector(".input-password")
const inputWarn = document.querySelectorAll(".input-warn")
const inputError = document.querySelector(".input-error")
const btnForgotPassword = document.querySelector(".btn-forgot-password")
const close = document.querySelectorAll(".close")

const formForgotPassword = document.querySelector(".form-forgot-password")
const oldpassword = document.querySelector("#oldpassword")
const newpassword = document.querySelector("#newpassword")
const btnChangePassword = document.querySelector("#btn-change-password")
const messError = document.querySelector(".mess-error")
const messSuccess = document.querySelector(".mess-success")

login.addEventListener("click", () => {
    login.classList.remove("d-block")
    login.classList.add("hide")
    formLogin.classList.add("d-flex")
})
btnForgotPassword.addEventListener("click", (e) => {
    e.preventDefault()
    formLogin.classList.remove("d-flex")
    formLogin.classList.add("hide")
    formForgotPassword.classList.add("d-block")

})

btnLogin.addEventListener("click", () => {
    username = inputUser.value
    password = inputPassword.value

    checkValidation(username, password)
})

inputUser.addEventListener("keyup", (e) => {
    handleInputEnter(e)
})

inputPassword.addEventListener("keyup", (e) => {
    handleInputEnter(e)
})


inputUser.addEventListener("click", () => {
    handleInputClick()
})

inputPassword.addEventListener("click", () => {
    handleInputClick()
})

close[0].addEventListener("click", () => {
    formLogin.classList.add("hide")
    formLogin.classList.remove("d-flex")
    login.classList.add("d-block")
    login.innerText = "Đăng nhập hệ thống"
})
close[1].addEventListener("click", () => {
    formForgotPassword.classList.add("hide")
    formForgotPassword.classList.remove("d-block")
    formLogin.classList.add("d-flex")
})

const checkValidation = (username, password) => {
    let getpass = localStorage.getItem("password")
    setTimeout(() => {
        if (username === "" && password === "") {
            inputWarn[0].innerHTML = "Không được bỏ trống"
            inputWarn[1].innerHTML = "Không được bỏ trống"
        }
        else if (username === "") {
            inputWarn[0].innerHTML = "Không được bỏ trống"
        }
        else if (password === "") {
            inputWarn[1].innerHTML = "Không được bỏ trống"
        }
        else if (username === "admin" && password === "admin" || password === getpass) {
            formLogin.classList.remove("d-flex")
            formLogin.classList.add("hide")
            login.classList.add("d-block")
            inputUser.value = ""
            inputPassword.value = ""
            login.innerText = "Đăng nhập thành công"
        } else {
            inputError.innerHTML = "Tài khoản hoặc mật khẩu không đúng"
        }
        btnLogin.innerHTML = "Login"
    }, 1000);

    btnLogin.innerHTML = " <div id='loader'></div>"
}

const handleInputEnter = (e) => {
    if (e.key === "Enter") {
        username = inputUser.value
        password = inputPassword.value
        checkValidation(username, password)
    }
}

const handleInputClick = () => {
    inputWarn[0].innerHTML = ""
    inputWarn[1].innerHTML = ""
    inputError.innerHTML = ""
}


// forgot pass 
btnChangePassword.addEventListener("click", (e) => {
    document.querySelector('.form-validation').submit(function () {
        return false;
    });
    oldpass = oldpassword.value
    newpass = newpassword.value

    checkValidation2(oldpass, newpass)
    return false
})

const saveNewPassword = (newpass) => {
    localStorage.setItem("password", newpass)
}

const checkValidation2 = (oldpass, newpass) => {

    let getpass = localStorage.getItem("password")

    console.log(getpass)
    console.log("old", oldpass)
    console.log("get", getpass)

    if (oldpass === getpass) {
        saveNewPassword(newpass)
        messError.classList.remove("d-block")
        messError.classList.add("hide")
        messSuccess.innerText = "Bạn đã đổi mật khẩu thành công"
        setTimeout(() => {
            formForgotPassword.classList.remove("d-block")
            formForgotPassword.classList.add("hide")
            formLogin.classList.add("d-flex")
            messSuccess.innerText = ""
            oldpassword.value = ""
            newpassword.value = ""
        }, 2000);
        return false
    } else {
        messError.innerText = "Password không đúng"
        messError.classList.add("d-block")
    }

}

oldpassword.addEventListener("click", () => {
    messError.innerText = ""
    // messError.classList.add("d-block")
})




