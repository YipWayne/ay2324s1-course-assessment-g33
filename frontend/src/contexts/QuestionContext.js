import React, { createContext, useState } from "react";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [question, setQuestion] = useState({
    titleSlug: "no_question",
    problem: "no question",
  });

  return (
    <QuestionContext.Provider
      value={{
        question,
        setQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
