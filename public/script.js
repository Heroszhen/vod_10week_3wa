$("#adminaddmovie #searchmovies #btnsearchmovies").click(function(){
    let keywords = $("#adminaddmovie #searchmovies input#searchbytitle").val();
    $.get(
        "https://api.themoviedb.org/3/search/movie?api_key=d14e8f1ec367a323273f1dd05f3b4db5&query="+keywords+"&page=1",
        function (response) {
            //console.log(response);
            $("#adminaddmovie #searchmovies #listmovies").html("");
            if(response.results.length != 0){
                response.results.forEach(elm=>{
                    $("#adminaddmovie #searchmovies #listmovies").append("<div class='onemovie' data-id='"+elm["id"]+"'>"+elm["original_title"]+"</div>");
                });
            }
        }
    );
});

$("#adminaddmovie #searchmovies #listmovies").on('click',".onemovie",function(){
    $("#loader").css("display","flex");
    let id = $(this).attr("data-id");
    let movie = new Object();
    movie["id"] = id;
    searchMovieById(id,movie);
});

function searchMovieById(id,movie){
    $.get(
        "https://api.themoviedb.org/3/movie/"+id+"?api_key=d14e8f1ec367a323273f1dd05f3b4db5",
        function (response) {
            //console.log(response);
            movie['title'] = response["original_title"];
            if(response["production_countries"].length != 0)movie["country"] = response["production_countries"][0]["name"];
            else movie["country"] = "";
            movie["plot"] = response["overview"];
            movie["release"] = response["release_date"];
            movie["last"] = response["runtime"];
            movie["genres"] = "";
            response["genres"].forEach(elm=>{
                movie["genres"] += elm["name"] + ",";
            })
            getImageByMovieId(id,movie);
        }
    );
}

function getImageByMovieId(id,movie){
    $.get(
        "https://api.themoviedb.org/3/movie/"+id+"/images?api_key=d14e8f1ec367a323273f1dd05f3b4db5",
        function (response) {
            //console.log(response);
            if(response["backdrops"].length != 0)movie["photo"] = "https://image.tmdb.org/t/p/w500"+response["backdrops"][0]["file_path"];
            else movie["photo"] = "";
            getVideoByMovieId(id,movie);
        }
    );
}

function getVideoByMovieId(id,movie){/*
    $.get(
        "https://api.themoviedb.org/3/movie/"+id+"/videos?api_key=d14e8f1ec367a323273f1dd05f3b4db5",
        function (response) {
            console.log(response);
            movie["video"] = response["results"][0]["key"];
            getActorsByMovieId(id,movie);
        }
    );*/
    fetch("https://api.themoviedb.org/3/movie/"+id+"/videos?api_key=d14e8f1ec367a323273f1dd05f3b4db5")
    .then(response=>{return response.json();})
    .then(json=>{
        console.log(json);
        movie["video"] = json["results"][0]["key"];
        getActorsByMovieId(id,movie);
    })
}

function getActorsByMovieId(id,movie){
    $.get(
        "https://api.themoviedb.org/3/movie/"+id+"/credits?api_key=d14e8f1ec367a323273f1dd05f3b4db5",
        function (response) {
            //console.log(response);
            let actors = "";
            for(let i = 0;i < response.cast.length;i++){
                if(i == 0)actors += response.cast[0]["name"];
                else actors += ","+response.cast[i]["name"];
                if(i==10)break;
            }
            //movie["actors"] = actors;
            //console.log(movie);

            $("#adminaddmovie form input#title").val(movie["title"]);
            $("#adminaddmovie form input#actors").val(actors);
            $("#adminaddmovie form input#country").val(movie["country"]);
            $("#adminaddmovie form textarea#plot").val(movie["plot"]);
            $("#adminaddmovie form input#last").val(movie["last"]);
            $("#adminaddmovie form input#photo").val(movie["photo"]);
            $("#adminaddmovie form input#release").val(movie["release"]);
            $("#adminaddmovie form input#genres").val(movie["genres"]);
            $("#adminaddmovie form input#video").val(movie["video"]);
            $("#adminaddmovie form input#idthemoviedb").val(movie["id"]);

            $("#loader").css("display","none");
        }
    );
}


document.querySelector("#onefilm button#sendcomment").addEventListener("click",function(){
    let comment = document.querySelector("#onefilm textarea#floatingTextarea").value;
    if(comment != "" && comment != null){
        let filmid = document.querySelector("#onefilm").getAttribute("data-id");
        fetch('/setcomment/'+filmid, {
            method: 'post',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({comment:comment})
        }).then(function(response) {
            //console.log(response);
            return response.text();
        }).then(function(data) {/*
            let div = document.createElement("div");
            div.setAttribute("class","mb-3");

            let span1 = document.createElement("span");
            span1.setAttribute("class","fw-bold h4 text-primary");
            span1.textContent = data;
            div.appendChild(span1);

            let span2 = document.createElement("span");
            span2.setAttribute("class","text-info");
            span2.textContent = "(" + new Date() + ")";
            div.appendChild(span2);

            let div2 = document.createElement("div");
            div2.textContent = comment;
            div.appendChild(div2);*/
            let currentHtml = document.querySelector("#onefilm #listcomments").innerHTML;
            document.querySelector("#onefilm #listcomments").innerHTML = data+currentHtml;
            document.querySelector("#onefilm textarea#floatingTextarea").value = "";
            
            document.querySelectorAll("#onefilm .deletecomment").forEach(e=>{
                e.addEventListener("click",function(e2){
                    let parent = this.parentElement;
                    let movieid = document.querySelector("#onefilm").getAttribute("data-id");
                    let commentid = this.getAttribute("data-id");console.log(movieid,commentid);
                    fetch("/deletecomment/"+movieid+"_"+commentid)
                    .then(response=>{return response.text();})
                    .then(json=>{
                        parent.remove();
                    })
                });
            });
        });
    }
});


document.querySelectorAll("#onefilm .deletecomment").forEach(e=>{
    e.addEventListener("click",function(e2){
        let parent = this.parentElement;
        let movieid = document.querySelector("#onefilm").getAttribute("data-id");
        let commentid = this.getAttribute("data-id");console.log(movieid,commentid);
        fetch("/deletecomment/"+movieid+"_"+commentid)
        .then(response=>{return response.text();})
        .then(json=>{
            parent.remove();
        })
    });
});



