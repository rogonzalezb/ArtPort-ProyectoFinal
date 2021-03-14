// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [{
      path: '/registro/',
      url: 'registro.html',
    },
    {
      path: '/ingresar/',
      url: 'ingresar.html',
    },
    {
      path: '/index/',
      url: 'index.html',
    },
    {
      path: '/inicio/',
      url: 'inicio.html',
    },
    {
      path: '/perf-personal-normal/',
      url: 'perf-personal-normal.html',
    },
    {
      path: '/perf-personal-artista/',
      url: 'perf-personal-artista.html',
    },
    {
      path: '/post-nuevo/',
      url: 'post-nuevo.html',
    },
    // {
    //   path: '/perf-personal-artista/',
    //   url: 'perf-personal-artista.html',
    // },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var colUsuarios = db.collection("usuarios");

var email = "";
var idUsuario = "";

var tag = $$('#textTag').val();

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function(e) {
  // Do something here when page loaded and initialized
  console.log(e);
})


// --------------------------------INDEX -------------------------------------------
$$(document).on('page:init', '.page[data-name="index"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');
  // app.toolbar.hide('#botToolbar');

  $$('#home').on('click', function() {
    mainView.router.navigate('/inicio/');
  })
  $$('#buscar').on('click', function() {
    mainView.router.navigate('/buscar/');
  })
  $$('#postNuevo').on('click', function() {
    mainView.router.navigate('/post-nuevo/');
  })
  // $$('#miPerfil').on('click', function() {
  //   mainView.router.navigate('/perf-personal-normal/');
  // })

  $$('#aIngreso').on('click', function() {
    mainView.router.navigate('/ingresar/');
  })
  $$('#aRegistro').on('click', function() {
    mainView.router.navigate('/registro/');
  })



})


// ----------------------------------REGISTRO------------------------------------------
$$(document).on('page:init', '.page[data-name="registro"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  // app.navbar.hide('#topNavbar');
  // app.toolbar.hide('#botToolbar');

  $$('#noArtista').on('click', fnActivar);
  $$('#artista').on('click', fnActivar2);

  $$('#btnRegistro').on('click', fnRegistrar);


})


//-----------------------------------INGRESAR----------------------------------------------
$$(document).on('page:init', '.page[data-name="ingresar"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  // app.navbar.hide('#topNavbar');
  // app.toolbar.hide('#botToolbar');

  $$('#btnIngresar').on('click', fnIngresar);


})


//-----------------------------------INICIO----------------------------------------------
$$(document).on('page:init', '.page[data-name="inicio"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.show('#topNavbar');






})


//------------------------------PERFIL PERSONAL NORMAL-----------------------------------------
$$(document).on('page:init', '.page[data-name="perf-personal-normal"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  idUsuario = $$('#idOculto').html();
  console.log('mi email: ' + idUsuario);

  fnTomarDatosPerfilNor();




})


//------------------------------PERFIL PERSONAL ARTISTA-----------------------------------------
$$(document).on('page:init', '.page[data-name="perf-personal-artista"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  idUsuario = $$('#idOculto').html();
  console.log('mi email: ' + idUsuario);

  fnTomarDatosPerfilArt();




})


//------------------------------------POST NUEVO-----------------------------------------
$$(document).on('page:init', '.page[data-name="post-nuevo"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  var tagArray = [];

  $$('#agregarTag').on('click', function() {
    var tag = $$('#textTag').val();
    console.log("tag: " + tag);
    sumarTag = tagArray.push(tag);
    console.log(tagArray);
    $$('#contenedorTags').append('<div class="chip"><div class="chip-label">' + tag + '</div><a href="#" class="chip-delete"></a></div>');
  });

  $$('.chip-delete').on('click', borrarTag);

  $$('#btnPublicar').on('click', function() {
    var titText = $$('#tituloText').val();
    var descText = $$('#descripText').val();
    var emailOculto = $$('#idOculto').html();
    var tArray = tagArray;
    console.log(titText + ", " + descText + ", " + tArray);

    db.collection("postsTexto").add({
        email: emailOculto,
        titulo: titText,
        descripcion: descText,
        tags: tArray,
        fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  });

  $$('#nuevoTexto').on('click', fnTextActivo);
  $$('#nuevaImg').on('click', fnImgActivo);







})




//  ---------------------------------------  FUNCIONES  --------------------------------------------------

function fnActivar() {
  $$('#noArtista').addClass('activo');
  $$('#artista').removeClass('activo');
}

function fnActivar2() {
  $$('#artista').addClass('activo');
  $$('#noArtista').removeClass('activo');
}

function fnRegistrar() {

  rEmail = $$('#regEmail').val();
  rPass = $$('#regPass').val();
  rUsua = $$('#regUsuario').val();
  rFec = $$('#regFecha').val();

  firebase.auth().createUserWithEmailAndPassword(rEmail, rPass)
    .then(function() {
      console.log("registro ok");
      // aca tengo el usuario generado en AUTH

      if ($$('#noArtista').hasClass("activo")) {
        var tipoUsuario = $$('#noArtista').val();
      } else if ($$('#artista').hasClass("activo")) {
        var tipoUsuario = $$('#artista').val();
      }

      datos = {
        NombreUsuario: rUsua,
        TipoUsuario: tipoUsuario,
        Fecha: rFec
      };
      colUsuarios.doc(rEmail).set(datos);

      mainView.router.navigate('/inicio/');
    })

    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('Clave muy débil.');
      } else {
        alert(errorCode + "|" + errorMessage);
      }
      console.log(error);
    });

}

function fnIngresar() {

  email = $$('#emailLogin').val();
  password = $$('#passLogin').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("ingresaste");
      // var idUsuario = email;

      colUsuarios.doc(email).get().then((doc) => {
        if (doc.exists) {
          var dbTipoUsuario = doc.data().tipoUsuario;
          console.log('documento existe');
          console.log('tipo usuario: ' + dbTipoUsuario);

          if (dbTipoUsuario == 'artista') {
            var miNombre = doc.data().nombreUsuario;
            console.log('Mi usuario: ' + miNombre);

            $$('#idOculto').html(email);
            fnMiPerfilArtista();

            mainView.router.navigate('/inicio/');

          } else if (dbTipoUsuario == 'noArtista') {
            var miNombre = doc.data().nombreUsuario;
            console.log('Mi usuario: ' + miNombre);

            $$('#idOculto').html(email);
            fnMiPerfilNormal();

            mainView.router.navigate('/inicio/');
          }

        }
      })

    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });

}

function fnMiPerfilArtista() {
  $$('#miPerfil').on('click', function() {
    mainView.router.navigate('/perf-personal-artista/');
  })
}

function fnMiPerfilNormal() {
  $$('#miPerfil').on('click', function() {
    mainView.router.navigate('/perf-personal-normal/');
  })
}

function fnTomarDatosPerfilArt() {

  colUsuarios.doc(idUsuario).get().then((doc) => {
    if (doc.exists) {
      console.log('documento existe');

      miNombre = doc.data().nombreUsuario;
      console.log('Mi usuario: ' + miNombre);
      $$('#miUsuarioArtista').html(miNombre);

    }
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + errorMessage);
  });

}

function fnTomarDatosPerfilNor() {

  colUsuarios.doc(idUsuario).get().then((doc) => {
    if (doc.exists) {
      console.log('documento existe');

      miNombre = doc.data().nombreUsuario;
      console.log('Mi usuario: ' + miNombre);
      $$('#miUsuarioNormal').html(miNombre);

    }
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + errorMessage);
  });

}

function borrarTag(e) {
  e.preventDefault();
  var chip = $$(this).parents('.chip');
  chip.remove();
}

function fnTextActivo() {
  $$('#nuevoTexto').addClass('activo');
  $$('#nuevaImg').removeClass('activo');
}

function fnImgActivo() {
  $$('#nuevaImg').addClass('activo');
  $$('#nuevoTexto').removeClass('activo');
}
