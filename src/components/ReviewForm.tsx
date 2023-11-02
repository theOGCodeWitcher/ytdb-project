import { useState } from "react";
import { ReviewFormProps } from "../types/type";
import SectionHeading from "./SectionHeading";
import MessageComponent from "./MessageComponent";

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [attributes, setAttributes] = useState<string[]>([]);
  const [Message, setMessage] = useState<string>("");
  const [showMessage, setshowMessage] = useState<boolean>(false);

  const handleAttributeToggle = (attr: string) => {
    setshowMessage(false);
    setAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0 || attributes.length === 0) {
      setMessage("Please provide a rating and select at least one tag.");
      setshowMessage(true);
      return;
    }

    onSubmit({ rating, comment, attributes });
  };

  return (
    <div className=" w-full md:w-1/2 rounded-lg px-4 md:mx-8">
      <SectionHeading>Add Your Review</SectionHeading>
      {showMessage && <MessageComponent>{Message}</MessageComponent>}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex flex-row gap-12 md:gap-2 md:flex-col">
          <p className="mb-2 text-xl pt-1">Overall Rating</p>
          <div>
            {[...Array(5)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setshowMessage(false);
                  setRating(idx + 1);
                }}
                className={`mr-1 ${
                  rating > idx ? "text-yellow-400" : "text-gray-400 "
                }`}
                style={{ fontSize: "24px" }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <p className="mb-2">What best describes this channel?</p>
        <div className="flex flex-col h-[15rem] flex-wrap">
          {[
            "Informative",
            "Engaging",
            "Authentic",
            "Upbeat",
            "Thought-provoking",
            "Lighthearted",
            "Insightful",
            "Whimsical",
            "Heartwarming",
            "Challenging",
            "Dull",
            "Superficial",
            "Predictable",
            "Disjointed",
            "Monotonous",
          ].map((attr) => (
            <label key={attr} className="mr-4 inline-flex items-center">
              <input
                type="checkbox"
                value={attr}
                checked={attributes.includes(attr)}
                onChange={() => handleAttributeToggle(attr)}
                className="form-checkbox h-5 w-5 mr-2"
              />
              {attr}
            </label>
          ))}
        </div>

        <div>
          <textarea
            name="review"
            placeholder="Please! Add Your Review"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <button className="btn btn-outline btn-primary">Post review</button>
      </form>
    </div>
  );
}