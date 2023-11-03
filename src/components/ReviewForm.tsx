import { useEffect, useState } from "react";
import { ReviewFormProps } from "../types/type";
import SectionHeading from "./SectionHeading";
import MessageComponent from "./MessageComponent";
import { reviewTags } from "../lib/data";
import { useParams } from "react-router-dom";
import { getUserID_db } from "../context/customHooks";
import { useAuth0 } from "@auth0/auth0-react";

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [Message, setMessage] = useState<string>("");
  const [showMessage, setshowMessage] = useState<boolean>(false);
  const { loginWithRedirect } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { channelId } = useParams<string>();
  const userId = getUserID_db();
  const handleAttributeToggle = (attr: string) => {
    setshowMessage(false);
    setTags((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0 || tags.length === 0 || review.length < 20) {
      setMessage("Please fill all the fields before submission.");
      setshowMessage(true);
      return;
    }

    if (!userId) {
      setIsModalOpen(true);
      return; // Return here to stop the rest of the function execution
    }

    if (channelId && userId) {
      onSubmit({ channelId, rating, userId, review, tags }, clearForm);
    }
  };

  const clearForm = () => {
    setRating(0);
    setReview("");
    setTags([]);
    setMessage("");
    setshowMessage(false);
  };

  useEffect(() => {
    if (userId) {
      setIsModalOpen(false);
    }
  }, [userId]);

  return (
    <div className=" w-full md:w-1/2 rounded-lg px-4 md:mx-8">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="text-xl">Authentication Required</h2>
              <p>You need to log in to post a review.</p>
              <div className="modal-action">
                <button
                  onClick={() =>
                    loginWithRedirect({
                      appState: {
                        returnTo: location.pathname,
                      },
                    })
                  }
                  className="btn"
                >
                  Log in
                </button>
                <button onClick={() => setIsModalOpen(false)} className="btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex flex-col h-[10rem] flex-wrap">
          {reviewTags.map((attr) => (
            <label key={attr} className="mr-4 inline-flex items-center">
              <input
                type="checkbox"
                value={attr}
                checked={tags.includes(attr)}
                onChange={() => handleAttributeToggle(attr)}
                className="form-checkbox h-5 w-5 mr-2"
              />
              {attr}
            </label>
          ))}
        </div>

        <div>
          <div className="w-full   rounded relative">
            <textarea
              name="review"
              placeholder="Please! Add Your Review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full h-full resize-none focus:ring-0 border p-2 dark:border-black focus:outline-none"
              maxLength={200}
            ></textarea>
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {review.length}/200
            </div>
          </div>
        </div>

        <button className="btn btn-outline btn-primary">Post review</button>
      </form>
    </div>
  );
}
