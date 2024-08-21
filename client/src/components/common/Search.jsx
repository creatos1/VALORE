import React from 'react'
import { SearchIcon } from './icons/SearchIcon.jsx'

export const Search = ({ text, filter }) => {
  return (
    <div className="container">
      <form action="" method="" className="search-bar input">
        <label htmlFor="searchInput">
          <div><SearchIcon /></div>
        </label>
        <input
          type="text"
          placeholder={text}
          name="search"
          id="searchInput"
          onChange={filter}
        />
      </form>
    </div>
  )
}
