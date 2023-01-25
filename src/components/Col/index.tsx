import React from "react";

import "./styles.css";

interface IColProps {
  children?: React.ReactNode;
  title?: string;
}

export default function Col({ children, title }: IColProps) {
  return (
    <div className="col-container">
      <div className="col-title-container">
        <span>{title}</span>
      </div>
      <div className="col-content-container">{children}</div>
    </div>
  );
}
