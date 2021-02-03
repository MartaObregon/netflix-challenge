import axios from './axios'
import React, {useEffect, useState} from 'react'
import './Row.css'

function Row({title, fetchUrl, isLargeRow = false}) {

    const [movies, setMovies] = useState([]);
    const base_url ="https://image.tmdb.org/t/p/original/"

    useEffect(()=>{
        async function fecthData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            return request
        }
        fecthData()
    }, [fetchUrl])
    


    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
            {
                movies.map(movie=>(
                    
                        <img 
                        key={movie.id}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        alt={movie.name} src={`${base_url}${
                        isLargeRow? movie.poster_path : movie.backdrop_path
                    }`}/>
                    )
                    
                )
            }
            </div>
            
        </div>
    )
}

export default Row
