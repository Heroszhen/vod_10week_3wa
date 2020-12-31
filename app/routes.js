const router = require('express').Router();

const homeC = require("../src/controllers/HomeController");
const adminC = require("../src/controllers/AdminController");

router.get("/test",function(req,res,next){
    res.send("test");
});

router.get("/",homeC.index);
router.get("/recherche",homeC.searchFilms);
router.post("/recherche",homeC.searchFilms);
router.get("/inscription",homeC.register);
router.post("/inscription",homeC.traitregistion);
router.get("/connexion",homeC.connection);
router.post("/connexion",homeC.traitconnection);
router.get("/deconnexion",homeC.logout);
router.get("/categorie/:name",homeC.getFilmsByCategory);
router.get("/film/:id",homeC.getOneFilmById);
router.post("/setcomment/:id",homeC.setComment);
router.get("/deletecomment/:id",homeC.deleteComment);
router.get("/admin/ajouter-film",adminC.addOneFilm);
router.post("/admin/ajouter-film",adminC.traitAddOneFilm);
router.get("/admin/tous-les-films",adminC.allFilms);
router.get("/admin/deleteonefilm/:id",adminC.deleteOneFilm);
router.get("/admin/modifier-film/:id",adminC.updateOneFilm);
router.post("/admin/modifier-film/:id",adminC.traitUpdateOneFilm);


module.exports = router;