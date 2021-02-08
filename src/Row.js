import axios from './axios'
import React, {useEffect, useState} from 'react'
import './Row.css'
import Youtube from 'react-youtube'
import movieTrailer from 'movie-trailer';

function Row({title, fetchUrl, isLargeRow = false}) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("")
    const base_url ="https://image.tmdb.org/t/p/original/"

    useEffect(()=>{
        async function fecthData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            return request
        }
        fecthData()
    }, [fetchUrl])

    
    const handleClick = (movie) => {
       console.log(movie)
        if(trailerUrl){
            setTrailerUrl(""); //click again to stop take off the video
        }else{
            
            movieTrailer(null, {tmdbId: movie.id, id: true})
            .then((urlID) =>{

                setTrailerUrl(urlID)
                // console.log(url)
                // // example => https://www.youtube.com/watch?v=XtMThy8QKqU&t=9446s
                // const urlParams = new URLSearchParams( new URL(url).search)
                // setTrailerUrl(urlParams.get('v'))
            })
            .catch((err)=> console.log(err))
        }
    }

    const opts = {
        height: "390",
        width: "100%",
        playerVars:{
            autoplay:1,
        }
    }
    


    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
            {
                movies.map(movie=>(


                        <img 
                        key={movie.id}
                        onClick={()=>handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        alt={movie.name} src={`${base_url}${
                        isLargeRow? movie.poster_path : movie.backdrop_path
                    }`}/>


                    
                    )
                    
                )
            }
            </div>
            {trailerUrl && <Youtube videoId = {trailerUrl} opts={opts}/>}
            
        </div>
    )
}

export default Row
