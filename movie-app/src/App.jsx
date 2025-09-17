import React, { useEffect,useState } from 'react'
import Search from './components/search'
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from "react-use";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // useDebounce(()=> {setDebouncedSearchTerm(searchTerm)},500,[searchTerm]); //debouncing use to minimize api calls when searching by waiting for user to stop typing for 500ms to send an api call.

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` //takes care of wired querys
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error("failed fetched movies")
      }

      const data = await response.json()
      
      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return;
      }

      setMovieList(data.results || [])

    }
    catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching moveies, Please try again later.")
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]); //empty dependency array to only run once the component loads
//A side effect is any work that doesn't directly relate to rendering the UI

//useEffect(() => { ... }, []); (Empty Array)
//This tells React: "Run this effect only once, right after the component mounts (i.e., renders for the very first time)." This is perfect for initial data fetching.

//useEffect(() => { ... }, [someValue]); (Array with Values)
//This tells React: "Run this effect after the first render, and then re-run it only if someValue has changed since the last render."
  
return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt='Hero Banner' />
          <h1>Find <span className='text-gradient'>Movies</span>You'll Enjoy Movies without the hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie)=>{
                return (
                  <MovieCard key={movie.id} movie={movie} />
                )
              })}
            </ul>
          )}
        </section>
      </div>

    </main>
  )
}

export default App