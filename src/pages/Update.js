import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import supabase from "../config/supabaseClient"

const Update = () => {

  const {id}= useParams()
  const navigate = useNavigate()

  const [title,setTitle] = useState('')
  const [recipe,setRecipe] = useState('')
  const [rating,setRating] = useState('')
  const [formError,setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !recipe || !rating) {
      setFormError('Please fill in all the fields correctly');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('smoothies')
        .update({ title, recipe, rating })
        .eq('id',id)
        .select();
  
      if (error) {
        setFormError('Please fill in all the fields correctly');
        return;
      }
  
      if (data) {
        setFormError(null);
        navigate('/');
      } else {
        console.log("Navigation skipped due to missing data.");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setFormError('Unexpected error occurred.');
    }
  }

  useEffect(()=>{
    const fetchSmoothie = async () => {
      const { data, error }= await supabase.from('smoothies').select().eq('id',id).single()

      if(error){
        navigate('/',{replace:true})
      }

      if(data){
        setTitle(data.title);
        setRecipe(data.recipe);
        setRating(data.rating);
      }
    }

    fetchSmoothie()
  },[id,navigate])

  return (
    <div className="page update">
     <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input value={title} id="title" type="text" onChange={(e)=> setTitle(e.target.value)}/>

        <label htmlFor="recipe">Recipe:</label>
        <textarea value={recipe} id="recipe" onChange={(e)=> setRecipe(e.target.value)}/>

        <label htmlFor="rating">Rating:</label>
        <input value={rating} id="rating" type="number" onChange={(e)=> setRating(e.target.value)}/>

        <button>Update Smoothie Recipe</button>

        {formError && (<p className="error">{formError}</p>)}
      </form>
    </div>
  )
}

export default Update;