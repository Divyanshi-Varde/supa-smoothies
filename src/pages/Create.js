import React, { useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate } from "react-router-dom"

const Create = () => {
  const navigate = useNavigate()

  const [title,setTitle] = useState('')
  const [recipe,setRecipe] = useState('')
  const [rating,setRating] = useState('')
  const [formError,setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !recipe || !rating) {
      setFormError('Please fill in all the fields correctly');
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('smoothies')
        .insert([{ title, recipe, rating }])
        .select();
  
      if (error) {
        console.error("Supabase Error:", error);
        setFormError('Error inserting data: ' + error.message);
        return;
      }
  
      if (data) {
        console.log("Data inserted:", data);
        setFormError(null);
        navigate('/');
      } else {
        console.log("Navigation skipped due to missing data.");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setFormError('Unexpected error occurred.');
    }
  };
  
  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input value={title} id="title" type="text" onChange={(e)=> setTitle(e.target.value)}/>

        <label htmlFor="recipe">Recipe:</label>
        <textarea value={recipe} id="recipe" onChange={(e)=> setRecipe(e.target.value)}/>

        <label htmlFor="rating">Rating:</label>
        <input value={rating} id="rating" type="number" onChange={(e)=> setRating(e.target.value)}/>

        <button>Create Smoothie Recipe</button>

        {formError && (<p className="error">{formError}</p>)}
      </form>
    </div>
  )
}

export default Create