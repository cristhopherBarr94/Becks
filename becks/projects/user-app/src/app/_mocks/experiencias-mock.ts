import { Exp } from "../_models/exp";

// type 0 = redirect to url
// type 1 = exp with questions form
// type 2 = confirmation message to redemption the exp
export const MockExperiencias: Exp[] = [
  {
    id: 1,
    cuentaActiva: false,
    detalleExp: false,
    imagesExp: "./assets/img/exp/artista-domicilio.jpg",
    imagesExpMob: "./assets/img/exp/artista-domicilio-mobile.jpg",
    titleExp: "ARTISTA A DOMICILIO",
    fechaExp: "11/2/2020",
    fechaAlt: "2 al 9 de noviembre",
    horaExp: "2 al 9 de noviembre",
    detailExp:
      "Activando esta experiencia, un artista emergente tocará tu puerta para crear una pieza oroginal sin moverte de casa. Habilitaremos 5 cupos diarios durante 6 días ¡No te quedes sin el tuyo!",
    placeExp: "Tu casa",
    urlExp: "/exp1",
    status: "2",
    type:"2",
    urlRedirect:""

  },
  {
    id: 2,
    cuentaActiva: false,
    detalleExp: false,
    imagesExp: "./assets/img/exp/frankDesktop.jpg",
    imagesExpMob: "./assets/img/exp/frank2.jpg",
    titleExp: "FRANK VIDEO CLIP",
    fechaExp: "11/13/2020",
    fechaAlt: "",
    horaExp: "11:00 PM — 4:00 AM",
    detailExp:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil aspernatur dicta perspiciatis voluptas quia cum quasi obcaecati enim officiis quisquam, placeat quam iure error? Doloremque perspiciatis accusantium laboriosam ratione impedit?",
    placeExp: "Live instagram Beck’s",
    urlExp: "/exp2",
    status: "1",
    type:"1",
    urlRedirect:""
  },
  {
    id: 3,
    cuentaActiva: false,
    detalleExp: false,
    imagesExp: "./assets/img/exp/frankDesktop.jpg",
    imagesExpMob: "./assets/img/exp/frank2.jpg",
    titleExp: "FRANK VIDEO CLIP3",
    fechaExp: "10/14/2020",
    fechaAlt: "",
    horaExp: "1:00 PM — 3:00 PM",
    detailExp:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil aspernatur dicta perspiciatis voluptas quia cum quasi obcaecati enim officiis quisquam, placeat quam iure error? Doloremque perspiciatis accusantium laboriosam ratione impedit?",
    placeExp: "Live instagram Beck’s",
    urlExp: "/exp1",
    status: "2",
    type:"1",
    urlRedirect:""

  },
  
];
