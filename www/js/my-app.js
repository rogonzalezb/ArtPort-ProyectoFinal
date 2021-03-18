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
var storage = firebase.storage();
var storageRef = storage.ref();
var colUsuarios = db.collection("usuarios");
var colPostTexto = db.collection("postsTexto")
var colPostImagen = db.collection("postImagen")

var email = $$('#emailLogin').val();
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
  // emailOculto = $$('#tipoOculto').html();
  console.log(idUsuario);

  fnTomarDatosPerfilNor();

  colPostTexto.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        var date = new Date((doc.data().fechaPublicacion).toDate());
        $$('#tab-1').append('<div class=""><h3>' + doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


  colPostImagen.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        var date = new Date((doc.data().fechaPublicacion).toDate());

        storage.ref().child(doc.data().archivo).getDownloadURL() //pongo la ruta de la imagen en el storage
          .then(function(url) {
            console.log("url: " + url);
            // $$("#fotosubida").attr("src", url);
            var imgUrl = url;
            $$('#tab-1').append('<div class="imgTab"><img style="width:98vw" src="' + imgUrl + '"><h3>' + doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
          }).catch(function(error) {
            console.log("Error: " + error);
          });

      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });




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

  colPostTexto.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        var date = new Date((doc.data().fechaPublicacion).toDate());
        $$('#tab-2').append('<div class=""><h3>' + doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


  colPostImagen.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        var date = new Date((doc.data().fechaPublicacion).toDate());

        storage.ref().child(doc.data().archivo).getDownloadURL() //pongo la ruta de la imagen en el storage
          .then(function(url) {
            console.log("url: " + url);
            // $$("#fotosubida").attr("src", url);
            var imgUrl = url;

            if (doc.data().mostrarEn == 'galeria') {
              $$('#tab-1').append('<div class="imgTab"><img style="width:98vw" src="' + imgUrl + '"><h3>' + doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
            } else if (doc.data().mostrarEn == 'general') {
              $$('#tab-2').append('<div class="imgTab"><img style="width:98vw" src="' + imgUrl + '"><h3>' + doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
            }

          }).catch(function(error) {
            console.log("Error: " + error);
          });

      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


})



//------------------------------------POST NUEVO-----------------------------------------
$$(document).on('page:init', '.page[data-name="post-nuevo"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');
  app.toolbar.hide('#botToolbar');

  $$('#nuevoTexto').on('click', fnTextActivo);
  $$('#nuevaImg').on('click', fnImgActivo);

  var tagArray = [];

  $$('#agregarTag').on('click', function() {
    var tag = $$('#textTag').val();
    console.log("tag: " + tag);
    sumarTag = tagArray.push(tag);
    console.log(tagArray);
    $$('#contenedorTags').append('<div class="chip"><div class="chip-label">#' + tag + '</div><a href="#" class="chip-delete"></a></div>');
  });

  $$('.chip-delete').on('click', borrarTag);

  $$('#btnPublicar').on('click', function() {
    var titText = $$('#tituloText').val();
    var descText = $$('#descripText').val();
    var emailOculto = $$('#idOculto').html();
    var tipeOculto = $$('#tipoOculto').html();
    var tArray = tagArray;
    console.log(titText + ", " + descText + ", " + tArray);

    if ($$('#nuevoTexto').prop("checked")) {

      colPostTexto.add({
        tipeUser: tipeOculto,
        email: emailOculto,
        titulo: titText,
        descripcion: descText,
        tags: tArray,
        fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp(),
      })

      mainView.router.navigate('/inicio/');

    } else if ($$('#nuevaImg').prop("checked")) {
      var archivo = document.getElementById("file").files[0];

      storage.ref(emailOculto + '/' + archivo.name).put(archivo);
      console.log(archivo.name);

      var archivoPath = (emailOculto + '/' + archivo.name);
      console.log(archivoPath);

      if ($$('#edadContenido').prop("checked")) {
        var edadContenido = $$('#edadContenido').val();
      } else {
        var edadContenido = $$('#edadContenido').val('ATP');
      }

      if ($$('#postGaleria').prop("checked")) {
        var dondeMostrar = $$('#postGaleria').val();
      } else if ($$('#postGeneral').prop("checked")) {
        var dondeMostrar = $$('#postGeneral').val();
      }

      colPostImagen.add({
        archivo: archivoPath,
        tipeUser: tipeOculto,
        email: emailOculto,
        titulo: titText,
        descripcion: descText,
        tags: tArray,
        rating: edadContenido,
        mostrarEn: dondeMostrar,
        fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp(),
      })

      mainView.router.navigate('/inicio/');

    };

  })



});





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

      if ($$('#noArtista').hasClass("activo")) {
        var tipoUsuario = $$('#noArtista').val();
      } else if ($$('#artista').hasClass("activo")) {
        var tipoUsuario = $$('#artista').val();
      }

      datos = {
        nombreUsuario: rUsua,
        tipoUsuario: tipoUsuario,
        fecha: rFec
      };
      colUsuarios.doc(rEmail).set(datos);
      console.log('Usuario creado');


      if (tipoUsuario == 'artista') {
        var miNombre = rUsua;
        console.log('Mi usuario: ' + miNombre);

        $$('#idOculto').html(rEmail);
        $$('#tipoOculto').html(tipoUsuario);

        fnMiPerfilArtista();

        mainView.router.navigate('/inicio/');

      } else if (tipoUsuario == 'noArtista') {
        var miNombre = rUsua;
        console.log('Mi usuario: ' + miNombre);

        $$('#idOculto').html(rEmail);
        $$('#tipoOculto').html(tipoUsuario);

        fnMiPerfilNormal();

        mainView.router.navigate('/inicio/');
      }

    }).catch(function(error) {
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

  var email = $$('#emailLogin').val();
  var password = $$('#passLogin').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("ingresaste");

      colUsuarios.doc(email).get().then((doc) => {
        if (doc.exists) {
          var dbTipoUsuario = doc.data().tipoUsuario;
          console.log('documento existe');
          console.log('tipo usuario: ' + dbTipoUsuario);

          if (dbTipoUsuario == 'artista') {
            var miNombre = doc.data().nombreUsuario;
            console.log('Mi usuario: ' + miNombre);

            $$('#idOculto').html(email);
            $$('#tipoOculto').html(dbTipoUsuario);

            fnMiPerfilArtista();

            mainView.router.navigate('/inicio/');

          } else if (dbTipoUsuario == 'noArtista') {
            var miNombre = doc.data().nombreUsuario;
            console.log('Mi usuario: ' + miNombre);

            $$('#idOculto').html(email);
            $$('#tipoOculto').html(dbTipoUsuario);

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

      miUsuario = doc.data().nombreUsuario;
      console.log('Mi usuario: ' + miUsuario);
      $$('#miUsuarioArtista').html(miUsuario);

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

      miUsuario = doc.data().nombreUsuario;
      console.log('Mi usuario: ' + miUsuario);
      $$('#miUsuarioNormal').html(miUsuario);

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
  // $$('#nuevoTexto').addClass('activo');
  // $$('#nuevaImg').removeClass('activo');
  $$('.subirImagen').attr('hidden', true);
}

function fnImgActivo() {
  var tipoU = $$('#tipoOculto').html();

  if (tipoU == 'artista') {
    // $$('#nuevaImg').addClass('activo');
    // $$('#nuevoTexto').removeClass('activo');
    $$('.subirImagen').removeAttr('hidden');
  } else if (tipoU == 'noArtista') {
    // $$('#nuevaImg').addClass('activo');
    // $$('#nuevoTexto').removeClass('activo');
    $$('.subirImagen').removeAttr('hidden');
    $$('.unicoImgArtista').attr('hidden', true);
  }

}
