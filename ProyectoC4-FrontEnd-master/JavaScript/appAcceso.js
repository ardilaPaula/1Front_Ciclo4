const formulario = document.getElementById("form");
const inputs = document.querySelectorAll("#form input");
const urlbase = "http://localhost:8080/api/user";
const urlprod = "http://129.151.124.136:8080/api/user"

const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const campos = {
    email: false,
    password: false
};
const validarFormulario = (e) => {
    switch (e.target.name) {
        case "txtemail":
            validarCampo(expresiones.email, e.target, "email");
            break;
        case "txtpassword":
            validarCampo(expresiones.password, e.target, "password");
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        $(`#group-${campo}`).removeClass("form-group-incorrecto");
        $(`#group-${campo}`).addClass("form-group-correcto");
        $(`#group-${campo} i`).removeClass("far fa-times-circle");
        $(`#group-${campo} i`).addClass("fas fa-check-circle");
        $(`#group-${campo} .form-error`).removeClass("form-error-active");
        campos[campo] = true;
    } else {
        $(`#group-${campo}`).addClass("form-group-incorrecto");
        $(`#group-${campo}`).removeClass("form-group-correcto");
        $(`#group-${campo} i`).addClass("far fa-times-circle");
        $(`#group-${campo} i`).removeClass("fas fa-check-circle");
        $(`#group-${campo} .form-error`).addClass("form-error-active");
        campos[campo] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});

const showToast = (toastheader, toastbody, toastsmall,error) => {
    $("#toast-header").html(toastheader);
    $("#toast-body").html(toastbody);
    $("#toast-small").html(toastsmall)
    if (error) {
        //Como poner una imagen en el toast?
        $("#myToast").addClass("toast bg-warning")
    } else {
        $("#myToast").addClass("toast bg-success")
    }
    $("#myToast").toast("show");
};

const acceder = () => {
    console.log(campos.password)
    console.log(campos.email)
    if(campos.password && campos.email){
        const email = $("#txtemail").val();
        const password = $("#txtpassword").val();
        console.log(email);
        console.log(password);

        $.ajax({
            url : `${urlprod}/${email}/${password}`,
            type: "GET",
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            success: function(response){
                if (response.id !== null){
                    form.reset();
                    document.querySelectorAll('.form-group-correcto').forEach((icono) =>{
                        icono.classList.remove('form-group-correcto');
                    });
                    showToast('BIENVENIDO!', 'En 1 segundo lo redireccionaremos');
                    setTimeout(()=>{
                        window.location.href = 'registro.html';
                    },2000);
                }else{
                    showToast('Error', 'Usuario o contraseña no coinciden', 'Algo salio mal', true);
                    setTimeout(()=>{
                        window.location.href = 'index.html';
                    },2000);
                }
            },
            error: function(){
                showToast('Error','Algo salio mal', 'ocurrio un error en el consumo', true)
            }
        });
    }else{
        showToast('Error', 'Por favor diligencia correctamente el formulario',"Algo salio mal", true);
    }
}   