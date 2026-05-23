import React, {
  useState,
} from "react";

const AddGoalForm = () => {
  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    alert("Goal Added Successfully");

    setTitle("");
    setAmount("");
  };

  return (
    <form
      className="goal-form"
      onSubmit={handleSubmit}
    >
      <div>
        <label>Goal Title</label>

        <input
          type="text"
          placeholder="Enter goal title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />
      </div>

      <div>
        <label>Target Amount</label>

        <input
          type="number"
          placeholder="Enter target amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />
      </div>

      <button type="submit">
        Add Goal
      </button>
    </form>
  );
};

export default AddGoalForm;