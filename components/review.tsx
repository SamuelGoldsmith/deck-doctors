import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
interface ReviewProps {
    name: string;
    review: string;
    stars: number;
}

export default function Review({ name, review, stars }: ReviewProps) {
    
    return (
        <div className="border p-4 rounded shadow-md mb-4 sm:4/5 m:w-4/5 w-2/3 mx-auto mt-4 bg-white">
            <div className="flex items-center mb-2">
                <h3 className="text-xl">{name}</h3>
                <div className="ml-auto flex items-center">
                {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-yellow-500">
                        {index < stars ? <AiFillStar /> : <AiOutlineStar />}
                    </span>
                ))}
                </div>
            </div>
            <hr className="my-2" />
            <p>{review}</p>
        </div>
    )
}